# プロジェクト概要

## 1. コンセプト
DRIP (Daily Report Insights Pipeline) は、Markdown/構造化フォームで入力した日報を AI で解析し、改善アクションと復習クイズに変換する自己成長基盤である。

## 2. システムアーキテクチャ

* **Frontend**: SvelteKit / TypeScript / Tailwind CSS / Apollo Client
  * GraphQL を単一のデータ取得経路として採用し、画面ごとのデータ要件を明示する。
* **Backend**: NestJS / Apollo GraphQL / Prisma
  * 認証、日報保存、分析結果、ダッシュボード集計をモジュール単位で管理する。
* **Database**: PostgreSQL (Supabase)
  * 日報、タグ、設定、クイズ、改善アクションを永続化する。
* **AI Engine**: Gemini 2.0 Flash
  * 分析バッチで要約、改善案、クイズ生成を担当する。
* **Auth**: JWT + Passport
  * GraphQL Guard で保護された API に対し、フロントエンドが Bearer Token を付与してアクセスする。
* **Deployment**: Vercel (Frontend) / Render (Backend)
  * フロントエンドとバックエンドを分離デプロイし、DB は Supabase を利用する。

## 3. 基本機能

| ステージ | 内容 | 実装のポイント |
| :--- | :--- | :--- |
| Intake | 構造化日報の入力・保存 | 稼働時間・文字数を自動計算する |
| Filter | AI による複数日報の要点抽出 | 事実、改善余地、再現可能な行動を分ける |
| Infuse | クイズと改善アクション生成 | 行動可能性と記憶定着を優先する |
| Discharge | 改善行動の実行管理 | Action Plan の進捗を記録する |
| Observe | ダッシュボードで可視化 | 日報継続率、正答率、弱点タグを集計する |

## 4. 管理機能

* **Prompt Editor**: Gemini 用プロンプトを編集する。
* **Format Settings**: Markdown 出力や保存先ルールを管理する。
* **Notification Settings**: Webhook URL と通知タイミングを管理する。
* **Tag Management**: 日報・分析用タグの一覧を管理する。

## 5. 戦略的マイルストーン

1. **Phase 1**: NestJS + Prisma + GraphQL で日報保存と認証を成立させる。
2. **Phase 2**: SvelteKit で日報入力、分析詳細、設定 UI を実装する。
3. **Phase 3**: Gemini バッチ、通知、PWA 最適化を追加する。
