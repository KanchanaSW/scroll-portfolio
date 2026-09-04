# Camera (step index)

Read this before writing any scroll or chart code. Copy [templates/useStepIndex.ts](../templates/useStepIndex.ts), [templates/measureActiveStep.ts](../templates/measureActiveStep.ts), [templates/SmoothScrollProvider.tsx](../templates/SmoothScrollProvider.tsx), [templates/Scrolly.tsx](../templates/Scrolly.tsx), [templates/Chart.tsx](../templates/Chart.tsx), and [templates/NumberMorph.tsx](../templates/NumberMorph.tsx).

The "camera" in this format is not a pan/zoom wrapper. It is **the step index**. Same philosophy as scroll-portfolio: one scroll authority, one RAF, visual state derived from a single number. Different product: a vertical article with a pinned graphic.

## DOM

```
#root
  SmoothScrollProvider          // ticker only — does NOT wrap children in transform
    main                        // document flow; no will-change:transform
      article#scrolly           // two columns; pinSpacing:false so steps own the height
        Graphic                 // PIN TARGET — 50% width, untransformed ancestors
          Chart view={states[index]}
          NumberMorph value={states[index].headline}
        Steps                   // scroll distance; 50% width
          Step × N              // min-height ~100vh; data-step-index
      (pin-spacer is created by ScrollTrigger — do not add a second spacer)
```

Graphic is the pin target. Steps are the scroll distance. Chart is a function of `index`.

**Do not** place `#scrolly` inside scroll-portfolio's `.camera` / `.track`. That wrapper's `transform` is the sticky-containing-block trap.

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

## One writer

`useStepIndex` is the only module allowed to set the index. It measures every step's `getBoundingClientRect().top` against a trigger line (default: 40% of the viewport) on ScrollTrigger `onUpdate`. Fast-scroll cannot skip a measure — the landed geometry is the source of truth.

```ts
export function measureActiveStep(tops: number[], triggerY: number): number {
  let index = 0
  for (let i = 0; i < tops.length; i++) {
    if (tops[i] <= triggerY) index = i
  }
  return index
}
```

Same scroll position → same index, up or down. IntersectionObserver is not this function: it delivers a sparse delta of entries and will omit steps on a flick.

Per-step ScrollTriggers with `onEnter` / `onLeave` are forbidden as writers. They skip. They invite `chart.highlight(id)`.

## Pin, not sticky-inside-transform

Desktop, inside `gsap.matchMedia()` for `(min-width: 768px)`:

```ts
ScrollTrigger.create({
  trigger: scrolly,
  start: 'top top',
  end: () => '+=' + Math.max(0, steps.scrollHeight - window.innerHeight),
  pin: graphic,
  pinSpacing: false,
  anticipatePin: 1,
  invalidateOnRefresh: true,
  onUpdate: () => {
    const tops = stepEls.map((el) => el.getBoundingClientRect().top)
    setIndex(measureActiveStep(tops, window.innerHeight * 0.4))
  },
})
```

`end` is the steps' extra height, not `steps.scrollHeight` alone — otherwise the last step never holds the pin. `pinSpacing` is **false**: the steps column already is the spacer. `true` doubles the scroll distance.

CSS `position: sticky` is allowed **only** when every ancestor up to the scrolling viewport has no `transform`, `filter`, `perspective`, or `will-change: transform`. Lenis's default content wrapper often has one. If you cannot prove the chain is clean, pin.

## Chart API

```ts
type ChartView = {
  headline: number
  suffix: string
  marks: readonly { id: string; value: number; emphasis: boolean }[]
  annotation?: string
}

function viewFor(index: number): ChartView {
  return story.steps[index].chart
}

<Chart view={viewFor(index)} />
<NumberMorph value={viewFor(index).headline} />
```

`Chart` accepts `view`. It does not expose `highlight`, `reset`, `addSeries`, or `setNumber`. Internally it may tween from the previously painted `view` to the new one. That tween's **target** is always the current snapshot. A jump 0→5 tweens (or snaps) 0's paint → 5's snapshot, never through 1–4.

Optional intra-step scrub: the owner may also expose `t ∈ [0,1]` between `index` and `index+1`. Then `view = lerp(states[i], states[i+1], t)`. Still one owner. Still no queue. `|Δindex| > 1` sets `t = 0` at the destination.

## Resize

- `invalidateOnRefresh: true` on the pin
- After fonts: `ScrollTrigger.refresh()`
- `ResizeObserver` on the graphic: Chart recomputes scales from **current `view` + new box**
- Never call a step `onEnter` from a resize handler

## What you are not allowed to add

- `new Lenis({ autoRaf: true })` or a manual `requestAnimationFrame(raf)` loop
- A second Lenis on the steps column
- `chart.style.top = ...` on ticker/scroll to fake sticky
- `onEnter` / `onLeave` that mutate Chart
- A `queue: number[]` of skipped indices that `drain()` still plays
- Putting `#scrolly` inside a transformed camera wrapper
