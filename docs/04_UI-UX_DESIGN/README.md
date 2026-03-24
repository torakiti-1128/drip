# UI-UX設計書

## 1. デザイン原則 (Design Principles)
- **High Signal, Low Noise**: 重要なインサイト（改善アクション・クイズ）を最優先。
- **Mobile First for Reflection**: 振り返り（クイズ）は片手で完結。
- **Auto-Save Everything**: 入力負荷を減らすため、全フォームに下書き保存機能を搭載。

---

## 2. 画面遷移と主要コンポーネント

### 2.0 [Auth Gate] - 認証とセッション復元
アプリ起動時の入口。
- **Components**:
    - `LoginCard`: ログイン方法の選択と説明。
    - `SessionRestorer`: 起動時に Supabase セッションを復元し、成功時は dashboard へ遷移。
    - `AuthErrorState`: セッション失効や認証エラーを再ログインへ導く。

### 2.1 [Dashboard] - 自己成長の可視化
ユーザーがアプリを開いて最初に目にする。
- **Components**:
    - `WeeklyActivityChart`: 過去7日の稼働時間と日報作成率の混合グラフ。
    - `NextActionCard`: 最優先の「未読改善アクション」を1件強調表示。
    - `QuizProgressDonut`: 今週のクイズ着手率と正解率をドーナツチャートで表示。
    - `WeakPointTagCloud`: 不正解が多いタグを赤色、正解が多いタグを青色でヒートマップ表示。

### 2.1.1 [Report List] - 日報の履歴導線
入力継続を支える一覧画面。
- **Components**:
    - `ReportListTable`: 日付、稼働時間、状態、保存リンクの一覧。
    - `ReportStatusBadge`: `draft` / `completed` を可視化。
    - `StorageLinkButton`: 外部保存済み Markdown への導線。

### 2.2 [Daily Report Editor] - 構造化入力
Markdownの柔軟性と、DBの構造化を両立させるUI。
- **Layout**: PCでは左右2ペイン（左：入力、右：プレビュー）、Mobileではタブ切り替え。
- **Features**:
    - `TaskRowItem`: 業務内容、予実時間、ステータス、タグを選択する行コンポーネント（動的追加可能）。
    - `TimeCalculator`: 開始/終了/休憩時間から稼働時間をリアルタイム計算し、ヘッダーに表示。
    - `DraftManager`: `localStorage` を利用したリアルタイム保存機能。
    - `ExportButton`: 入力内容をMarkdown化してGoogle DriveへPushし、URLを取得。

### 2.3 [Batch Analysis Detail] - AIからのフィードバック
AIが生成した「知恵」を消化するための画面。
- **Components**:
    - `SummaryHeader`: 全体概要を「AIからの手紙」風に表示。
    - `ActionPlanList`: チェックボックス付きのリスト。チェックで `PATCH /action_plans/:id/toggle` を実行。
    - `QuizLauncher`: クイズ回答画面（モーダルまたは別画面）への導線。

### 2.4 [Quiz Runner] - 定着のためのフラッシュカード
PWAの機動性を最大化するモバイル特化UI。
- **Interaction**:
    1. **Question State**: 問題文を中央に大きく表示。
    2. **Flip Action**: 「解答を見る」ボタンでカードが反転。
    3. **Evaluation State**: 解答と解説を表示。「正解」「不正解」の2択ボタンを表示。
    4. **Result State**: 全問終了後、正解数と「AIからの励ましメッセージ」を表示。

### 2.5 [Settings] - 個人設定と運用導線
AI と通知の挙動を調整する画面。
- **Components**:
    - `PromptTemplateEditor`: プロンプトテンプレートの編集。
    - `WebhookSettingsForm`: Slack / Google Chat 通知先の設定。
    - `TagManager`: タグの確認と追加導線。
    - `AccountPanel`: ログイン中アカウント表示とログアウト導線。

---

## 3. PWA (Progressive Web App) 仕様
- **App Icon**: 集中力を高めるダークブルーを基調としたロゴ。
- **Service Worker**: 
    - 静的アセットのキャッシュによる高速起動。
    - オフライン時のクイズ回答データのキューイング（オンライン復帰時に一括同期）。
- **Push Notification**:
    - **AM 08:30**: 「昨日の学びを定着させましょう（クイズ通知）」。
    - **PM 21:00**: 「今日の振り返りは済みましたか？（未作成リマインド）」。

---

## 4. フロントエンド技術スタック & ディレクトリ構成

### Tech Stack
- **Vite + React (TypeScript)**: 高速な開発と型安全。
- **Tailwind CSS + shadcn/ui**: 一貫性のある美しいUI。
- **Lucide React**: 意味論に基づいたアイコンセット。
- **TanStack Query (React Query)**: AI解析待ちのポーリングやキャッシュ管理。
