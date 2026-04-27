#!/usr/bin/env bash
# PreToolUse hook: block any terminal command that would stage or commit
# files under .tmp/ (e.g. .tmp/e2e-coverage/, .tmp/coverage/).
#
# Reads JSON on stdin from VS Code agent. If the tool is a terminal command
# matching `git add`/`git commit`/`git stash` and the command line references
# `.tmp/`, emit a deny decision and exit 0 (the JSON carries the block).
# Otherwise exit 0 silently to allow the tool to run.

set -euo pipefail

input="$(cat)"

# Extract the terminal command if present (best-effort, no jq dependency).
cmd="$(printf '%s' "$input" | grep -oE '"command"[[:space:]]*:[[:space:]]*"[^"]*"' | head -n1 | sed -E 's/.*"command"[[:space:]]*:[[:space:]]*"([^"]*)".*/\1/')"

if [[ -z "${cmd:-}" ]]; then
  exit 0
fi

# Only inspect git-staging commands.
if ! printf '%s' "$cmd" | grep -qE '\bgit[[:space:]]+(add|commit|stash)\b'; then
  exit 0
fi

# Allow if .tmp/ is not referenced.
if ! printf '%s' "$cmd" | grep -qE '(^|[[:space:]/"'\''])\.tmp/'; then
  exit 0
fi

cat <<'JSON'
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "deny",
    "permissionDecisionReason": "Blocked: .tmp/ artifacts (coverage, e2e reports, plans) must never be committed. Add to .gitignore instead."
  }
}
JSON
