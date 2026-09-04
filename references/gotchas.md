# Gotchas

Check here first when the camera feels wrong.

| Symptom | Cause | Fix |
|---|---|---|
| Jitter stacked on smooth pan | Second RAF (`lenis` autoRaf, Motion `useScroll`, manual `raf`) | One ticker: `autoRaf: false` + `gsap.ticker.add` |
| Native bar and Lenis both moving | Lenis not started, or `overflow` on a wrapper making a second scroller | Let Lenis own `window`; do not set `ScrollTrigger.defaults({ scroller })` unless you truly changed the scroller |
| Last scene cannot reach the right edge | `end: '+=' + track.scrollWidth` while x uses `scrollWidth - vw` | `end` and `x` both use `scrollWidth - innerWidth` |
| In-scene reveals fire all at once at load | Missing `containerAnimation` or `start: 'top …'` inside a horizontal track | `containerAnimation: panTween`, `start: 'left 75%'` |
| Triggers sit on the wrong scene after load | Font swap without refresh | Preloader waits on `document.fonts.ready`, then `ScrollTrigger.refresh()` |
| iOS page jumps / pin gap | `pin: true` vs dynamic `100vh` | `matchMedia` desktop only; no pin below 768 |
| Reduced-motion users still get the camera | Camera built outside matchMedia | Never construct pan/zoom unless `no-preference` |
| Flip jumps to 0,0 | State recorded after the panel mounted / missing `absolute: true` | `Flip.getState(card)` **before** opening; `Flip.from` with `absolute` |
| Double pin-spacer height | Manual spacer **and** `pin: true` | Delete the manual spacer |
| 60fps on idle, 20fps on pan | `will-change` or filters/box-shadows on every card; animating `width`/`left`/`top` | Only track + camera have `will-change`; transform/opacity only |
| Theme flash | Class applied after paint | Inline script in `index.html` reads `localStorage` before render |
| Command jump undershoots | `scrollTo` used viewport index instead of pin distance | `lenis.scrollTo(index / n * distance)` in cinematic mode |
| Keyboard fights palette | Arrows still calling `scrollToScene` | Ignore scene keys when `role=dialog` is open or focus is in an input |
| Print is a screenshot of scene 4 | No print CSS; stage still `fixed` | `@media print` unfixed linear résumé |
| Parallax feels like a second pan | Layer factors ≥ 1, or layers outside the track | Factors 0.12 / 0.28 / 0.5, inside the scene |
| `useGSAP` leaks pins on HMR | Missing revert | `useGSAP(..., { revertOnUpdate: true })`; matchMedia `mm.revert()` on cleanup |
| Motion and GSAP both tween the same node | Local whileInView on a scene heading | Remove Motion scroll props; GSAP owns it |

## Rationalizations

| Excuse | Reality |
|---|---|
| "I'll add Lenis RAF and also GSAP ticker to be safe" | Two loops. Jank. |
| "overflow-x is simpler for v1" | That is a different product. The skill is the camera. |
| "Mobile pin is fine if I use dvh" | Still broken against iOS chrome show/hide. No pin. |
| "Reduced motion still needs a little zoom" | Build no camera timeline. |
| "Copy in JSX is faster than the content file" | The next edit will drift. One file. |
