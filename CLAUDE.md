# CLAUDE.md: DRIP プロジェクト・インテリジェンス

このドキュメントは、AIアシスタントが DRIP (Daily Report Insights Pipeline) プロジェクトの構造、コーディング規約、および設計思想を瞬時に把握し、高品質なコードを生成するための「ガイドライン」です。

## プロジェクト概要
DRIPは、日報を単なる記録から「戦略的インサイト」と「学習用クイズ」へと変換する、AI駆動型の自己成長プラットフォームです。
- **コア・ループ**: 日報入力 (Input) -> Gemini APIによる解析 (Analysis) -> PWAでの定着クイズ (Retention)。
- **設計思想**: 「SMART原則」に基づいたアクション抽出と、経験を血肉化する「振り返り」の構造化。

---

## 技術スタック & アーキテクチャ
- **Frontend**: React 19 (Vite), TypeScript, Tailwind CSS, shadcn/ui, TanStack Query.
- **Backend**: Ruby on Rails 8 (APIモード), PostgreSQL (Supabase).

---

### Git 運用ルール
- **ブランチ戦略**: 
    - `main`: 常に本番稼働可能な「安定版」ブランチ。
    - `feature/*`: 新機能開発・リファクタリング用の「開発」ブランチ。
- **コミットメッセージ**: **Conventional Commits** 形式を厳守。
    - `feat:`, `fix:`, `docs:`, `refactor:`, `test:` を使用。
- **プルリクエスト (PR)**: マージ前に必ず **AIによるセルフレビュー** を実施。

### テスト戦略
- **バックエンド (RSpec)**: 
    - Service/Modelロジック、特に「工数計算」と「Markdown生成」のテストを最優先。
- **フロントエンド (Vitest)**: 
    - ユーティリティ関数（日付処理、バリデーション等）の単体テスト。
- **AIレジリエンス (AI耐性)**: 
    - AIらのレスポンスを、**DB保存直前に内部JSONスキーマで検証**すること。
- **CI (継続的インテグレーション)**: 
    - プッシュごとに `rspec` と `vitest` を自動実行。

---

## コーディング規約

### 共通ルール
- **TypeScript必須**: 型定義を厳格に行い、`any` の使用は原則禁止。
- **関数型コンポーネント**: Arrow Functions と React Hooks を使用。
- **命名規則**: 
    - コンポーネント: PascalCase (例: `ReportEditor.tsx`)
    - 関数・変数: camelCase
    - ユーティリティ・ファイル名: kebab-case (例: `api-client.ts`)

### バックエンド (Rails) ルール
- **Fat Model, Skinny Controller**: ビジネスロジックは Service Classes または Models に集約。
- **Service Objects**: AI解析やMarkdown生成など、単一責任の処理に使用（例: `Analysis::GeneratorService`）。
- **JSON形式**: レスポンスのキーは常に camelCase (Jbuilder等を使用)。

---

## データベース制約
AIは以下のテーブル構造を厳守すること：
- `daily_reports`: `reflections`（所感）と `memos`（メモ）は `jsonb` 型を使用。
- `batch_analyses`: `completed_quiz_count` で進捗を管理。
- `quizzes`: ステータスは `unstarted` または `completed` のみ。

---

## AIガイドライン
- **出力フォーマット**: 解析結果を生成する際は、設計書で定義された `Internal JSON Schema` に必ず従うこと。
- **コンサルタント・トーン**: AIのフィードバックは「戦略的」「率直」「支援的」であること（マッキンゼー/GSスタイル）。
- **検証**: 提案するコードが、`daily_report` のネストされた属性（Nested Attributes）の更新ロジックと整合しているか常に確認せよ。

---

## 開発コマンド
- `npm run dev`: フロントエンド起動
- `bundle exec rails s`: バックエンド起動
- `bundle exec rake db:migrate`: マイグレーション実行

---
*参照: 詳細なAPI/DB仕様については `docs/` を確認すること。*