# File tree

```
src/
  content/
    story.ts
    types.ts
  scroll/
    gsap.ts
    SmoothScrollProvider.tsx
    useStepIndex.ts
    measureActiveStep.ts
  components/
    Scrolly.tsx
    Graphic.tsx
    Chart.tsx
    NumberMorph.tsx
    Step.tsx
    SkipLink.tsx
    Preloader.tsx
  App.tsx
  main.tsx
  index.css
index.html
```

`useStepIndex.ts` is the only writer of the index. `Chart.tsx` takes a `view` prop and does not export `highlight` / `reset` / `addSeries`.

Templates to copy at step 3:

- [templates/SmoothScrollProvider.tsx](../templates/SmoothScrollProvider.tsx)
- [templates/useStepIndex.ts](../templates/useStepIndex.ts)
- [templates/measureActiveStep.ts](../templates/measureActiveStep.ts)
- [templates/Scrolly.tsx](../templates/Scrolly.tsx)
- [templates/Chart.tsx](../templates/Chart.tsx)
- [templates/NumberMorph.tsx](../templates/NumberMorph.tsx)
- [templates/story.ts](../templates/story.ts)
- [templates/types.ts](../templates/types.ts)
