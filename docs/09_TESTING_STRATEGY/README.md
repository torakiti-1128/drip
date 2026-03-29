# 09_TESTING_STRATEGY — テスト戦略

## 1. 全体方針

DRIP では、SvelteKit / NestJS / Prisma / GraphQL への移行後も Unit テストを最優先にする。AI 連携は非決定性が高いため、Gemini 呼び出しは必ずモックし、正常系と失敗系を分離して検証する。

## 2. カバレッジ目標

| 対象 | ツール | 最低カバレッジ |
| --- | --- | --- |
| NestJS Services | Jest | 95% |
| GraphQL Resolvers | Jest | 80% |
| Prisma 集計ロジック | Jest | 90% |
| SvelteKit schema / utils | Vitest | 95% |
| SvelteKit page logic | Vitest | 80% |

## 3. バックエンドテスト

### ディレクトリ

```text
backend/src/
├── auth/*.spec.ts
├── daily-reports/*.spec.ts
├── batch-analyses/*.spec.ts
├── dashboard/*.spec.ts
└── quizzes/*.spec.ts
```

### 重点項目

- JWT 認証の正常系・異常系
- `workingMinutes` と `contentLength` の計算
- Quiz 完了時の `completedQuizCount` 更新
- Action Plan 更新時の `completedActionCount` 更新
- Dashboard 集計値の算出

## 4. フロントエンドテスト

### ディレクトリ

```text
frontend/src/
├── lib/schemas/*.test.ts
├── lib/utils.test.ts
└── routes/**/page-logic.test.ts
```

### 重点項目

- zod schema の必須項目と境界値
- 稼働時間計算ユーティリティ
- 認証入力のバリデーション
- 画面ごとの `loading` / `error` / `empty` 制御

## 5. Gemini 耐性テスト

Gemini 連携は最低でも以下を検証する。

```text
□ 正常レスポンス
□ タイムアウト
□ 不正JSON
□ スキーマ違反
□ 空レスポンス
```

- バックエンドでは Jest のモックで Gemini client を差し替える
- フロントエンドでは本番 API を呼ばず、Apollo mock か MSW を使う

## 6. 禁止事項

- 本番 Gemini API をテストで叩くこと
- DB 実態に依存した不安定テスト
- GraphQL Resolver を通さずロジックを直接結合させるだけの薄いテスト
