# DRIP

DRIP（Daily Report Insights Pipeline）は、日報を AI で解析し、行動可能なインサイトと復習クイズへ変換する自己成長プラットフォームです。ゴールは「日報を書いた翌週に行動が変わっている状態」を継続的に作ることです。

## 現在の状態

- リポジトリは設計書主導の初期構築段階です
- `frontend/` と `backend/` は、設計書に合わせた基礎ディレクトリまで整備済みです
- CI/CD、インフラ雛形、Issue 運用スクリプトをこのリポジトリ内で管理します

## コアループ

1. Input: 日報を構造化して保存する
2. Analysis: Gemini 2.0 Flash で複数日分を解析する
3. Insight: SMART 原則に沿った改善アクションを生成する
4. Retention: クイズで学びを定着させる

## 技術スタック

| Layer | Technology |
| --- | --- |
| Frontend | React 19, Vite 6, TypeScript strict, Tailwind CSS, shadcn/ui |
| Backend | Ruby on Rails 8 API, Ruby 3.3+ |
| Database | PostgreSQL 16+ on Supabase |
| Auth | Supabase Auth |
| AI | Gemini 2.0 Flash |
| Hosting | Vercel (frontend), Fly.io (backend) |
| CI/CD | GitHub Actions |

## リポジトリ構成

```text
.
├── backend/                     # Rails API skeleton
├── docs/                        # 設計書
├── frontend/                    # React app skeleton
├── infrastructure/              # Fly / Vercel / Supabase / local dev templates
├── scripts/                     # 運用スクリプト
└── .github/                     # CI/CD, Issue/PR templates
```

## セットアップ

### 前提

- Node.js 22 系
- npm 10 系
- Ruby 3.3+
- Bundler
- Docker / Docker Compose
- GitHub CLI (`gh`) を使う場合は認証済みであること

### 環境変数

`.env.example` をコピーして利用してください。

```bash
cp .env.example .env
```

### ローカル依存サービス

```bash
docker compose -f infrastructure/docker-compose.yml up -d
```

## 開発コマンド

アプリ本体のコマンドは、実装が入ったあとも以下の想定を維持します。

```bash
# frontend
cd frontend
npm run dev
npm run lint
npm run type-check
npm run test:run

# backend
cd backend
bundle exec rails s
bundle exec rspec
bundle exec rubocop
```

## CI/CD

- CI: `.github/workflows/ci.yml`
- CD: `.github/workflows/deploy.yml`
- `main` 向け CI が成功したコミットのみ本番デプロイ対象です
- `develop` / `main` への変更前提で、frontend/backend が未実装でも壊れないよう条件分岐を入れています

## Issue 運用

GitHub Issues を実行系の単一管理面、`docs/11_ISSUE_MANAGEMENT/issues/` を設計・判断履歴の保管場所として使います。

```bash
# ローカルの issue ドキュメントを作成
scripts/create_issue.sh \
  --title "日報保存 API の設計着手" \
  --type feature \
  --priority high \
  --scope backend

# GitHub Issue を同時に起票する場合
scripts/create_issue.sh \
  --title "日報保存 API の設計着手" \
  --type feature \
  --priority high \
  --scope backend \
  --github
```

詳細は [docs/11_ISSUE_MANAGEMENT/README.md](/home/umeda/projects/drip/docs/11_ISSUE_MANAGEMENT/README.md) を参照してください。

## 参照すべき設計書

- [プロジェクト概要](/home/umeda/projects/drip/docs/00_PROJECT_OVERVIEW/README.md)
- [要件定義](/home/umeda/projects/drip/docs/01_REQUIREMENTS_DEFINITION/README.md)
- [DB 設計](/home/umeda/projects/drip/docs/02_DATABASE_DESIGN/README.md)
- [API 設計](/home/umeda/projects/drip/docs/03_API_DESIGN/README.md)
- [UI/UX 設計](/home/umeda/projects/drip/docs/04_UI-UX_DESIGN/README.md)
- [デプロイ / インフラ](/home/umeda/projects/drip/docs/10_DEPLOYMENT_INFRA/README.md)
- [Issue 管理](/home/umeda/projects/drip/docs/11_ISSUE_MANAGEMENT/README.md)
