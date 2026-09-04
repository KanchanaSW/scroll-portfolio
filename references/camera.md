# Camera

Read this before writing any animation. Copy [templates/SmoothScrollProvider.tsx](../templates/SmoothScrollProvider.tsx) and [templates/useCamera.ts](../templates/useCamera.ts).

## DOM

```
#root
  SmoothScrollProvider
    Preloader (until fonts.ready → ScrollTrigger.refresh())
    Stage          position:fixed; inset:0; overflow:hidden   // pinned on desktop
      Camera       will-change:transform; transform-origin:center  // SCALE
        Track      display:flex; height:100%; will-change:transform // X
          Scene × 9   width:100vw; height:100%; flex-shrink:0
            ParallaxLayer far | mid | near
    (pin-spacer is created by ScrollTrigger — do not add a second spacer)
    chrome: ProgressRail, CommandPalette, Cursor, skip link
```

Stage is the pin target. Track is the pan target. Camera wrapper is the zoom target.

## Scroll authority (copy exactly)

```ts
const lenis = new Lenis({ autoRaf: false, lerp: reducedMotion ? 1 : 0.1 })
lenis.on('scroll', ScrollTrigger.update)
const onTick = (time: number) => lenis.raf(time * 1000)
gsap.ticker.add(onTick)
gsap.ticker.lagSmoothing(0)
// cleanup: gsap.ticker.remove(onTick); lenis.destroy()
```

`time * 1000` because GSAP ticker is seconds and Lenis `raf` is milliseconds.

## Pan

Desktop only, inside `gsap.matchMedia()` for `(min-width: 768px)` and `prefers-reduced-motion: no-preference`.

```ts
const distance = () => Math.max(0, track.scrollWidth - window.innerWidth)

const panTween = gsap.to(track, {
  x: () => -distance(),
  ease: 'none',
  scrollTrigger: {
    trigger: stage,
    pin: true,
    scrub: 1,
    anticipatePin: 1,
    invalidateOnRefresh: true,
    end: () => '+=' + distance(),
  },
})
```

`end` MUST equal the x distance (`scrollWidth - innerWidth`), not raw `scrollWidth`. Otherwise the last scene never sits flush.

Keep `panTween` in a ref. Every in-scene ScrollTrigger receives `containerAnimation: panTween`.

## Zoom

Same scroll range as pan (do not pin twice). Keyframes on the camera wrapper:

| Progress | Scale | Beat |
|---|---|---|
| 0 (hero) | ~1.12 | start zoomed into the name |
| each scene center | 1.0 | readable |
| each scene seam | ~0.82 | pull back to see the map |
| last ~8% (contact) | ~0.55 | reveal the traversed canvas |

Build from scene count; do not hardcode nine magic numbers if a scene is added.

```ts
Keyframe `p` is scroll progress. Tween **durations must sum to 1** (sequential `duration: b.p - a.p`). Do not pass `p` as a GSAP position parameter — that is seconds, not progress. See `templates/useCamera.ts`.```

Skills (`data-scene="skills"`) should sit at a seam-like wide shot a beat longer so the constellation reads as one toolkit.

## In-scene reveals

```ts
gsap.from(el, {
  opacity: 0,
  y: 24,
  ease: 'power2.out',
  scrollTrigger: {
    trigger: el,
    containerAnimation: panTween,
    start: 'left 75%',
    end: 'left 35%',
    scrub: true,
  },
})
```

Horizontal container: **`left` / `right`**, never `top` / `bottom`.

Impact counters: `onEnter` of the scene with `containerAnimation`, `once: true`, tween a dummy object `{ n: 0 }` and write `textContent`.

## Parallax depth

Three layers per scene, same progress, different x multipliers relative to the scene (not another RAF):

| Layer | Extra x factor |
|---|---|
| far | 0.12 |
| mid | 0.28 |
| near | 0.5 |

Wire with `containerAnimation: panTween` or a `quickTo` on the pan tween's `progress()`. Layers must be `transform` only.

## Resize and refresh

- `invalidateOnRefresh: true` on pan and zoom
- After fonts: `ScrollTrigger.refresh()`
- After Flip close and command-palette jumps: `lenis.resize()` then `ScrollTrigger.refresh()`
- `useGSAP` `revertOnUpdate: true` so matchMedia rebuilds cleanly

## What you are not allowed to add

- `new Lenis({ autoRaf: true })` or default auto RAF
- `function raf(t) { lenis.raf(t); requestAnimationFrame(raf) }`
- Locomotive Scroll, ScrollSmoother, `overflow-x` on the track's parent
- A second pin on individual scenes (the stage is the only pin)
