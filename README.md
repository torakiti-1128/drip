# DRIP

DRIP（Daily Report Insights Pipeline）は、日報を AI で解析し、行動可能なインサイトと復習クイズへ変換する自己成長プラットフォームです。現在は学習目的の AI 駆動開発を優先し、SvelteKit + NestJS + Prisma + GraphQL 構成へ移行中です。

## 現在の状態

- リポジトリは新スタックへの全面移行中です
- `frontend/` は SvelteKit + Apollo Client、`backend/` は NestJS + Prisma を採用しています
- チケット運用は一旦停止し、ローカルでの学習と高速な試行を優先します

## コアループ

1. Input: 日報を構造化して保存する
2. Analysis: Gemini 2.0 Flash で複数日分を解析する
3. Insight: SMART 原則に沿った改善アクションを生成する
4. Retention: クイズで学びを定着させる

## 技術スタック

| Layer | Technology |
| --- | --- |
| Frontend | SvelteKit, TypeScript strict, Tailwind CSS, Apollo Client |
| Backend | NestJS, TypeScript, Apollo GraphQL, Prisma |
| Database | PostgreSQL 16+ on Supabase |
| Auth | JWT + Passport |
| AI | Gemini 2.0 Flash |
| Hosting | Vercel (frontend), Render (backend) |
| CI/CD | GitHub Actions |

## リポジトリ構成

```text
.
├── backend/                     # NestJS GraphQL API
├── docs/                        # 設計書
├── frontend/                    # SvelteKit app
├── infrastructure/              # Render / Vercel / Supabase / local dev templates
└── .github/                     # CI/CD, Issue/PR templates
```

## セットアップ

### 前提

- Node.js 22 系
- npm 10 系
- Node.js 22 系
- npm 10 系
- Docker / Docker Compose

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

```bash
# frontend
cd frontend
npm run dev
npm run check
npm run test:run

# backend
cd backend
npm run prisma:generate
npm run start:dev
npm run test
```

## CI/CD

- CI: `.github/workflows/ci.yml`
- CD: `.github/workflows/deploy.yml`
- `main` 向け CI が成功したコミットのみ本番デプロイ対象です
- 学習優先のため、タスク管理はリポジトリ外に固定せず、その場で必要な変更を直接反映します

## 参照すべき設計書

- [プロジェクト概要](/home/umeda/projects/drip/docs/00_PROJECT_OVERVIEW/README.md)
- [要件定義](/home/umeda/projects/drip/docs/01_REQUIREMENTS_DEFINITION/README.md)
- [DB 設計](/home/umeda/projects/drip/docs/02_DATABASE_DESIGN/README.md)
- [API 設計](/home/umeda/projects/drip/docs/03_API_DESIGN/README.md)
- [UI/UX 設計](/home/umeda/projects/drip/docs/04_UI-UX_DESIGN/README.md)
- [デプロイ / インフラ](/home/umeda/projects/drip/docs/10_DEPLOYMENT_INFRA/README.md)
