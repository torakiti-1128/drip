# DRIP (Daily Report Insights Pipeline) API 最終定義書

## 1. 全体プロトコル
- **Base URL**: `/api/v1`
- **Auth**: `Authorization: Bearer <Supabase_JWT>`
- **Format**: JSON (CamelCase for keys)
- **Naming Rule**: 外部公開する request / response のキーはすべて `camelCase`。DB カラム名の `snake_case` を API に露出させない。
- **Status Codes**: 
  - `200 OK`: 取得・更新成功
  - `201 Created`: 新規作成成功
  - `202 Accepted`: 非同期処理（AI解析）受付
  - `400 Bad Request`: バリデーションエラー
  - `500 Internal Server Error`: AI解析失敗・サーバーエラー

### 1.1 認証・セッションルール
- 認証は Supabase Auth を正とし、frontend がセッション取得後に `Bearer <Supabase_JWT>` を付与して Rails API を呼び出す。
- Rails API は未認証リクエストに `401 Unauthorized` を返す。
- frontend はアプリ起動時にセッション復元を試み、失敗時はログイン画面へ遷移する。
- backend 側でアプリ独自のログイン API は持たず、必要なのは JWT 検証と `currentUser` 解決のみとする。

---

## 2. 日報管理 (Intake & Manage)

### 2.1 日報の作成・更新
- **Endpoint**: `POST/PUT /daily_reports`
- **Summary**: フォーム入力内容を一括保存。保存時にバックエンドで `working_minutes` と `content_length` を自動計算。
- **Request Body**:
```json
{
  "dailyReport": {
    "targetDate": "2026-03-24",
    "startTime": "2026-03-24T09:00:00Z",
    "endTime": "2026-03-24T19:00:00Z",
    "breakMinutes": 60,
    "status": "completed",
    "reflections": [
      { "title": "技術的な気づき", "content": "RailsのNested Attributesは強力。" }
    ],
    "memos": ["明日はReactのコンポーネント実装"],
    "tasksAttributes": [
      {
        "summary": "DB設計とAPI定義",
        "estimatedHours": 4.0,
        "actualHours": 4.5,
        "status": "completed",
        "estimatedCompletion": "2026-03-24T18:00:00Z",
        "tagIds": ["uuid-tag-dev", "uuid-tag-design"]
      }
    ]
  }
}
```

### 2.2 日報一覧の取得
- **Endpoint**: `GET /daily_reports`
- **Response**: リスト表示に必要なサマリーと計算済み稼働時間を返却。

```json
{
  "dailyReports": [
    {
      "id": "uuid-report-1",
      "targetDate": "2026-03-24",
      "status": "completed",
      "workingMinutes": 540,
      "contentLength": 1260,
      "storageUrl": "https://drive.google.com/..."
    }
  ]
}
```

---

## 2.5 設定・マスタ管理

### 2.5.1 設定の取得・更新
- **Endpoint**: `GET /settings` / `PATCH /settings`
- **Summary**: プロンプト、通知先、出力フォーマット、AI モデルなどの個人設定を管理する。

```json
{
  "settings": {
    "promptTemplate": "string",
    "outputFormat": "string",
    "storagePath": "string",
    "webhookUrl": "https://hooks.slack.com/...",
    "aiModel": "gemini-2.0-flash"
  }
}
```

### 2.5.2 タグ一覧の取得
- **Endpoint**: `GET /tags`
- **Summary**: 日報入力と AI 分析で利用するタグ一覧を返す。

```json
{
  "tags": [
    {
      "id": "uuid-tag-1",
      "name": "設計",
      "category": "work",
      "colorCode": "#3b82f6"
    }
  ]
}
```

---

## 3. 解析パイプライン (Batch & AI)

### 3.1 バッチ解析の実行 (非同期)
- **Endpoint**: `POST /batch_analyses`
- **Request**: `{ "startDate": "2026-03-01", "endDate": "2026-03-07" }`
- **Logic**: 指定期間の `DailyReport` を収集し、Geminiに解析を依頼。完了後、`ActionPlan` と `Quiz` を自動生成。

```json
{
  "jobId": "uuid-job-1",
  "status": "accepted"
}
```

### 3.2 解析結果の詳細取得
- **Endpoint**: `GET /batch_analyses/:id`
- **Summary**: 進捗率（クイズ・アクション）を計算済みの状態で返却。
- **Response Data**:
```json
{
  "id": "uuid-batch-1",
  "overallSummary": "...",
  "goodPoints": "...",
  "badPoints": "...",
  "progress": {
    "quiz": { "total": 10, "completed": 3, "percentage": 30.0 },
    "action": { "total": 5, "completed": 1, "percentage": 20.0 }
  },
  "scorecards": [
    {
      "title": "生産性",
      "score": 85,
      "judgment": "優良"
    },
    {
      "title": "学習の深さ",
      "score": 92,
      "judgment": "卓越"
    }
  ],
  "driveLink": "https://drive.google.com/...",
  "quizzes": [
    {
      "id": "uuid-q-1",
      "question": "...",
      "answer": "...",
      "explanation": "...",
      "status": "unstarted",
      "tags": ["マネジメント"]
    }
  ],
  "actionPlans": [
    {
      "id": "uuid-ap-1",
      "content": "...",
      "status": "pending"
    }
  ]
}
```

---

## 4. インタラクション (Interaction)

### 4.1 クイズ回答送信
- **Endpoint**: `PATCH /quizzes/:id/answer`
- **Summary**: 回答ステータスを `completed` にし、`completedAt` を記録。
- **Request**: `{ "isCorrect": true }`

### 4.2 アクションプラン完了切り替え
- **Endpoint**: `PATCH /action_plans/:id/toggle`
- **Request**: `{ "status": "completed" }`

---

## 5. ダッシュボード・マスター (Analytics & Master)

### 5.1 統計情報の取得
- **Endpoint**: `GET /dashboard/stats`
- **Summary**: 
- Activity Metrics (日報作成・稼働状況): ユーザーが「継続」できているかを定量化します。
1. 日報作成率 (Report Creation Rate): (作成済み日数 / 営業日数) * 100。
2. 稼働時間推移 (Working Hours Trend): 日別の稼働時間の配列。過重労働の兆候を察知。
3. アウトプット量 (Content Volume): 日別の平均文字数。思考の深化を「書いた量」で近似測定。
- Learning Metrics (クイズ正答率・着手率): 知識が「定着」しているかを定量化します。
1. 全体正答率 (Overall Accuracy): 全クイズ中の正解率。
2. クイズ着手率 (Quiz Engagement Rate): 生成されたクイズのうち、実際に回答した割合。
3. タグ別正答率 (Accuracy by Tag): 「技術」「マネジメント」「設計」などのカテゴリ別の正誤分布。
4. Growth Insights (弱点・改善ポイント)AI解析から導き出された「伸び代」を可視化します。
- 弱点タグランキング (Weak Point Ranking):
1. Action Plan に多く紐付いているタグ（＝改善が必要とAIが判断した分野）。
2. Quiz で不正解が多いタグ（＝理解が不十分な分野）。
3. 改善アクション進捗 (Action Plan Velocity): 生成されたアクションのうち、何割がcompleted になったか。
- Response Data:
```json
{
  "data": {
    "summaryPeriod": "2026-03-01 to 2026-03-24",
    "activity": {
      "creationRate": 85.0,
      "totalReports": 18,
      "avgWorkingMinutes": 510,
      "trends": {
        "dates": ["03-20", "03-21", "03-22", "03-23", "03-24"],
        "workingMinutes": [480, 540, 0, 500, 520],
        "contentLengths": [1200, 1500, 0, 800, 1100]
      }
    },
    "learning": {
      "overallAccuracy": 72.5,
      "engagementRate": 90.0,
      "performanceByTag": [
        { "tagName": "Ruby on Rails", "accuracy": 95, "totalQuizzes": 20 },
        { "tagName": "Management", "accuracy": 40, "totalQuizzes": 15 }
      ]
    },
    "bottlenecks": {
      "weakTags": [
        { "tagName": "Management", "reason": "High frequency in Action Plans & Low Quiz Score" },
        { "tagName": "Time Estimation", "reason": "Recurring delays in tasks" }
      ],
      "actionVelocity": 45.0
    }
  }
}
```

### 5.2 システム設定・マスタの更新
- **Endpoint**: `PATCH /settings` / `GET /tags`
- **Summary**: プロンプト、通知先Webhook、AIモデル、タグ一覧の管理。
