# Drip (Daily Report Insights Pipeline)

## 概要
>DRIPは、日報をAIで解析し、具体的なアクションプランと定着クイズを自動生成する「自己成長のパイプライン」です。

---

## コンセプト
多くの日報は「書いたら終わり」です。DRIPは、書く、分析する、解くの3フェーズを回すことで、経験の「忘却」を防ぎ、確実な成長を支援します。

1. **Input**: 予実管理と所感を構造化して記録。
2. **Analysis**: Aiが戦略コンサルタントの視点で週次／月次の傾向を分析。
3. **Retention**: 解析結果から「翌朝の定着クイズ」を自動生成。スマホ（PWA）で隙間時間に復習。
4. **Asset**: すべての結果をMarkdownとしてGoogle Driveに自動同期。

---

## 技術スタック

### Frontend
- **React 19 / Vite**: 高速な開発とモダンなレンダリング。
- **Tailwind CSS / shadcn/ui**: 一貫性のあるUIコンポーネント。
- **TanStack Query**: 非同期データ取得とAI解析のステータス管理。

### Backend
- **Ruby on Rails 8 (API Mode)**: 堅牢なビジネスロジックとDB連携。
- **PostgreSQL / Supabase Auth**: 信頼性の高いデータ基盤と認証。
- **Google Drive API**: Markdownの外部出力。
- **Webhook API**: 出力結果の通知とタスク対応の催促 (Slack、GoogleChat)。
   
---

## データベース

主要なテーブル構造は以下の通りです[[参照](./docs/02_DATABASE_DESIGN.md)]。
- `daily_reports`: 稼働時間、所感、メモの管理。
- `tasks`: 業務内容の予実管理とタグ付け。
- `batch_analyses`: AIによる全体サマリーとスコアリング。
- `quizzes`: 学習定着のためのAI生成問題。
- `action_plans`: SMART原則に基づく改善行動。

---

## クイックスタート

### 要件
- Node.js (v20+)
- Ruby (v3.3+)
- Google Gemini API Key
- Supabase Project

### 手順
```bash
# Frontend
cd frontend
npm install
npm run dev

# Backend
cd backend
bundle install
rails db:create db:migrate
rails s
```
