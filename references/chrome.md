# Chrome

Keep chrome `position: fixed` and `pointer-events` only on controls. Do not put chrome inside the pinned track.

## Command palette

shadcn `Command` + `Dialog`. Open on `Cmd/Ctrl+K`. Groups:

- Jump to scene (uses `SCENES` + `lenis.scrollTo`)
- Copy email
- Open GitHub / LinkedIn
- Download résumé
- Toggle theme

`lenis.scrollTo` the pin-spacer offset for that scene: `sceneIndex / sceneCount * distance` (desktop) or the scene element's `offsetTop` (vertical mode). After jump, `ScrollTrigger.update()`.

## Progress rail

Bottom minimap of the 9 scenes. A playhead reads `ScrollTrigger.progress` from the pan tween (or `scrollY / max` when vertical). Clicking a tick calls the same `scrollTo` helper as the palette. `aria-current` on the active scene. Hide on print.

## Keyboard

| Key | Action |
|---|---|
| ArrowRight / PageDown | next scene |
| ArrowLeft / PageUp | previous scene |
| Home / End | first / last |
| Digit 1–9 | that scene |
| Esc | close Flip panel or palette |

Ignore these when an input/textarea is focused or the palette is open (except Esc). `preventDefault` on arrows only in cinematic mode so the page does not also native-scroll.

## Theme

Class strategy: `document.documentElement.classList.toggle('dark')`. Tailwind v4 `@custom-variant dark (&:is(.dark *));`. Persist `localStorage['scroll-portfolio-theme']`. Default: follow `prefers-color-scheme` on first visit. Toggle lives in the palette and a small control in the corner.

## Preloader

Visible until `await document.fonts.ready` (and window `load` if there is an OG-critical image). Then `ScrollTrigger.refresh()`, fade the loader (opacity only), `lenis.start()` if you had paused it. Without this, display font swap shifts every trigger.

## Custom cursor

Hidden native cursor on desktop cinematic only (`pointer` fine on mobile and reduced-motion). A `transform: translate3d` follower (ticker or GSAP `quickTo`, **not** a new RAF). Over `[data-zoomable]` project cards, scale up and change label to "View". Disable when `matchMedia('(pointer: fine)')` is false.

## SEO (SPA — do it deliberately)

`index.html`:

- `<title>`, description, canonical
- Open Graph + Twitter tags
- Generated OG image at `public/og.png` (1200×630), referenced absolutely once the domain is known
- JSON-LD `Person`:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Kanchana Walagambahu",
  "jobTitle": "Senior Software Engineer — Frontend",
  "address": { "@type": "PostalAddress", "addressLocality": "Colombo", "addressCountry": "LK" },
  "url": "https://example.com",
  "sameAs": ["https://github.com/…", "https://linkedin.com/in/…"]
}
</script>
```

No SSR. If the public URL is unknown at build time, keep relative OG image and fill absolute URLs when deploying.
