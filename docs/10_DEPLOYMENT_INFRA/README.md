# 10_DEPLOYMENT_INFRA — インフラ・デプロイ・環境変数管理

> AGENTS.md §2（技術スタック）のインフラ詳細版。Render + Supabase + Vercel の構成を定義する。

---

## 1. インフラ構成図

```
[User Browser]
     │
     ├─── HTTPS ──→ [Vercel] (React 19 / Frontend)
     │                   │
     │                   │ HTTPS API呼び出し
     │                   ↓
     └─── HTTPS ──→ [Render] (Rails 8 API / Backend)
                         │
                         ├─── pgBouncer ──→ [Supabase] (PostgreSQL 16)
                         │
                         └─── HTTPS ──→ [Google AI] (Gemini 2.0 Flash)
```

### リポジトリ上の管理場所

```text
infrastructure/
├── docker-compose.yml
├── render/render.yaml
├── vercel/vercel.json
├── supabase/README.md
└── monitoring/README.md
```

---

## 2. 環境種別

| 環境 | ブランチ | 用途 |
|------|---------|------|
| `development` | ローカル / `develop` | 開発・統合確認 |
| `test` | ローカル / CI | 自動テスト |
| `production` | `main` | 本番稼働 |

- 専用の `staging` 環境は持たない。`develop` は統合ブランチとして扱い、デプロイ対象は `main` のみとする。

---

## 3. 環境変数管理

### 原則

- **`.env`ファイルはGitにコミットしない**（`.gitignore`に必ず含める）。
- `.env.example`のみをコミットし、必要な変数名とダミー値を記載する。
- `develop` / `main` に紐づく秘密情報は各プラットフォームの Secret 管理機能を使う。

### `.env.example`（プロジェクトルート）

```bash
# Backend (Rails)
DATABASE_URL=postgresql://postgres:password@localhost:5432/drip_development
RAILS_ENV=development
RAILS_MASTER_KEY=your-master-key-here
GEMINI_API_KEY=your-gemini-api-key-here
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
FRONTEND_URL=http://localhost:5173
SENTRY_DSN=

# Frontend (React / Vite)
VITE_API_BASE_URL=http://localhost:3000/api/v1
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 本番環境への設定コマンド

```bash
# Render (Rails API)
# Render Dashboard または render.yaml の envVars で設定
# 必要に応じて deploy hook を GitHub Actions から呼び出す

# Vercel (React Frontend)
# Vercel DashboardのEnvironment Variablesから設定
# または:
vercel env add VITE_API_BASE_URL production
```

---

## 4. Render（Rails API）設定

```yaml
# render.yaml
services:
  - type: web
    name: drip-api
    runtime: docker
    dockerfilePath: ./backend/Dockerfile
    plan: starter
    region: singapore
    healthCheckPath: /up
    envVars:
      - key: RAILS_ENV
        value: production
      - key: PORT
        value: 3000
```

### マイグレーションをデプロイから分離する（必須）

```bash
# ❌ 禁止: デプロイとマイグレーションを同時に行う
render deploy

# ✅ 正しい手順
# Step 1: one-off job でマイグレーション実行
# Step 2: 成功確認
# Step 3: Render の backend deploy を実行
```

---

## 5. Supabase（PostgreSQL）設定

### 接続設定

```ruby
# config/database.yml（本番）
production:
  adapter: postgresql
  url: <%= ENV['DATABASE_URL'] %>
  pool: <%= ENV.fetch("RAILS_MAX_THREADS") { 5 } %>
  # pgBouncer経由（コネクションプーリング）
  prepared_statements: false  # pgBouncer使用時は必ずfalse
  advisory_locks: false       # pgBouncer使用時は必ずfalse
```

### RLS（Row Level Security）設定必須

```sql
-- 全テーブルでRLSを有効化すること
ALTER TABLE daily_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;

-- ユーザーは自分のデータのみアクセス可
CREATE POLICY "Users can manage own reports"
  ON daily_reports
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

---

## 6. CI/CDパイプライン

```yaml
# .github/workflows/ci.yml
name: CI

jobs:
  repo-health:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: bash scripts/tests/test_create_issue.sh
      - run: docker compose -f infrastructure/docker-compose.yml config >/dev/null

  backend-ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: bundle exec rubocop
      - run: bundle exec rspec

  frontend-ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm run lint
      - run: npm run type-check
      - run: npm run test:run

# .github/workflows/deploy.yml
name: Deploy

on:
  workflow_run:
    workflows: [CI]
    branches: [main]
    types: [completed]

jobs:
  deploy-backend:
    if: github.event.workflow_run.conclusion == 'success'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Trigger Render deploy
        run: curl -fsS -X POST "$RENDER_DEPLOY_HOOK_URL"
        env:
          RENDER_DEPLOY_HOOK_URL: ${{ secrets.RENDER_DEPLOY_HOOK_URL }}

  deploy-frontend:
    if: github.event.workflow_run.conclusion == 'success'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: vercel deploy --prod --token "${{ secrets.VERCEL_TOKEN }}"
```

補足:

- CI は frontend/backend の実体がまだない段階でも壊れないよう、存在チェック付きで実装する
- CD は `main` 向け CI が成功したときのみ走らせる
- Rails のマイグレーションは deploy ステップと分離し、`fly.toml` の release command には載せない

---

## 7. ロールバック手順

### Backend（Render）

```bash
# Render Dashboard から直前のデプロイへロールバック
# DBロールバックは one-off job で実行
```

### Frontend（Vercel）

Vercel Dashboardの「Deployments」から過去のデプロイを選択して「Promote to Production」。

---

## 8. モニタリング最低要件

| 項目 | ツール | アラート条件 |
|------|--------|------------|
| エラー監視 | Sentry（BE + FE） | エラー発生時 → Slack通知 |
| APIレイテンシ | Render Metrics | p99 > 3秒 |
| DB接続数 | Supabase Dashboard | 接続数 > 80% |
| Gemini APIエラー率 | Railsログ + Sentry | 5分間で10%以上 |

```ruby
# config/initializers/sentry.rb
Sentry.init do |config|
  config.dsn = ENV['SENTRY_DSN']
  config.breadcrumbs_logger = [:active_support_logger, :http_logger]
  config.traces_sample_rate = 0.1  # 本番では10%サンプリング
  config.environment = Rails.env
end
```
