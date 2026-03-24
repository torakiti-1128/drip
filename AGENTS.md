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
| Frontend | React + Vite | 19 / 6 |
| UI Components | shadcn/ui + Tailwind CSS | latest |
| Server State | TanStack Query | v5 |
| Language (FE) | TypeScript | 5.x strict |
| Backend | Ruby on Rails (APIモード) | 8.x |
| Language (BE) | Ruby | 3.3+ |
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
│   └── pull_request_template.md
├── docs/                      # 設計ドキュメント（詳細は後述）
├── frontend/                  # React 19 アプリケーション
│   ├── src/
│   │   ├── components/        # atoms / molecules / organisms
│   │   ├── hooks/             # カスタムフック（useXxx形式）
│   │   ├── pages/             # ルートレベルのページコンポーネント
│   │   ├── services/          # APIクライアント関数
│   │   ├── schemas/           # zodスキーマ定義
│   │   ├── types/             # 型定義（*.d.ts, index.ts）
│   │   └── utils/             # 純粋関数ユーティリティ
│   └── src/__tests__/         # Vitestテスト
└── backend/                   # Rails 8 API
    ├── app/
    │   ├── controllers/api/v1/
    │   ├── models/
    │   ├── services/          # Service Objects（必須）
    │   │   ├── gemini/        # AI連携レイヤー
    │   │   └── reports/
    │   └── serializers/
    └── spec/                  # RSpecテスト
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
<type>(<scope>): <subject>(#issue)

type  : feat / fix / docs / refactor / test / chore / perf / ci
scope : frontend / backend / db / gemini / deploy / docs（任意）
subject: 日本語、命令形、50文字以内

例:
  feat(backend): add Gemini retry logic with exponential backoff(#11)
  fix(frontend): resolve quiz state reset on page reload(#12)
  test(backend): add schema validation spec for Gemini response(#13)
  docs: update API endpoint reference for v1/insights(#14)
```

**禁止例:**
```
# NG: 何をしたか不明
git commit -m "fix"
git commit -m "update"
git commit -m "WIP"
```

### プルリクエスト（PR）ルール

- PRテンプレート（`.github/pull_request_template.md`）を必ず使用する。
- マージ前チェックリスト:
  - [ ] CIがグリーン（rspec + vitest + lint）
  - [ ] AIセルフレビュー実施済み（差分コメントに記載）
  - [ ] 関連する設計書（docs/）が更新されているか確認
  - [ ] `any`型・ハードコードされた秘密情報がないか確認
- マージ戦略: `Squash and merge`（featureブランチのコミット履歴を1つに圧縮）

---

## 5. コーディング規約

### 5-1. 共通ルール

- **秘密情報のハードコード禁止。** APIキー・DBパスワードは環境変数のみ。
- **TODO/FIXMEコメントには必ず担当者とIssue番号を添える。** `// TODO(torakiti-1128): #42 リトライロジックを追加`
- **マジックナンバー禁止。** 定数（`QUIZ_MAX_RETRIES = 3`等）として定義する。

### 5-2. フロントエンド（TypeScript / React）

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
| コンポーネント名 | PascalCase（`ReportEditor.tsx`） |
| フック名 | `useXxx`形式（`useInsights.ts`） |
| ユーティリティ・ファイル | kebab-case（`api-client.ts`） |
| 型ファイル | `types/index.ts` に集約 |
| `any`使用 | **禁止**。`unknown` + 型ガードで代替 |
| デフォルトexport | ページコンポーネントのみ許可。他はnamed export |

**コンポーネント3ステート必須:**
```tsx
// OK: 3ステートすべて実装
function InsightList() {
  const { data, isPending, isError } = useInsights();
  if (isPending) return <InsightSkeleton />;
  if (isError)   return <InsightErrorState />;
  if (!data?.length) return <InsightEmptyState />;
  return <div>{data.map(...)}</div>;
}

// NG: ローディング・エラー・空状態の未実装
function InsightList() {
  const { data } = useInsights();
  return <div>{data.map(...)}</div>;
}
```

### 5-3. バックエンド（Ruby / Rails）

```
Controller  → 薄く（5行以内が理想）。認証・パラメータ取得・Service呼び出し・レスポンスのみ。
Service     → ビジネスロジックの唯一の置き場。必ず app/services/ 配下に配置。
Model       → バリデーション・スコープ・アソシエーションのみ。ビジネスロジックを書かない。
Serializer  → レスポンスのJSON整形。キーは常にcamelCase。
```

```ruby
# 正しいService Objectパターン
class Gemini::AnalyzeReportService
  Result = Data.define(:success, :data, :error)

  def initialize(report:)
    @report = report
  end

  def call
    raw = GeminiClient.new.generate(build_prompt)
    validated = ResponseValidator.new(:insight).call(raw)
    Result.new(success: true, data: validated, error: nil)
  rescue GeminiClient::TimeoutError => e
    Result.new(success: false, data: nil, error: "timeout: #{e.message}")
  rescue ResponseValidator::SchemaError => e
    Result.new(success: false, data: nil, error: "schema_error: #{e.message}")
  end
end

# 禁止: Controllerにビジネスロジックを書く
def create
  # 直接Geminiを呼ぶ、JSONをパースする等は禁止
end
```

- レスポンスのJSONキーは **camelCase** に統一（Jbuilder / `jsonapi-serializer`使用）。
- `render json: object` の直書き禁止。必ずSerializerを経由する。

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
| Service Objects | RSpec | **95%以上** |
| Controllers (API) | RSpec + request spec | 80%以上 |
| Models | RSpec | 90%以上 |
| React Hooks | Vitest | 90%以上 |
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

- **Gemini APIは必ずモック化する**（`webmock` / `msw`）。本番APIをテストで叩くことを禁止する。
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
npm run lint          # ESLint
npm run type-check    # tsc --noEmit

# バックエンド
cd backend
bundle exec rails s                    # サーバー起動
bundle exec rails console              # Railsコンソール
bundle exec rake db:migrate            # マイグレーション実行
bundle exec rake db:migrate:status     # マイグレーション状況確認
bundle exec rspec                      # 全テスト
bundle exec rspec spec/services/       # Serviceのみ
bundle exec rubocop                    # Lintチェック
bundle exec rubocop -a                 # 自動修正
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
└── 11_ISSUE_MANAGEMENT/       # タスク管理・Github Issueのフォーマット
```

各ディレクトリの `README.md` が設計の詳細を含む。コードを実装する前に必ず対応する `README.md` を読むこと。
