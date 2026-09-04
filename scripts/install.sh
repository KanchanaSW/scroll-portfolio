#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
NAME="scroll-portfolio"

if [[ ! -f "$ROOT/SKILL.md" ]]; then
  echo "SKILL.md not found at $ROOT" >&2
  exit 1
fi

install_link() {
  local dest_dir="$1"
  mkdir -p "$dest_dir"
  ln -sfn "$ROOT" "$dest_dir/$NAME"
  echo "linked $dest_dir/$NAME -> $ROOT"
}

install_link "$HOME/.cursor/skills"
install_link "$HOME/.claude/skills"

echo "Restart Cursor and start a new Claude Code session so the skill is discovered."
