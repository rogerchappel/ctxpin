#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
tmp_dir="$(mktemp -d)"
trap 'rm -rf "$tmp_dir"' EXIT

mkdir -p "$tmp_dir/src"
cat > "$tmp_dir/README.md" <<'EOF'
# Smoke
EOF
cat > "$tmp_dir/src/index.ts" <<'EOF'
export const smoke = true;
EOF
cat > "$tmp_dir/command-output.txt" <<'EOF'
npm test
PASS
EOF

node "$repo_root/dist/cli.js" create \
  --root "$tmp_dir" \
  --include "README.md" \
  --include "src/**/*.ts" \
  --command-output "command-output.txt" \
  --out "$tmp_dir/.ctxpin/demo"

test -s "$tmp_dir/.ctxpin/demo/ctxpin.json"
test -s "$tmp_dir/.ctxpin/demo/CTX.md"
node "$repo_root/dist/cli.js" verify "$tmp_dir/.ctxpin/demo/ctxpin.json"
node "$repo_root/dist/cli.js" summary "$tmp_dir/.ctxpin/demo/ctxpin.json" >/dev/null
