---
name: scrollytelling-data
description: >-
  Use when building a data scrollytelling article, sticky/pinned chart with
  scrolling steps, NYT/Pudding-style graphic, scroll-driven chart states, or
  morphing headline numbers. Use when scrolling up and down produce different
  chart sequences, when steps call chart.highlight/reset/addSeries on
  enter/leave, when fast-scroll skips IntersectionObserver callbacks, or when
  position:sticky fails inside a Lenis/GSAP transformed parent. Not for
  cinematic résumé cameras (scroll-portfolio) or concept zoom-canvas
  (conceptcraft).
---

# scrollytelling-data

One dataset. One graphic that stays on screen. Vertical scroll drives a **step index**; the chart is only ever `states[index]`. Reading the piece is walking a data claim.

This is not enter/leave choreography, not a transition queue, not CSS sticky inside a camera wrapper. If scrolling up to a step looks different from scrolling down to it, the chart was poked.

## The one hard rule

**The chart is a pure function of the current step index.** Steps never imperatively poke the chart. The step index has exactly one owner.

```
wheel / trackpad / touch → Lenis lerp → gsap.ticker (the only RAF)
  → measure step rects against a trigger line
       → stepIndex (ONE writer)
       → chart = states[stepIndex]          // full snapshot, not a patch
       → numbers morph toward states[stepIndex].n
```

The failure this prevents: scrolling up plays a different sequence than scrolling down, because half the transitions were applied as side effects (`onEnter` → `addSeries`, `onLeave` → `reset`, a queue that is still draining).

## Format laws

Violating one re-creates a failure that has already been paid for.

1. **Full snapshots, never diffs.** Each step's `chart` field is the entire view (marks, highlight, domain, annotations, headline number). Not `{ add: 'coal' }`. Applying `states[i]` twice is a no-op. Applying `states[2]` looks the same whether the previous index was 1 or 5.
2. **One owner of `stepIndex`.** A single module measures geometry on the ticker and writes the index. Steps do not call `setIndex`. The chart does not call `setIndex`. IntersectionObserver is not the owner — it skips on fast scroll.
3. **No `onEnter` / `onLeave` that mutate the graphic.** Those callbacks may log or focus, never `chart.highlight()`, `addSeries()`, `reset()`, or `counter++`.
4. **Fast-scroll jumps to the landed state.** `|Δindex| > 1` does not enqueue beats 2→3→4→5. Morph from the last painted values to `states[to]`, or snap. Never replay skipped enters. Scroll-up is the same jump, not a reverse movie.
5. **Pin the graphic, do not sticky-inside-transform.** `position: sticky` fails if any ancestor has `transform`, `filter`, `perspective`, or `will-change: transform` (Lenis content and GSAP camera both count). ScrollTrigger `pin` on an **untransformed** ancestor, or sticky outside those wrappers. Do not fake sticky by writing `top` on a second RAF.
6. **Lenis on ticker, never on its own RAF.** Same contract as scroll-portfolio: `autoRaf: false`, `lenis.on('scroll', ScrollTrigger.update)`, `gsap.ticker.add`. One frame loop.
7. **Resize recomputes from the current index.** `invalidateOnRefresh: true`. Re-measure pin distance and scales. Do not replay enter side effects on resize.
8. **`gsap.matchMedia()` owns variants.** `prefers-reduced-motion: reduce`: no number tweens, snap marks, Lenis lerp 1. Below 768px: stack the graphic above the steps or pin a shorter graphic; same states, same owner.
9. **Copy lives in `src/content/story.ts`.** Steps are presentation. Never hardcode the claim, numbers, or series ids in JSX.

## When to use

- Data story / explainer with a chart that stays put while prose steps scroll
- Porting a Pudding/NYT scrolly where up and down already disagree
- Adding morphing headline numbers to a step-driven graphic

**Not this skill:** a cinematic horizontal-scroll résumé (that is scroll-portfolio). A concept zoom-canvas (that is conceptcraft). A dashboard with its own filters as the source of truth. A slideshow / scroll-snap carousel with no shared graphic.

## Workflow

Copy this checklist and work it in order. Read the linked file before that step's code.

```
Build:
- [ ] 0 Interview (claim, dataset, beat list)
- [ ] 1 Scaffold stack                         → references/stack.md
- [ ] 2 Content: one full chart snapshot/step  → references/content.md
- [ ] 3 Step index owner (the camera)          → references/camera.md
- [ ] 4 Pinned graphic + NumberMorph
- [ ] 5 matchMedia + a11y + print              → references/a11y.md
- [ ] 6 Verify up=down, fast-scroll, resize, reduced-motion
```

**REQUIRED reading before any scroll or chart code:** [references/camera.md](references/camera.md) and [templates/useStepIndex.ts](templates/useStepIndex.ts). Copy those templates; do not invent enter/leave.

**File tree:** [references/structure.md](references/structure.md)

**When up≠down, the graphic detaches, or sticky does nothing:** [references/gotchas.md](references/gotchas.md) first.

### 0 · Interview (short)

1. **Claim** — one sentence the graphic argues
2. **Data** — URL or file; what is a row; which fields become marks
3. **Beats** — ordered steps; each must name the full view, not a delta
4. **Voice** — display type + one accent

If no human is reachable, use [templates/story.ts](templates/story.ts) and mark the build report "interview self-answered".

### 6 · Verify before shipping

- Scroll down to step N and up to step N: same marks, highlight, number
- Flick the wheel from first step to last: chart shows the last snapshot, not a queued film of intermediates
- Resize at mid-story: axes fit the new box; headline does not replay from 0
- DevTools: one RAF family; no listener writing `chart.style.top`
- Computed style on every ancestor of the graphic: no `transform` / `filter` / `will-change: transform` if you used CSS sticky
- `prefers-reduced-motion`: numbers snap; marks snap
- Keyboard: next/previous step via `lenis.scrollTo(stepEl)`
- Print: linear article, unpinned

## Stack (pinned)

| Layer | Choice |
|---|---|
| App | Vite 7 + React 19 + TypeScript SPA |
| CSS | Tailwind CSS v4 via `@tailwindcss/vite` |
| Scroll | Lenis |
| Step owner / pin | GSAP + ScrollTrigger, `@gsap/react` |
| Chart | SVG (or D3) driven only by the snapshot prop |
| Host | Vercel static |

## Red flags — stop and fix

- `onEnter` → `chart.highlight` / `addSeries` / `setNumber`
- `onLeave` → `chart.reset()`
- IntersectionObserver as the only writer of `stepIndex`
- A `queue[]` of skipped beats that `drain()` still plays
- `{ add: 'coal' }` step payloads
- `position: sticky` inside `#lenis-content` or a GSAP camera
- `requestAnimationFrame` that sets `chart.style.top`
- Two writers of the index (React state **and** the observer)
- Resize handler that calls `onEnter(currentStep)`

**All of these mean: the camera is wrong. Re-read camera.md; do not patch around it.**
