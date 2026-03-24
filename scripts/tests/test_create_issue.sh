#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
TMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TMP_DIR"' EXIT

cp -R "$ROOT_DIR/scripts" "$TMP_DIR/"
cp -R "$ROOT_DIR/docs" "$TMP_DIR/"

mkdir -p "$TMP_DIR/docs/11_ISSUE_MANAGEMENT/issues"

pushd "$TMP_DIR" >/dev/null

output="$(
  bash scripts/create_issue.sh \
    --title "Daily Report Save API" \
    --type feature \
    --priority high \
    --scope backend \
    --summary "日報保存 API の新設" \
    --background "API 設計との整合が必要" \
    --related-docs "docs/03_API_DESIGN/README.md,docs/09_TESTING_STRATEGY/README.md" \
    --ac "POST /daily_reports が追加される|request spec が追加される"
)"

test -f "$output"
grep -q '^id: draft$' "$output"
grep -q '^title: Daily Report Save API$' "$output"
grep -q 'type: feature' "$output"
grep -q 'priority: high' "$output"
grep -q 'scope: backend' "$output"
grep -q 'docs/03_API_DESIGN/README.md' "$output"
grep -q 'POST /daily_reports が追加される' "$output"

archived_path="$(bash scripts/archive_issue.sh "$output")"
test -f "$archived_path"
test ! -f "$output"

popd >/dev/null

printf 'issue scripts test passed\n'
