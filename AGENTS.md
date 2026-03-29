# AGENTS.md — DRIP Project Intelligence

> **このファイルはAIエージェント（Codex / Claude Code）が最初に読む唯一の真実（Single Source of Truth）である。**
> コードを1行書く前に、このファイルを全文読み、内容を遵守すること。

---

## 0. エージェント行動原則

1. **まず仕様を読め。** 実装前に必ず関連する `docs/` の設計書を参照せよ。推測で実装するな。
2. **スコープを守れ。** 指示されていない変更を勝手に加えるな。変更が波及する場合は先に宣言せよ。
3. **テストを書け。** 実装コードより先にテストを書く（TDD）。テストのないコードのPRは却下される。
4. **型を守れ。** TypeScriptの`any`、Rubyの`Hash`直渡しを禁止する。
5. **コミットの前にセルフレビューを行え。** 差分を見直し、デバッグコード・TODOの放置・環境変数のハードコードがないか確認せよ。

---

## 1. プロジェクト概要

**DRIP (Daily Report Insights Pipeline)** は、日報をAI解析し、改善アクションと復習クイズを自動生成する自己成長プラットフォームである。

### コアループ
```
日報入力 (Input)
  → Gemini 2.0 Flash による構造化解析 (Analysis)
  → SMART原則に基づく改善アクション生成 (Action)
  → 定着クイズによる振り返り (Retention)
```

### 設計思想（変えてはならない）
- 「日報を書く人が、翌週に明確に行動を変えている状態」がゴール。
- UIの複雑さよりも「改善アクションとクイズの実効性」を最優先する。
- Gemini依存を局所化し、AIプロバイダー交換コストを最小にする。

詳細: [`docs/00_PROJECT_OVERVIEW/README.md`](docs/00_PROJECT_OVERVIEW/README.md)

---

## 2. 技術スタック

| レイヤー | 技術 | バージョン |
|---------|------|-----------|
| Frontend | SvelteKit | 2.x |
| Styling | Tailwind CSS | latest |
| API Client | Apollo Client (GraphQL) | latest |
| Language (FE) | TypeScript | 5.x strict |
| Backend | NestJS | 11.x |
| Language (BE) | TypeScript | 5.x strict |
| ORM | Prisma | 6.x |
| Auth | JWT + Passport | latest |
| Database | PostgreSQL (Supabase) | 16+ |
| AI Provider | Gemini 2.0 Flash | — |
| Hosting (FE) | Vercel | — |
| Hosting (BE) | Render | — |

---

## 3. ディレクトリ構造

```
drip/
├── AGENTS.md                  # ← 今読んでいるファイル
├── .codex/
│   ├── skills/<skill-name>/
│   │   ├── SKILL.md           #各ペルソナのスキル
├── .github/
│   ├── workflows/
│   │   ├── ci.yml             # CI: lint + test（push/PRで自動実行）
│   │   └── deploy.yml         # CD: mainマージ後に自動デプロイ
├── docs/                      # 設計ドキュメント（詳細は後述）
├── frontend/                  # SvelteKit アプリケーション
│   ├── src/
│   │   ├── lib/               # Apollo client / schema / util
│   │   ├── routes/            # SvelteKit routes
│   │   └── app.css            # Tailwind entry
│   └── src/**/*.test.ts       # Vitestテスト
└── backend/                   # NestJS GraphQL API
    ├── src/
    │   ├── auth/              # JWT + Passport + GraphQL Guard
    │   ├── prisma/            # Prisma service
    │   ├── daily-reports/
    │   ├── batch-analyses/
    │   ├── quizzes/
    │   ├── action-plans/
    │   ├── settings/
    │   ├── tags/
    │   └── dashboard/
    ├── prisma/
    │   └── schema.prisma
    └── src/**/*.spec.ts       # Jestテスト
```

---

## 4. Git 運用ルール

> 詳細: [`docs/08_DEVELOPMENT_RULES/README.md`](docs/08_DEVELOPMENT_RULES/README.md)

### ブランチ戦略

```
main          → 本番稼働可能な安定版。直接pushは禁止。PRのみ。
develop       → 統合ブランチ。feature/* はここへマージ。
feature/*     → 新機能・改善。例: feature/quiz-retry-logic
fix/*         → バグ修正。例: fix/gemini-timeout-handling
chore/*       → 設定・依存関係更新。例: chore/update-tanstack-query
docs/*        → ドキュメント更新のみ。
```

### コミットメッセージ（Conventional Commits 厳守）

```
<type>(<scope>): <subject>

type  : feat / fix / docs / refactor / test / chore / perf / ci
scope : frontend / backend / db / gemini / deploy / docs（任意）
subject: 日本語、命令形、50文字以内

例:
  feat(backend): NestJS GraphQL認証を追加
  fix(frontend): SvelteKitの保存導線を修正
  test(backend): 日報保存サービスの計算ロジックを追加
  docs: API設計をGraphQL前提へ更新
```

**禁止例:**
```
# NG: 何をしたか不明
git commit -m "fix"
git commit -m "update"
git commit -m "WIP"
```

### プルリクエスト（PR）ルール

- マージ前チェックリスト:
  - [ ] CIがグリーン（jest + vitest + type-check）
  - [ ] AIセルフレビュー実施済み
  - [ ] 関連する設計書（docs/）が更新されているか確認
  - [ ] `any`型・ハードコードされた秘密情報がないか確認
- マージ戦略: `Squash and merge`（featureブランチのコミット履歴を1つに圧縮）

---

## 5. コーディング規約

### 5-1. 共通ルール

- **秘密情報のハードコード禁止。** APIキー・DBパスワードは環境変数のみ。
- **TODO/FIXMEコメントには必ず担当者名と理由を添える。** `// TODO(torakiti-1128): GraphQL subscription導線を追加`
- **マジックナンバー禁止。** 定数（`QUIZ_MAX_RETRIES = 3`等）として定義する。

### 5-2. フロントエンド（TypeScript / SvelteKit）

```typescript
// 正しい型定義
import { z } from 'zod';

export const InsightSchema = z.object({
  id: z.string().uuid(),
  category: z.enum(['achievement', 'challenge', 'learning', 'action']),
  score: z.number().int().min(0).max(100),
  summary: z.string().min(1).max(500),
});

export type Insight = z.infer<typeof InsightSchema>;

// 禁止
const data: any = await fetchInsight();
```

| 項目 | 規則 |
|------|------|
| コンポーネント名 | PascalCase（`AppShell.svelte`） |
| ルート | `src/routes/**/+page.svelte` |
| ユーティリティ・ファイル | kebab-case（`api-client.ts`） |
| GraphQL定義 | `src/lib/graphql/` に集約 |
| `any`使用 | **禁止**。`unknown` + 型ガードで代替 |
| デフォルトexport | 原則禁止 |

**ページ3ステート必須:** `loading` / `error` / `empty`

### 5-3. バックエンド（TypeScript / NestJS）

```
Resolver    → 薄く保つ。認証・引数・Service呼び出しのみ。
Service     → ビジネスロジックの唯一の置き場。
Prisma      → 永続化とリレーション定義のみ。
DTO / Type  → GraphQL Input / ObjectType を明示する。
```

```ruby
@Resolver(() => DailyReportSummary)
export class DailyReportsResolver {
  constructor(private readonly service: DailyReportsService) {}

  @Mutation(() => DailyReportSummary)
  saveDailyReport(@CurrentUser() user: JwtUser, @Args('input') input: SaveDailyReportInput) {
    return this.service.save(user.sub, input);
  }
}
```

- GraphQL の外部公開名は **camelCase** に統一する。
- 認証は `GqlAuthGuard` を通す。

---

## 6. データベース制約

> 詳細: [`docs/02_DATABASE_DESIGN/README.md`](docs/02_DATABASE_DESIGN/README.md)

AIは `docs/02_DATABASE_DESIGN/README.md` のテーブル定義を**無条件に正とする**こと。本文への制約再掲は参考情報に留め、設計・実装判断は常に設計書へ揃えること。

- 解析・定着系の保存対象は `batch_analyses` / `action_plans` / `quizzes` を基準とし、存在しない `insights` テーブルを前提に設計しない。
- `daily_reports` / `batch_analyses` / `quizzes` の詳細な NULL 制約、default、列挙値は `docs/02_DATABASE_DESIGN/README.md` の最新定義を参照する。

- 外部キー制約を省略するマイグレーションは **却下**。
- `NULL` 許容カラムを追加する場合は、**設計書への記載と理由のコメント**が必須。
- 本番への直接接続禁止。すべての変更はマイグレーションファイル経由。

---

## 7. テスト戦略

> 詳細: [`docs/09_TESTING_STRATEGY/README.md`](docs/09_TESTING_STRATEGY/README.md)

### カバレッジ目標

| レイヤー | ツール | 最低カバレッジ |
|---------|--------|--------------|
| NestJS Services | Jest | **95%以上** |
| GraphQL Resolvers | Jest | 80%以上 |
| Prisma集計ロジック | Jest | 90%以上 |
| SvelteKit UI / page logic | Vitest | 90%以上 |
| Utils / Schemas | Vitest | 95%以上 |

### AIレスポンス耐性テスト（必須）

Geminiのレスポンスはスキーマ変化・タイムアウト・不正JSONを前提に以下をテストせよ:

```
□ 正常レスポンス → 成功Resultを返す
□ タイムアウト   → 失敗Result（error_type: :timeout）を返す
□ 不正JSON      → 失敗Result（error_type: :parse_error）を返す
□ スキーマ違反   → 失敗Result（error_type: :schema_validation_error）を返す
□ 空レスポンス   → 失敗Result（error_type: :empty_response）を返す
```

- **Gemini APIは必ずモック化する**（`jest.mock` / `msw`）。本番APIをテストで叩くことを禁止する。
- フレーク（不安定）なテストをコードベースに残すことを禁止する。

---

## 8. AI（Gemini）連携ガイドライン

- **出力は必ずInternal JSON Schemaで検証する。** DB保存直前に `ResponseValidator` を経由すること。
- **Gemini呼び出しは `GeminiClient` クラス経由のみ。** コントローラ・モデルからの直接HTTP呼び出しを禁止する。
- **プロンプトはバージョン管理する。** `docs/05_PROMPT_DESIGN/` に変更履歴を残す。
- **インサイトの品質基準（コンサルタント・トーン）**:
  - Actionable（翌日に行動できるか）
  - Specific（数値・固有名詞があるか）
  - Evidence-based（日報の具体的な記述に基づいているか）
  - この3基準を満たさないインサイトをDBに保存することを禁止する。

---

## 9. 開発コマンド

```bash
# フロントエンド
cd frontend
npm run dev           # 開発サーバー起動
npm run build         # 本番ビルド
npm run test          # Vitest（インタラクティブ）
npm run test:run      # Vitest（CI用、1回実行）
npm run check         # SvelteKit type-check

# バックエンド
cd backend
npm run prisma:generate                # Prismaクライアント生成
npm run prisma:migrate                 # マイグレーション実行
npm run start:dev                      # API起動
npm run test                           # Jest
```

---

## 10. ドキュメント構造

```
docs/
├── 00_PROJECT_OVERVIEW/       # プロジェクト全体像・ロードマップ
├── 01_REQUIREMENTS_DEFINITION/ # 機能要件・非機能要件・ユーザーストーリー
├── 02_DATABASE_DESIGN/        # ERD・テーブル定義・インデックス設計
├── 03_API_DESIGN/             # エンドポイント定義・リクエスト/レスポンス仕様
├── 04_UI-UX_DESIGN/           # 画面設計・コンポーネント設計・UXフロー
├── 05_PROMPT_DESIGN/          # Geminiプロンプトテンプレート・出力スキーマ
├── 06_DAILY_REPORT_DESIGN/    # 日報の入力マークダウンの仕様
├── 07_AI_OUTPUT_DESIGN/       # ユーザーへ渡す出力マークダウンの仕様
├── 08_DEVELOPMENT_RULES/      # Git運用・コーディング規約・レビュー基準（詳細版）
├── 09_TESTING_STRATEGY/       # テスト戦略・カバレッジ・モック設計
└── 10_DEPLOYMENT_INFRA/       # インフラ構成・CI/CD・環境変数管理
```

各ディレクトリの `README.md` が設計の詳細を含む。コードを実装する前に必ず対応する `README.md` を読むこと。
