#!/usr/bin/env bash
# PostToolUse hook: run ESLint on the file that was just edited.
# Informational only — always exits 0 so it never blocks Claude.

INPUT=$(cat)

FILE_PATH=$(python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    print(data.get('tool_input', {}).get('file_path', ''), end='')
except Exception:
    pass
" <<< "$INPUT" 2>/dev/null)

# Only run on TypeScript/TSX files
[[ "$FILE_PATH" =~ \.(ts|tsx)$ ]] || exit 0

# Navigate to project root (.claude/hooks/ is two levels below root)
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$PROJECT_ROOT" || exit 0

echo "--- [lint] $(basename "$FILE_PATH") ---"
pnpm exec eslint "$FILE_PATH" 2>&1 | head -40 || true

exit 0
