# scroll-portfolio

A [Cursor](https://cursor.com) and [Claude Code](https://claude.com/claude-code) skill that builds a **cinematic horizontal-scroll portfolio**: one résumé on a fixed-viewport stage, Lenis owning scroll, GSAP's ticker owning the only `requestAnimationFrame` loop, ScrollTrigger mapping vertical progress onto track `x` and camera `scale`.

Not a CSS `overflow-x` gallery. Not a concept explainer (that is conceptcraft).

## Install

Claude Code:

```bash
git clone https://github.com/KanchanaSW/scroll-portfolio-skill ~/.claude/skills/scroll-portfolio
```

Cursor:

```bash
git clone https://github.com/KanchanaSW/scroll-portfolio-skill ~/.cursor/skills/scroll-portfolio
```

Or, from a local checkout, symlink into both runtimes:

```bash
chmod +x scripts/install.sh
./scripts/install.sh
```

That links:

- `~/.cursor/skills/scroll-portfolio` — Cursor
- `~/.claude/skills/scroll-portfolio` — Claude Code

Both runtimes pick up `SKILL.md` on the next session. Then, in any project:

1. Add your résumé or CV to the conversation (attach the file, paste the text, or drop in a path/URL). Markdown (`.md`) is best; PDF works; Word is the least reliable.
2. Ask:

> build my cinematic scroll-portfolio from this résumé

## What's in the box

```
SKILL.md                         laws + ordered workflow
references/stack.md              Vite 7, Tailwind v4, shadcn, GSAP register
references/camera.md             Lenis ticker, pan, zoom, containerAnimation
references/content.md            portfolio.ts shape
references/scenes.md             nine scenes + Flip project zoom
references/chrome.md             palette, rail, keyboard, theme, SEO
references/a11y.md               matchMedia, reduced motion, print
references/structure.md          src/ tree
references/gotchas.md            jank / drift / double-scroll table
templates/                       copy-paste Lenis provider, camera hook, content
scripts/install.sh               dual-runtime symlink
```

## The format in one paragraph

The page is a pinned stage. A horizontal track holds nine scenes. Wheel, trackpad, and touch go through Lenis; GSAP's ticker calls `lenis.raf`; ScrollTrigger scrubs the track sideways and dips the camera scale to ~0.82 at scene seams (pull back to see the map, push in to read). In-scene reveals use `containerAnimation` on the pan tween. Below 768px and for `prefers-reduced-motion`, the camera is never built — it is a normal vertical document. Content is typed data in one file; scenes are presentation only.

## After install

Restart Cursor / start a new Claude Code session so the skill description is in the catalog. Attach a résumé or CV and ask to scaffold or extend a scroll-portfolio; the agent should read `SKILL.md` then `references/camera.md` before writing animation.

## Credits

- Format and skill by [Kanchana Walagambahu](https://github.com/KanchanaSW).
- Skill packaging follows [conceptcraft](https://github.com/maraja/conceptcraft) by [Amit Maraj](https://github.com/maraja).

## License

MIT — see [LICENSE](LICENSE).
