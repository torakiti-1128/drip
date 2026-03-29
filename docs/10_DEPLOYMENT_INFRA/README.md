# 10_DEPLOYMENT_INFRA — インフラ・デプロイ・環境変数管理

## 1. インフラ構成

```text
[Browser]
   ├── HTTPS → [Vercel / SvelteKit]
   └── HTTPS → [Render / NestJS GraphQL]
                    ├── PostgreSQL → [Supabase]
                    └── HTTPS → [Gemini API]
```

## 2. 環境変数

```bash
DATABASE_URL=postgresql://postgres:password@localhost:5432/drip_development
JWT_SECRET=replace-with-a-long-random-secret
GEMINI_API_KEY=replace-with-gemini-api-key
FRONTEND_URL=http://localhost:5173
GRAPHQL_PLAYGROUND=true

PUBLIC_GRAPHQL_ENDPOINT=http://localhost:3000/graphql
```

## 3. Render

- Backend は `backend/Dockerfile` を使ってデプロイする
- 起動コマンドは `node dist/main.js`
- `DATABASE_URL` と `JWT_SECRET` は Render Secret で管理する

## 4. Vercel

- Frontend は `frontend/` をルートにしてビルドする
- `PUBLIC_GRAPHQL_ENDPOINT` を本番 Backend URL に向ける

## 5. GitHub Actions

### CI
- backend: `npm install`, `npm run prisma:generate`, `npm run test`
- frontend: `npm install`, `npm run type-check`, `npm run test:run`

### CD
- Render は deploy hook で起動する
- Vercel は CLI で production deploy する

## 6. ローカル開発

```bash
docker compose -f infrastructure/docker-compose.yml up -d

cd backend
npm install
npm run prisma:generate
npm run start:dev

cd frontend
npm install
npm run dev
```
