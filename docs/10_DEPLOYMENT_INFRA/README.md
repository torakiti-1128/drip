# 10_DEPLOYMENT_INFRA — インフラ・デプロイ・環境変数管理

> AGENTS.md §2（技術スタック）のインフラ詳細版。Fly.io + Supabase + Vercel の構成を定義する。

---

## 1. インフラ構成図

```
[User Browser]
     │
     ├─── HTTPS ──→ [Vercel] (React 19 / Frontend)
     │                   │
     │                   │ HTTPS API呼び出し
     │                   ↓
     └─── HTTPS ──→ [Fly.io] (Rails 8 API / Backend)
                         │
                         ├─── pgBouncer ──→ [Supabase] (PostgreSQL 16)
                         │
                         └─── HTTPS ──→ [Google AI] (Gemini 2.0 Flash)
```

---

## 2. 環境種別

| 環境 | ブランチ | 用途 |
|------|---------|------|
| `development` | ローカル | 開発・デバッグ |
| `test` | ローカル / CI | 自動テスト |
| `staging` | `develop` | QA・動作確認 |
| `production` | `main` | 本番稼働 |

---

## 3. 環境変数管理

### 原則

- **`.env`ファイルはGitにコミットしない**（`.gitignore`に必ず含める）。
- `.env.example`のみをコミットし、必要な変数名とダミー値を記載する。
- 本番・ステージング環境の秘密情報は各プラットフォームのSecret管理機能を使う。

### `.env.example`（プロジェクトルート）

```bash
# Backend (Rails)
DATABASE_URL=postgresql://postgres:password@localhost:5432/drip_development
RAILS_MASTER_KEY=your-master-key-here
GEMINI_API_KEY=your-gemini-api-key-here
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
FRONTEND_URL=http://localhost:5173

# Frontend (React / Vite)
VITE_API_BASE_URL=http://localhost:3000
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 本番環境への設定コマンド

```bash
# Fly.io (Rails API)
fly secrets set \
  GEMINI_API_KEY=xxx \
  RAILS_MASTER_KEY=xxx \
  SUPABASE_SERVICE_ROLE_KEY=xxx \
  FRONTEND_URL=https://drip.vercel.app \
  --app drip-api

# Vercel (React Frontend)
# Vercel DashboardのEnvironment Variablesから設定
# または:
vercel env add VITE_API_BASE_URL production
```

---

## 4. Fly.io（Rails API）設定

```toml
# fly.toml
app = "drip-api"
primary_region = "nrt"  # 東京リージョン

[build]
  dockerfile = "backend/Dockerfile"

[env]
  RAILS_ENV = "production"
  PORT = "3000"

[http_service]
  internal_port = 3000
  force_https = true
  auto_stop_machines = true
  auto_start_machines = true
  min_machines_running = 1

[[vm]]
  memory = "512mb"
  cpu_kind = "shared"
  cpus = 1

[[statics]]
  guest_path = "/app/public"
  url_prefix = "/"
```

### マイグレーションをデプロイから分離する（必須）

```bash
# ❌ 禁止: デプロイとマイグレーションを同時に行う
fly deploy

# ✅ 正しい手順
# Step 1: マイグレーション実行
fly ssh console -C "bin/rails db:migrate" --app drip-api
# Step 2: マイグレーションが成功したことを確認
fly ssh console -C "bin/rails db:migrate:status" --app drip-api
# Step 3: デプロイ
fly deploy --remote-only --app drip-api
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
ALTER TABLE insights ENABLE ROW LEVEL SECURITY;
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
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    name: Deploy to Production
    runs-on: ubuntu-latest
    needs: [backend-ci, frontend-ci]  # CIが先にグリーンであること

    steps:
      - uses: actions/checkout@v4

      # Backend: Migrate → Deploy
      - uses: superfly/flyctl-actions/setup-flyctl@master
      - name: Run DB migrations
        run: flyctl ssh console -C "bin/rails db:migrate" --app drip-api
        env:
          FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}
      - name: Deploy Rails API
        run: flyctl deploy --remote-only --app drip-api
        env:
          FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}

      # Frontend: Vercel（mainブランチへのpushで自動デプロイ）
      # Vercel GitHub Integrationで設定済みのため、明示的なステップ不要
```

---

## 7. ロールバック手順

### Backend（Fly.io）

```bash
# 直前バージョンに戻す
fly releases list --app drip-api          # リリース一覧確認
fly deploy --image <IMAGE_ID> --app drip-api  # 特定バージョンに戻す

# DBマイグレーションのロールバック（前のバージョンのコードで実行）
fly ssh console -C "bin/rails db:rollback STEP=1" --app drip-api
```

### Frontend（Vercel）

Vercel Dashboardの「Deployments」から過去のデプロイを選択して「Promote to Production」。

---

## 8. モニタリング最低要件

| 項目 | ツール | アラート条件 |
|------|--------|------------|
| エラー監視 | Sentry（BE + FE） | エラー発生時 → Slack通知 |
| APIレイテンシ | Fly.io Metrics | p99 > 3秒 |
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