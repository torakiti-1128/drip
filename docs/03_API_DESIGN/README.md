# DRIP GraphQL API 設計

## 1. 全体方針

- **Endpoint**: `/graphql`
- **Protocol**: Apollo GraphQL
- **Auth**: `Authorization: Bearer <JWT>`
- **Naming Rule**: GraphQL の field / input はすべて `camelCase`
- **Transport Rule**: フロントエンドは Apollo Client 経由のみで API を呼ぶ

### 1.1 認証・セッション

- `register(input: RegisterInput!): AuthPayload!`
- `login(input: LoginInput!): AuthPayload!`
- `me: AuthUser!`
- 認証必須 Query / Mutation は `GqlAuthGuard` で保護する。

```graphql
mutation Login($input: LoginInput!) {
  login(input: $input) {
    accessToken
    user {
      id
      email
    }
  }
}
```

## 2. Daily Reports

### 2.1 作成・更新

```graphql
mutation SaveDailyReport($input: SaveDailyReportInput!) {
  saveDailyReport(input: $input) {
    id
    targetDate
    status
    workingMinutes
    contentLength
  }
}
```

```graphql
input SaveDailyReportInput {
  id: String
  targetDate: String!
  startTime: String
  endTime: String
  breakMinutes: Int!
  status: DailyReportStatus!
  reflections: [ReflectionInput!]!
  memos: [String!]!
  tasks: [TaskInput!]!
}
```

### 2.2 一覧取得

```graphql
query DailyReports {
  dailyReports {
    id
    targetDate
    status
    workingMinutes
    contentLength
    storageUrl
  }
}
```

## 3. Settings / Tags

```graphql
query Settings {
  settings {
    id
    promptTemplate
    outputFormat
    storagePath
    webhookUrl
    aiModel
  }
}

mutation UpdateSettings($input: UpdateSettingsInput!) {
  updateSettings(input: $input) {
    id
    aiModel
    webhookUrl
    storagePath
  }
}

query Tags {
  tags {
    id
    name
    category
    colorCode
  }
}
```

## 4. Batch Analyses

```graphql
mutation CreateBatchAnalysis($input: CreateBatchAnalysisInput!) {
  createBatchAnalysis(input: $input) {
    id
    overallSummary
    progress {
      quiz {
        total
        completed
        percentage
      }
      action {
        total
        completed
        percentage
      }
    }
  }
}

query BatchAnalysis($id: String!) {
  batchAnalysis(id: $id) {
    id
    overallSummary
    goodPoints
    badPoints
    quizzes {
      id
      question
      answer
      explanation
      status
    }
    actionPlans {
      id
      content
      status
    }
  }
}
```

## 5. Interaction

```graphql
mutation AnswerQuiz($quizId: String!, $isCorrect: Boolean!) {
  answerQuiz(quizId: $quizId, isCorrect: $isCorrect) {
    id
    status
    isCorrect
  }
}

mutation ToggleActionPlan($actionPlanId: String!, $status: ActionPlanStatus!) {
  toggleActionPlan(actionPlanId: $actionPlanId, status: $status) {
    id
    status
  }
}
```

## 6. Dashboard

```graphql
query DashboardStats {
  dashboardStats {
    summaryPeriod
    activity {
      creationRate
      totalReports
      avgWorkingMinutes
      trends {
        dates
        workingMinutes
        contentLengths
      }
    }
    learning {
      overallAccuracy
      engagementRate
      performanceByTag {
        tagName
        accuracy
        totalQuizzes
      }
    }
    bottlenecks {
      actionVelocity
      weakTags {
        tagName
        reason
      }
    }
  }
}
```
