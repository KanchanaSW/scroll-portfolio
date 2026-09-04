# Gotchas

Check here first when up≠down, the graphic detaches, or sticky does nothing.

## Fast-scroll step skipping

| Symptom | Cause | Fix |
|---|---|---|
| Flick 1→6 leaves the chart on step 2 or 3 | IntersectionObserver omitted intermediate entries; `onEnter` never ran | Do not use IO as the owner. Measure all step tops on the ticker |
| Flick 1→6 then the chart "catches up" through 2,3,4,5 | A `queue[]` of skipped beats is `drain()`ing | Jump to `states[landed]`. Delete the queue |
| Scroll up 6→2 plays a reverse film | `onLeave` / reverse `drain()` is a second timeline | Same jump as down: `states[2]`. Not a movie |
| Chart at "step 3" differs down vs up | `addSeries` accumulated; `reset` raced `highlight`; leftover marks | Full snapshot per step. `Chart` is `f(index)` |
| Headline counts 12→61 through every beat on a flick | Number tween chained per skipped enter | `NumberMorph` targets `states[index].headline` only |
| Two steps highlighted at once | IO `isIntersecting` true for two entries; both called `highlight` | One index. One snapshot. Emphasis is a field on that snapshot |

**Law:** landing on an index means the graphic **is** that snapshot, even if steps were skipped. Adjacent-only morphs (`n → n+1`) are allowed. Catch-up queues are not.

## Resize recomputation

| Symptom | Cause | Fix |
|---|---|---|
| Axes clipped or empty after resize | Scales captured once at mount | `ResizeObserver` on the graphic; rebuild scales from current view + box |
| Pin ends too early/late after resize | `end` was a number, not a function | `end: () => '+=' + (steps.scrollHeight - innerHeight)`, `invalidateOnRefresh: true` |
| Pin spacer explodes / extra blank scroll | `pinSpacing: true` on a two-column row | `pinSpacing: false`; the steps column is the distance |
| Headline replays from 0 on resize | Resize called `onEnter` / `setNumber(0)` | Re-render `states[index]`. Do not replay enters |
| Index changes on resize with no scroll | Trigger line used stale rects | After `ScrollTrigger.refresh()`, measure again |
| Font swap shifts the pin | Refresh before `document.fonts.ready` | Preloader waits on fonts, then `refresh()` |

Resize is a new box, not a new journey. The index does not move unless geometry says it did.

## Sticky-element-inside-transformed-parent

`position: sticky` is relative to the nearest ancestor with a scroll or a **containing block**. Any ancestor `transform`, `filter`, `perspective`, or `will-change: transform` creates that containing block. The sticky element then sticks inside the moving wrapper — which is to say, it does not stick in the viewport.

Lenis often transforms its content node. GSAP camera wrappers set `will-change: transform` and `scale`. Both kill sticky.

| Symptom | Cause | Fix |
|---|---|---|
| `position: sticky; top: 0` scrolls away | Ancestor transform / will-change: transform | Pin with ScrollTrigger, **or** move the scrolly outside the transformed wrapper |
| Sticky works in DevTools until Lenis starts | Lenis applied transform after paint | Do not sticky inside Lenis content; pin |
| `top: 0 !important` / `z-index: 9999` / `contain: none` do nothing | Containing block is not a stacking-context problem | Child cannot opt out. Fix the ancestor |
| `transform: none` on the chart | Does not remove the ancestor's containing block | Same |
| Chart jitters, `top` updates every frame | Second RAF writing `chart.style.top` to fake sticky | Delete it. Pin. One ticker |
| Nested `overflow: auto` + second Lenis on steps | New scroller, new bugs, sticky still broken in the camera | One Lenis. One document scroll |
| Sticky OK on mobile, broken in cinematic mode | Camera wrapper only exists on desktop | Never mount `#scrolly` under `.camera` |

**Test:** in DevTools, walk from the graphic to `html`. If any computed `transform` is not `none`, or `will-change` includes `transform`, sticky is illegal there.

## Other

| Symptom | Cause | Fix |
|---|---|---|
| Jitter stacked on smooth scroll | Second RAF (Lenis autoRaf, manual `raf`, `top` writer) | One ticker: `autoRaf: false` + `gsap.ticker.add` |
| Last step never holds the graphic | `end` uses full `scrollHeight` | `scrollHeight - innerHeight` |
| Reduced-motion users still get count-ups | NumberMorph built outside matchMedia | Snap the text; no tween |
| Copy in JSX drifts from the chart | Snapshot not in `story.ts` | One file owns numbers and marks |

## Rationalizations

| Excuse | Reality |
|--------|---------|
| "Senior already wrote onEnter/onLeave" | Path-dependent charts are the bug. Delete the pokes. |
| "OK if they don't fast-scroll" | They will. Measure all steps; don't hope IO fires. |
| "leave() before enter() in the same frame" | Still skips. Still accumulates series. |
| "Queue skipped beats so the story plays" | A movie of steps they did not stop on. The graphic lags the scroll. |
| "PM said every beat must play" | Beats play when the reader stops on them. The chart at index N is always `states[N]`. |
| "Index plus onEnter is belt and suspenders" | Two writers. They will disagree. |
| "addSeries is easier than full snapshots" | Diffs are the up≠down bug. |
| "Just bump z-index / transform:none on sticky" | The ancestor is the containing block. The child cannot opt out. |
| "Fake sticky with RAF writing top" | Second animation source. Pin instead. |
| "Don't rip out the camera wrapper" | This format is not that camera. Sibling of `#stage`, not a descendant. |
| "Resize should replay the enter so the chart rebuilds" | Rebuild from `states[index]`. Replay is a side effect. |
