#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

mkdir -p \
  "$ROOT_DIR/frontend/src/components" \
  "$ROOT_DIR/frontend/src/hooks" \
  "$ROOT_DIR/frontend/src/pages" \
  "$ROOT_DIR/frontend/src/services" \
  "$ROOT_DIR/frontend/src/schemas" \
  "$ROOT_DIR/frontend/src/types" \
  "$ROOT_DIR/frontend/src/utils" \
  "$ROOT_DIR/frontend/src/__tests__" \
  "$ROOT_DIR/backend/app/controllers/api/v1" \
  "$ROOT_DIR/backend/app/models" \
  "$ROOT_DIR/backend/app/services/gemini" \
  "$ROOT_DIR/backend/app/services/reports" \
  "$ROOT_DIR/backend/app/serializers" \
  "$ROOT_DIR/backend/spec/services/gemini" \
  "$ROOT_DIR/backend/spec/services/reports" \
  "$ROOT_DIR/backend/spec/requests/api/v1" \
  "$ROOT_DIR/backend/spec/models" \
  "$ROOT_DIR/backend/spec/schemas" \
  "$ROOT_DIR/backend/spec/factories" \
  "$ROOT_DIR/backend/spec/support/shared_contexts" \
  "$ROOT_DIR/backend/spec/support/helpers" \
  "$ROOT_DIR/docs/11_ISSUE_MANAGEMENT/issues" \
  "$ROOT_DIR/docs/11_ISSUE_MANAGEMENT/archive" \
  "$ROOT_DIR/infrastructure/fly" \
  "$ROOT_DIR/infrastructure/vercel" \
  "$ROOT_DIR/infrastructure/supabase" \
  "$ROOT_DIR/infrastructure/monitoring"

printf 'directory bootstrap complete\n'
