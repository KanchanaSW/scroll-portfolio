# scrollytelling-data

A [Cursor](https://cursor.com) and [Claude Code](https://claude.com/claude-code) skill that builds a **data scrollytelling article**: one sticky/pinned chart, steps that scroll past it, numbers that morph — and a chart that is a **pure function of the current step index**.

Same camera philosophy as [scroll-portfolio](https://github.com/KanchanaSW/scroll-portfolio): one scroll authority, one `requestAnimationFrame` family, visual state derived from a single number. Different product: a vertical data story, not a horizontal résumé camera.

Not enter/leave choreography. Not a transition queue. Not `position: sticky` inside a transformed Lenis/GSAP parent.

## Install

Claude Code:

```bash
git clone https://github.com/KanchanaSW/scroll-portfolio ~/.claude/skills/scroll-portfolio
ln -sfn ~/.claude/skills/scroll-portfolio/scrollytelling-data ~/.claude/skills/scrollytelling-data
```

Cursor:

```bash
git clone https://github.com/KanchanaSW/scroll-portfolio ~/.cursor/skills/scroll-portfolio
ln -sfn ~/.cursor/skills/scroll-portfolio/scrollytelling-data ~/.cursor/skills/scrollytelling-data
```

Or, from a local checkout of this repo:

```bash
chmod +x scripts/install.sh
./scripts/install.sh
```

That links both `scroll-portfolio` and `scrollytelling-data` into `~/.cursor/skills` and `~/.claude/skills`.

## What's in the box

```
SKILL.md                         laws + ordered workflow
references/camera.md             step-index owner, pin, ticker
references/content.md            story.ts — full snapshots, never diffs
references/gotchas.md            fast-scroll, resize, sticky-inside-transform
references/stack.md              Vite 7, Tailwind v4, GSAP register
references/structure.md          src/ tree
references/a11y.md               matchMedia, reduced motion, print
templates/                       copy-paste owner, chart, number morph, story
```

## The format in one paragraph

The graphic stays on screen (ScrollTrigger pin, not sticky-inside-transform). Steps scroll beside it. Lenis owns scroll; GSAP's ticker is the only RAF; on each tick the owner measures step tops against a trigger line and writes **one** `stepIndex`. The chart renders `states[index]` — a full snapshot, never `addSeries` / `reset`. Fast-scroll to the last step shows the last snapshot, not a queued film of the beats in between. Scrolling up to step N looks like scrolling down to step N.

## After install

Restart Cursor / start a new Claude Code session so the skill description is in the catalog. Ask to scaffold a data scrolly; the agent should read `SKILL.md` then `references/camera.md` before writing scroll or chart code.
