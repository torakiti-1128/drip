#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ARCHIVE_DIR="$ROOT_DIR/docs/11_ISSUE_MANAGEMENT/archive"

if [[ $# -ne 1 ]]; then
  printf 'Usage: scripts/archive_issue.sh <issue-doc-path>\n' >&2
  exit 1
fi

source_path="$1"

if [[ ! -f "$source_path" ]]; then
  printf 'Issue document not found: %s\n' "$source_path" >&2
  exit 1
fi

mkdir -p "$ARCHIVE_DIR"
target_path="$ARCHIVE_DIR/$(basename "$source_path")"
mv "$source_path" "$target_path"

printf '%s\n' "$target_path"
