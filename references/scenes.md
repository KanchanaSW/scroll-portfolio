# Scenes

Nine sections on the track, each `data-scene="{id}"`, `w-screen h-full shrink-0`. Import copy from `portfolio`. Use `ParallaxLayer` for far/mid/near.

## 1 · Hero (`hero`)

Oversized display type: name, role, location. Camera starts at scale ~1.12 (see camera.md) so the first scroll is a pull-back, not a slide. No autoplaying loop. One primary CTA (scroll or jump to projects) is enough.

## 2 · Summary (`summary`)

The 4+ years / enterprise SaaS positioning statement as large readable prose. Split into words or clauses; reveal with `containerAnimation` as they cross ~70% from the left. Do not use a typewriter RAF.

## 3 · Impact (`impact`)

Counters from `portfolio.impact`. Tween on scene `onEnter` (`once: true`). Format with the suffix in the data (`4+`, not a hardcoded plus in JSX). Keep the set to real résumé claims — do not inflate.

## 4 · Skills (`skills`)

Grouped nodes from `portfolio.skills`: Languages, Frameworks, State/Data, UI, Backend/Cloud, Mobile, Analytics. Lay out in depth (far groups recede). This scene is the wide shot: hold scale near the seam value so the whole toolkit is visible, then push back in toward the next scene.

## 5 · Experience (`experience`)

A real time axis, left-to-right, **Mar 2022 → Present**. Stations: Informatics → Axiata (SE → Senior SE promotion marked **inline** on the same card, not a separate stop) → Tribird. Overlapping dates are overlapping cards on the axis, not a vertical list. Achievement bullets stagger when the station's center crosses the viewport center (`start: 'center center'` with `containerAnimation`).

## 6 · Projects (`projects`)

Cards for JSON Vibe, SL Stocks, Wildwood Packiyo, SmartNas. JSON Vibe is live (`https://jsonshare.org`).

### Flip zoom (required)

Clicking a card is functional zoom, not a fade:

1. Record Flip state of the card
2. Open a full-viewport detail panel (stack, highlights, live link) mounted in a portal
3. `Flip.from(state, { duration: 0.55, ease: 'power2.inOut', absolute: true })` so the card scales from its on-canvas position
4. Focus the close button; trap Tab inside the panel
5. Esc / close runs the reverse Flip, then unmounts
6. `prefers-reduced-motion`: skip Flip, instant panel

Custom cursor morphs over these cards to signal they are zoomable.

## 7 · Speaking (`speaking`)

Tech talk **Exploring the Future of Coding with Cursor AI** plus mentoring / architecture leadership, framed as the tech-lead track. Do not bury this in experience bullets.

## 8 · Education (`education`)

Staffordshire University (APIIT) and Udemy React certification. Quiet scene; keep type large and the layout sparse.

## 9 · Contact (`contact`)

Email, GitHub, LinkedIn, phone, résumé download. Camera scale eases toward ~0.55 so this is a closing wide shot of the canvas already traveled. `mailto:` and real `https` links; résumé is a static file in `public/`.

## Scene component contract

```tsx
type SceneProps = {
  panTween: React.RefObject<gsap.core.Tween | null>
  reduced: boolean
  vertical: boolean // matchMedia <768 or reduced-motion
}
```

When `vertical` is true: render the same content as a block in document flow; use simple opacity/y reveals or none. No pin, no `containerAnimation`.
