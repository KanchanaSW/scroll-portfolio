#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"

if [[ ! -f "$ROOT/SKILL.md" ]]; then
  echo "SKILL.md not found at $ROOT" >&2
  exit 1
fi

if [[ ! -f "$ROOT/scrollytelling-data/SKILL.md" ]]; then
  echo "scrollytelling-data/SKILL.md not found at $ROOT" >&2
  exit 1
fi

install_link() {
  local dest_dir="$1"
  local name="$2"
  local target="$3"
  mkdir -p "$dest_dir"
  ln -sfn "$target" "$dest_dir/$name"
  echo "linked $dest_dir/$name -> $target"
}

for dest in "$HOME/.cursor/skills" "$HOME/.claude/skills"; do
  install_link "$dest" "scroll-portfolio" "$ROOT"
  install_link "$dest" "scrollytelling-data" "$ROOT/scrollytelling-data"
done

echo "Restart Cursor and start a new Claude Code session so the skills are discovered."
