---
name: scroll-portfolio
description: >-
  Builds a cinematic horizontal-scroll portfolio SPA (Vite + React + Lenis +
  GSAP camera, typed résumé content, nine scenes). Use when the user wants a
  scroll-portfolio, cinematic portfolio, horizontal-scroll résumé, Lenis+GSAP
  stage, camera pan/zoom/parallax site, or to scaffold/extend this format in
  Cursor or Claude. Not for concept explainers or ordinary multi-page marketing
  sites.
---

# scroll-portfolio

One résumé. One fixed-viewport stage. Vertical scroll drives a **camera** that pans a horizontal track and zooms at scene seams. Reading the page is traveling the career.

This is not CSS `overflow-x`, not scroll-snap, not a slideshow. If the implementation has more than one animation frame loop, it is wrong.

## The one hard rule

**A single scroll authority.** Lenis owns scroll position. GSAP's ticker owns the frame loop. Nothing else creates a `requestAnimationFrame` loop — not Lenis `autoRaf`, not Motion `useScroll`/`whileInView`, not a manual `raf()`.

```
wheel / trackpad / touch → Lenis lerp → gsap.ticker (the only RAF)
  → ScrollTrigger.update → camera timeline
       → track x: -(progress * (trackWidth - vw))
       → wrapper scale: 1 → 0.82 → 1 at scene seams
       → per-scene reveals via containerAnimation
```

## Format laws

Violating one re-creates a failure that has already been paid for.

1. **Lenis on ticker, never on its own RAF.** `autoRaf: false`. `lenis.on('scroll', ScrollTrigger.update)`. `gsap.ticker.add((t) => lenis.raf(t * 1000))`. `gsap.ticker.lagSmoothing(0)`. Cleanup removes the ticker callback and `lenis.destroy()`.
2. **Pin + translate, never native horizontal overflow.** Stage is a fixed viewport. `pin: true` creates the spacer. The track is a horizontal flex row whose `x` is scrubbed. Do not set `overflow-x: auto` on `body` or the stage.
3. **In-scene triggers use `containerAnimation`.** Every reveal inside the track passes `containerAnimation: panTween` and uses **left/right** start/end (`left center`, not `top center`). This is the GSAP API most ports get wrong.
4. **Content lives in `src/content/portfolio.ts`.** Scenes are pure presentation. Never hardcode résumé strings in JSX.
5. **GSAP owns scroll-linked motion.** Motion (Framer Motion successor) is allowed only for local UI (dialog open, command palette, theme icon). Ban `useScroll`, `useTransform` tied to scroll, `whileInView`, and CSS scroll-driven animations.
6. **Animate only `transform` and `opacity`.** `will-change: transform` on the track and camera wrapper, nowhere else.
7. **`gsap.matchMedia()` owns variants.** Below 768px: no pinning; vertical document; lighter fade/slide. `prefers-reduced-motion: reduce`: Lenis lerp 1 (no easing), camera timeline never built, plain vertical document. Non-negotiable.
8. **Fonts then `ScrollTrigger.refresh()`.** Preloader holds until `document.fonts.ready`. Skip this and trigger positions drift after font swap.
9. **One Lenis, one camera, one `useGSAP` tree.** `@gsap/react` `useGSAP` for creation and cleanup. Register `ScrollTrigger` and `Flip` once. Do not construct Lenis per scene.

## When to use

- Cinematic / horizontal-scroll / "camera" portfolio or résumé site
- Scaffolding or extending this stack (Vite 7, React 19, Tailwind v4, shadcn, Lenis, GSAP)
- Adding a scene, Flip project zoom, command palette, or progress rail to an existing scroll-portfolio

**Not this skill:** a concept explainer zoom-canvas (that is conceptcraft). A data story with a sticky/pinned chart (that is scrollytelling-data). A conventional multi-route marketing site. A vertically stacked résumé with no camera.

## Workflow

Copy this checklist and work it in order. Read the linked file before that step's code.

```
Build:
- [ ] 0 Interview (subject, résumé source, live URLs, OG image)
- [ ] 1 Scaffold stack                    → references/stack.md
- [ ] 2 Content model + types             → references/content.md
- [ ] 3 Camera (Lenis ticker, pan, zoom)  → references/camera.md
- [ ] 4 Nine scenes                       → references/scenes.md
- [ ] 5 Chrome (rail, command, theme…)    → references/chrome.md
- [ ] 6 matchMedia + a11y + print         → references/a11y.md
- [ ] 7 Verify pan at 60fps, reduced-motion, mobile, keyboard
```

**REQUIRED reading before any animation code:** [references/camera.md](references/camera.md) and [templates/SmoothScrollProvider.tsx](templates/SmoothScrollProvider.tsx). Copy those templates; do not reinvent the ticker.

**File tree:** [references/structure.md](references/structure.md)

**When something is janky, drifting, or double-scrolling:** [references/gotchas.md](references/gotchas.md) first.

### 0 · Interview (short)

One pass, then default everything else:

1. **Subject** — name, role, location, links (or a résumé file/URL)
2. **Live work** — which projects are public, which URLs
3. **Voice** — display type + one accent; light/dark default
4. **Close** — résumé PDF path for download

If no human is reachable, use the typed defaults in `templates/portfolio.ts` and mark the build report "interview self-answered".

### 1 · Scaffold

Exact packages and commands: [references/stack.md](references/stack.md). Vite 7 + React 19 + TS SPA. Tailwind v4 via `@tailwindcss/vite` (no `tailwind.config.js`). shadcn with `npx shadcn@latest init -t vite`. Deploy is a Vercel static build.

### 2 · Content

Extract the résumé into `src/content/portfolio.ts` as `as const` data. Shape: [references/content.md](references/content.md). Scenes import from there only.

### 3 · Camera

Fixed stage → camera wrapper (scale) → track (x). Pan tween is the `containerAnimation` parent. Zoom keyframes dip to ~0.82 at seams, 1.0 at scene centers; hero starts slightly zoomed in; contact pulls out to ~0.55. Each scene has far/mid/near parallax layers on the same progress. Implementation: [references/camera.md](references/camera.md), [templates/useCamera.ts](templates/useCamera.ts).

### 4 · Scenes

Nine scenes, left to right. Details and Flip project zoom: [references/scenes.md](references/scenes.md).

| # | id | Beat |
|---|---|---|
| 1 | `hero` | Oversized name; camera starts in and pulls back |
| 2 | `summary` | Positioning statement; words reveal on pan |
| 3 | `impact` | Counters run on scene enter |
| 4 | `skills` | Grouped constellation; camera zooms out then in |
| 5 | `experience` | Time axis Mar 2022 → Present; stations stagger at center |
| 6 | `projects` | Cards; Flip zoom into detail; Esc reverses |
| 7 | `speaking` | Talk + mentorship / tech-lead track |
| 8 | `education` | Degree + certifications |
| 9 | `contact` | Links + résumé; camera zooms out over the traversed canvas |

Mount heavy scene internals lazily off ScrollTrigger `onToggle` when the scene is active (or adjacent). Keep node count low — all nine stay in the DOM.

### 5 · Chrome

Command palette (Cmd/Ctrl+K), progress rail, keyboard (arrows, PageUp/Down, Home/End, digits 1–9), theme toggle, custom cursor on project cards, preloader, SEO/JSON-LD. [references/chrome.md](references/chrome.md).

### 6 · Responsive and a11y

`gsap.matchMedia()` only — do not fork two apps. Skip link, semantic headings, focus trap in the Flip panel, print stylesheet. [references/a11y.md](references/a11y.md).

### 7 · Verify before shipping

- Desktop cinematic: wheel and trackpad pan is one smooth motion; no second jitter layer
- DevTools Performance: one RAF family during pan; no extra scripts pumping frames
- Resize: `ScrollTrigger.refresh()` via Lenis/GSAP; no gap at the last scene
- `<768px`: vertical, unpinned, scenes readable
- `prefers-reduced-motion`: no camera, no Lenis easing, no Flip zoom (instant panel)
- Keyboard: scene jumps, Flip Esc, command palette, skip link
- Fonts: hard-reload; triggers still align (preloader path)
- `Cmd+P`: clean résumé, not the stage

## Stack (pinned)

| Layer | Choice |
|---|---|
| App | Vite 7 + React 19 + TypeScript SPA |
| CSS | Tailwind CSS v4 via `@tailwindcss/vite`, CSS-first, no `tailwind.config.js` |
| UI | shadcn/ui on Radix, `npx shadcn@latest init -t vite` |
| Scroll | Lenis |
| Motion (scroll) | GSAP + ScrollTrigger + Flip, `@gsap/react` |
| Motion (local UI) | Motion, never scroll-linked |
| Host | Vercel static |

## Red flags — stop and fix

- `requestAnimationFrame(raf)` wrapping `lenis.raf`
- `overflow-x: auto` / `scroll-snap-type: x` on the stage
- `start: 'top center'` on an element inside the track
- Résumé copy typed into a scene component
- `pin: true` without a `matchMedia` desktop-only query
- Motion `useScroll` driving the track
- `will-change` on every card
- `ScrollTrigger.refresh()` never called after fonts
- A second Lenis instance

**All of these mean: the camera is wrong. Re-read camera.md; do not patch around it.**
