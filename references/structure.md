# File tree

```
src/
  content/
    portfolio.ts
    types.ts
    scenes.ts
  scroll/
    gsap.ts
    SmoothScrollProvider.tsx
    useCamera.ts
    useSceneReveal.ts
    easings.ts
    scrollToScene.ts
  components/
    stage/
      Stage.tsx
      Track.tsx
      Scene.tsx
      ParallaxLayer.tsx
    scenes/
      Hero.tsx
      Summary.tsx
      Impact.tsx
      Skills.tsx
      Experience.tsx
      Projects.tsx
      Speaking.tsx
      Education.tsx
      Contact.tsx
    chrome/
      ProgressRail.tsx
      CommandPalette.tsx
      ThemeToggle.tsx
      Cursor.tsx
      Preloader.tsx
      SkipLink.tsx
    ui/                  # shadcn
  hooks/
    useMediaQuery.ts
    useReducedMotion.ts
    useTheme.ts
  lib/
    utils.ts             # cn()
  App.tsx
  main.tsx
  index.css
index.html
public/
  og.png
  kanchana-walagambahu.pdf
```

`useSceneReveal.ts` wraps `containerAnimation` + left/right starts so scenes do not re-specify the pan tween API. `scrollToScene.ts` is the single jump helper used by the rail, palette, and keyboard.

Templates to copy at step 3:

- [templates/SmoothScrollProvider.tsx](../templates/SmoothScrollProvider.tsx)
- [templates/useCamera.ts](../templates/useCamera.ts)
- [templates/portfolio.ts](../templates/portfolio.ts)
- [templates/types.ts](../templates/types.ts)
- [templates/scenes.ts](../templates/scenes.ts)
