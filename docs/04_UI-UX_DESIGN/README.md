# UI-UX設計書

## 1. デザイン原則

- **High Signal, Low Noise**: 改善アクションとクイズを最優先で表示する
- **Mobile First for Reflection**: クイズ回答は片手操作を前提にする
- **Auto-Save Everything**: 日報入力は下書き保存を前提にする
- **Three States Required**: 主要ページは `loading` / `error` / `empty` を必ず持つ

## 2. 主要画面

### 2.0 Login
- JWT ベース認証の入口
- `login` / `register` Mutation を切り替える

### 2.1 Dashboard
- 日報作成率、正答率、Action Velocity、弱点タグを表示する
- 直近の日報一覧と保存リンクを併設する

### 2.2 Daily Report Editor
- 左側に入力、右側にプレビューを置く 2 カラム構成
- 稼働時間はリアルタイム計算する
- タスク、所感、メモは動的追加可能とする

### 2.3 Batch Analysis Detail
- AI サマリーを冒頭に置く
- Action Plan は即時トグルできる
- Quiz は設問、答え、解説、正誤送信まで一画面で扱う

### 2.4 Settings
- Prompt Template / Output Format / Webhook / Storage Path / AI Model を管理する
- タグ一覧を併設する

## 3. フロントエンド技術構成

- **SvelteKit**: ルーティングとページ単位の構成管理
- **Tailwind CSS**: 画面スタイルの統一
- **Apollo Client**: GraphQL query / mutation の単一クライアント
- **zod**: 入力検証
- **Vitest**: schema / util / UI ロジックのテスト

## 4. ディレクトリ方針

```text
frontend/src/
├── lib/
│   ├── components/
│   ├── graphql/
│   ├── schemas/
│   └── utils.ts
├── routes/
│   ├── login/
│   ├── dashboard/
│   ├── reports/new/
│   ├── analyses/[id]/
│   └── settings/
└── app.css
```
