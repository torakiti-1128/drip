#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ISSUES_DIR="$ROOT_DIR/docs/11_ISSUE_MANAGEMENT/issues"

title=""
issue_type=""
priority=""
scope=""
summary=""
background=""
related_docs=""
acceptance_criteria=""
create_github="false"

usage() {
  cat <<'EOF'
Usage:
  scripts/create_issue.sh --title TITLE --type TYPE --priority PRIORITY --scope SCOPE [options]

Options:
  --title TEXT
  --type feature|bug|tech-debt|docs
  --priority critical|high|medium|low
  --scope frontend|backend|gemini|infra|docs
  --summary TEXT
  --background TEXT
  --related-docs "docs/a.md,docs/b.md"
  --ac "first acceptance criteria|second acceptance criteria"
  --github
EOF
}

slugify() {
  printf '%s' "$1" \
    | tr '[:upper:]' '[:lower:]' \
    | sed -E 's/[^a-z0-9]+/-/g; s/^-+//; s/-+$//'
}

join_related_docs() {
  local input="$1"
  if [[ -z "$input" ]]; then
    printf '  - docs/00_PROJECT_OVERVIEW/README.md\n'
    return
  fi

  local old_ifs="$IFS"
  IFS=','
  for item in $input; do
    printf '  - %s\n' "$(printf '%s' "$item" | xargs)"
  done
  IFS="$old_ifs"
}

join_acceptance_criteria() {
  local input="$1"
  if [[ -z "$input" ]]; then
    printf '%s\n' '- [ ] Acceptance Criteria を記載する'
    return
  fi

  local old_ifs="$IFS"
  IFS='|'
  for item in $input; do
    printf -- '- [ ] %s\n' "$(printf '%s' "$item" | xargs)"
  done
  IFS="$old_ifs"
}

write_issue_doc() {
  local file_path="$1"
  local issue_id="$2"
  local issue_url="$3"
  local slug="$4"
  local github_issue_value="$issue_id"
  local github_url_value="$issue_url"

  if [[ "$issue_id" == "draft" ]]; then
    github_issue_value="null"
    github_url_value="null"
  fi

  cat > "$file_path" <<EOF
---
id: ${issue_id}
title: ${title}
slug: ${slug}
github_issue: ${github_issue_value}
github_url: ${github_url_value}
status: ready
labels:
  - type: ${issue_type}
  - priority: ${priority}
  - scope: ${scope}
related_docs:
$(join_related_docs "$related_docs")
---

## 概要

${summary:-${title}}

## 背景・目的

${background:-TBD}

## Acceptance Criteria

$(join_acceptance_criteria "$acceptance_criteria")

## 実装メモ

- GitHub Issue とこのドキュメントを同時に更新する
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --title)
      title="$2"
      shift 2
      ;;
    --type)
      issue_type="$2"
      shift 2
      ;;
    --priority)
      priority="$2"
      shift 2
      ;;
    --scope)
      scope="$2"
      shift 2
      ;;
    --summary)
      summary="$2"
      shift 2
      ;;
    --background)
      background="$2"
      shift 2
      ;;
    --related-docs)
      related_docs="$2"
      shift 2
      ;;
    --ac)
      acceptance_criteria="$2"
      shift 2
      ;;
    --github)
      create_github="true"
      shift
      ;;
    --help|-h)
      usage
      exit 0
      ;;
    *)
      printf 'Unknown argument: %s\n' "$1" >&2
      usage >&2
      exit 1
      ;;
  esac
done

if [[ -z "$title" || -z "$issue_type" || -z "$priority" || -z "$scope" ]]; then
  usage >&2
  exit 1
fi

mkdir -p "$ISSUES_DIR"

slug="$(slugify "$title")"
draft_path="$ISSUES_DIR/draft-${slug}.md"

if [[ "$create_github" == "false" ]]; then
  write_issue_doc "$draft_path" "draft" "null" "$slug"
  printf '%s\n' "$draft_path"
  exit 0
fi

if ! command -v gh >/dev/null 2>&1; then
  printf 'gh CLI is required when using --github\n' >&2
  exit 1
fi

label_type="type: ${issue_type}"
label_priority="priority: ${priority}"
label_scope="scope: ${scope}"
body_file="$(mktemp)"

trap 'rm -f "$body_file"' EXIT

cat > "$body_file" <<EOF
## 概要

${summary:-${title}}

## 背景・目的

${background:-TBD}

## Acceptance Criteria

$(join_acceptance_criteria "$acceptance_criteria")

## 関連設計書

$(join_related_docs "$related_docs")
EOF

issue_url="$(
  gh issue create \
    --title "$title" \
    --label "$label_type" \
    --label "$label_priority" \
    --label "$label_scope" \
    --body-file "$body_file"
)"

issue_id="${issue_url##*/}"
issue_path="$ISSUES_DIR/${issue_id}-${slug}.md"
write_issue_doc "$issue_path" "$issue_id" "$issue_url" "$slug"

printf '%s\n' "$issue_path"
