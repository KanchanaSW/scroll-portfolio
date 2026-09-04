# Stack and scaffold

Run these in the **project** directory (the article app), not inside the skill folder.

## Scaffold

```bash
npm create vite@latest . -- --template react-ts
npm install
npm install lenis gsap @gsap/react
npm install -D @tailwindcss/vite
```

D3 is optional. The law is the snapshot prop, not the drawing library. Start with the SVG template. Add `d3` only if the marks need it.

If the directory is not empty, create in a temp folder and move `src/`, `index.html`, `vite.config.ts`, `package.json`, `tsconfig*.json`.

## Vite

`vite.config.ts` must include the Tailwind plugin. No `tailwind.config.js`.

```ts
import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
})
```

## CSS-first Tailwind v4

`src/index.css`:

```css
@import 'tailwindcss';

@theme {
  --font-sans: 'Inter', ui-sans-serif, system-ui, sans-serif;
  --font-display: 'Syne', ui-sans-serif, system-ui, sans-serif;
}

html,
body,
#root {
  min-height: 100%;
}

body {
  margin: 0;
  overflow-x: hidden;
}
```

Load fonts in `index.html`. Preloader waits on `document.fonts.ready`.

## GSAP registration (once)

`src/scroll/gsap.ts`:

```ts
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export { gsap, ScrollTrigger, useGSAP }
```

Import this module from the camera — never call `registerPlugin` in components.

## Deploy

Static Vite build.

```json
{ "buildCommand": "npm run build", "outputDirectory": "dist" }
```
