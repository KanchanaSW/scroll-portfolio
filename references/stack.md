# Stack and scaffold

Run these in the **project** directory (the portfolio app), not inside the skill folder.

## Scaffold

```bash
npm create vite@latest . -- --template react-ts
npm install
npm install lenis gsap @gsap/react motion
npm install -D @tailwindcss/vite
npx shadcn@latest init -t vite
npx shadcn@latest add button command dialog sonner
```

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
@custom-variant dark (&:is(.dark *));

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
  background: var(--background);
  color: var(--foreground);
}
```

Load fonts in `index.html` (display + sans). Preloader waits on `document.fonts.ready`.

Theme tokens: follow shadcn's CSS variables after `init`. Persist `.dark` on `<html>` via `localStorage` key `scroll-portfolio-theme`.

## GSAP registration (once)

`src/scroll/gsap.ts`:

```ts
import gsap from 'gsap'
import { Flip } from 'gsap/Flip'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, Flip, useGSAP)

export { gsap, Flip, ScrollTrigger, useGSAP }
```

Import this module from the camera and from any Flip/scene file — never call `registerPlugin` in components.

## Deploy

Static Vite build. `vercel.json` only if you need SPA fallback (usually unnecessary for `/` only):

```json
{ "buildCommand": "npm run build", "outputDirectory": "dist" }
```
