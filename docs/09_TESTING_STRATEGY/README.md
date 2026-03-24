# 09_TESTING_STRATEGY — テスト戦略

> AGENTS.md §7 の詳細版。DRIPプロジェクトのテスト設計・実装規約・AIレスポンス耐性テストを定義する。

---

## 1. テスト戦略の全体像

### テストピラミッド

```
          [E2E / Integration]
         ← 少ない・遅い・高コスト
        ────────────────────────
       [API Request Spec / Component Test]
      ────────────────────────────────────
     [Unit: Service / Model / Hooks / Utils]
    ← 多い・速い・低コスト
```

DRIPでは **Unit層に最大投資**する。AIレスポンスの非決定性を考慮し、Gemini連携レイヤーのテストを特に厳密に行う。

### カバレッジ目標

| 対象 | ツール | 最低カバレッジ | 優先度 |
|------|--------|--------------|--------|
| Service Objects | RSpec | **95%** | 最高 |
| Models | RSpec | 90% | 高 |
| Controllers (request spec) | RSpec | 80% | 高 |
| React Custom Hooks | Vitest | **90%** | 最高 |
| zodスキーマ / utils | Vitest | 95% | 高 |
| React Components | Vitest + Testing Library | 70% | 中 |

---

## 2. バックエンドテスト（RSpec）

### ディレクトリ構成

```
spec/
├── services/
│   ├── gemini/
│   │   ├── analyze_report_service_spec.rb   ← 最重要
│   │   ├── generate_quiz_service_spec.rb
│   │   └── client_spec.rb
│   └── reports/
│       └── create_report_service_spec.rb
├── models/
├── requests/api/v1/                         ← API統合テスト
├── schemas/
│   └── gemini_response_schema_spec.rb       ← AIスキーマ検証テスト（必須）
├── factories/                               ← FactoryBot
└── support/
    ├── shared_contexts/
    │   └── gemini_stubs.rb                  ← Geminiモック共通化
    └── helpers/
```

### 命名規約

```ruby
# describe: クラス名 or メソッド名
# context:  「〜の場合」「〜のとき」
# it:       「〜である」「〜を返す」

RSpec.describe Gemini::AnalyzeReportService do
  describe "#call" do
    context "Geminiが正常なレスポンスを返す場合" do
      it "成功Resultを返す" do
      it "insightデータにcategoryが含まれる" do
    end

    context "Geminiがタイムアウトした場合" do
      it "失敗Resultを返す" do
      it "error_typeが:timeoutである" do
    end
  end
end
```

### Geminiモックの標準パターン

```ruby
# spec/support/shared_contexts/gemini_stubs.rb
module GeminiStubs
  def stub_gemini_success(fixture_name)
    fixture = JSON.parse(
      File.read("spec/fixtures/gemini/#{fixture_name}.json")
    )
    allow_any_instance_of(GeminiClient)
      .to receive(:generate)
      .and_return(fixture)
  end

  def stub_gemini_timeout
    allow_any_instance_of(GeminiClient)
      .to receive(:generate)
      .and_raise(GeminiClient::TimeoutError, "connection timed out")
  end

  def stub_gemini_invalid_json
    allow_any_instance_of(GeminiClient)
      .to receive(:generate)
      .and_return("これはJSONではない")
  end

  def stub_gemini_schema_violation(overrides = {})
    base = JSON.parse(File.read("spec/fixtures/gemini/valid_insight.json"))
    allow_any_instance_of(GeminiClient)
      .to receive(:generate)
      .and_return(base.merge(overrides))
  end
end

RSpec.configure do |config|
  config.include GeminiStubs
end
```

### AIレスポンス耐性テスト（必須5ケース）

全Gemini連携Serviceは以下5ケースをテストすること:

```ruby
RSpec.describe Gemini::AnalyzeReportService do
  describe "#call" do
    # ケース1: 正常系
    context "正常なレスポンスの場合" do
      before { stub_gemini_success("valid_insight") }
      it "成功Resultを返す" do
        expect(service.call).to be_success
      end
    end

    # ケース2: タイムアウト
    context "タイムアウトの場合" do
      before { stub_gemini_timeout }
      it "error_type: :timeoutの失敗Resultを返す" do
        result = service.call
        expect(result).to be_failure
        expect(result.error_type).to eq(:timeout)
      end
    end

    # ケース3: 不正JSON
    context "不正なJSONの場合" do
      before { stub_gemini_invalid_json }
      it "error_type: :parse_errorの失敗Resultを返す" do
        result = service.call
        expect(result).to be_failure
        expect(result.error_type).to eq(:parse_error)
      end
    end

    # ケース4: スキーマ違反
    context "スキーマに違反したレスポンスの場合" do
      before { stub_gemini_schema_violation("score" => 999) }
      it "error_type: :schema_validation_errorの失敗Resultを返す" do
        result = service.call
        expect(result).to be_failure
        expect(result.error_type).to eq(:schema_validation_error)
      end
    end

    # ケース5: 空レスポンス
    context "空のレスポンスの場合" do
      before { stub_gemini_schema_violation("candidates" => []) }
      it "error_type: :empty_responseの失敗Resultを返す" do
        result = service.call
        expect(result).to be_failure
        expect(result.error_type).to eq(:empty_response)
      end
    end
  end
end
```

---

## 3. フロントエンドテスト（Vitest）

### ディレクトリ構成

```
src/
├── __tests__/                     # 統合的なテスト
├── components/__tests__/          # コンポーネントテスト
├── hooks/__tests__/               # カスタムフックテスト（最重要）
├── schemas/__tests__/             # zodスキーマテスト
├── utils/__tests__/               # ユーティリティテスト
└── mocks/
    ├── server.ts                  # MSWサーバー設定
    ├── handlers/
    │   ├── insights.ts            # インサイトAPIモック
    │   └── reports.ts             # 日報APIモック
    └── fixtures/
        ├── insight.ts
        └── report.ts
```

### MSW（Mock Service Worker）標準パターン

```typescript
// src/mocks/handlers/insights.ts
import { http, HttpResponse } from 'msw';
import { mockInsight } from '../fixtures/insight';

export const insightHandlers = [
  http.get('/api/v1/reports/:reportId/insights', () => {
    return HttpResponse.json(mockInsight);
  }),

  http.get('/api/v1/reports/error/insights', () => {
    return HttpResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }),
];
```

### カスタムフックのテストパターン

```typescript
// src/hooks/__tests__/useInsights.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { server } from '@/mocks/server';
import { http, HttpResponse } from 'msw';
import { useInsights } from '../useInsights';
import { createTestQueryClient } from '@/test/utils';

const wrapper = createTestQueryClient(); // QueryClientProviderラッパー

describe('useInsights', () => {
  it('ローディング中はisPendingがtrueである', () => {
    const { result } = renderHook(() => useInsights('report-1'), { wrapper });
    expect(result.current.isPending).toBe(true);
  });

  it('正常取得時にinsightデータが返る', async () => {
    const { result } = renderHook(() => useInsights('report-1'), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.id).toBeDefined();
  });

  it('APIが500を返したときisErrorがtrueである', async () => {
    server.use(
      http.get('/api/v1/reports/:id/insights', () =>
        HttpResponse.json({ error: 'Server Error' }, { status: 500 })
      )
    );
    const { result } = renderHook(() => useInsights('report-1'), { wrapper });
    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
```

### zodスキーマのテスト（必須）

```typescript
// src/schemas/__tests__/insight.schema.test.ts
import { InsightSchema } from '../insight.schema';

describe('InsightSchema', () => {
  it('有効なデータをパースできる', () => {
    const valid = { id: '...uuid...', category: 'learning', score: 80, summary: '...' };
    expect(() => InsightSchema.parse(valid)).not.toThrow();
  });

  it('scoreが100を超える場合はエラーになる', () => {
    const invalid = { ...validBase, score: 101 };
    expect(() => InsightSchema.parse(invalid)).toThrow();
  });

  it('categoryが未定義の値の場合はエラーになる', () => {
    const invalid = { ...validBase, category: 'unknown_category' };
    expect(() => InsightSchema.parse(invalid)).toThrow();
  });
});
```

---

## 4. CI設定

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: ['**']
  pull_request:
    branches: [develop, main]

jobs:
  backend:
    name: Backend (RSpec + RuboCop)
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: drip_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v4
      - uses: ruby/setup-ruby@v1
        with:
          working-directory: backend
          bundler-cache: true
      - name: RuboCop
        run: bundle exec rubocop --parallel
        working-directory: backend
      - name: RSpec
        run: bundle exec rspec --format progress --format json --out tmp/rspec_results.json
        working-directory: backend
        env:
          RAILS_ENV: test
          DATABASE_URL: postgres://postgres:postgres@localhost:5432/drip_test

  frontend:
    name: Frontend (Vitest + ESLint + tsc)
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
          cache-dependency-path: frontend/package-lock.json
      - run: npm ci
        working-directory: frontend
      - run: npm run lint
        working-directory: frontend
      - run: npm run type-check
        working-directory: frontend
      - run: npm run test:run
        working-directory: frontend
```

---

## 5. フレークテスト防止ルール

- 時刻依存のテストでは `travel_to` (RSpec) / `vi.setSystemTime` (Vitest) を使用する。
- 外部APIはすべてモック化し、ネットワーク依存をゼロにする。
- DBのseq scanによる順序不定をテストで前提にしない（ORDER BYを明示する）。
- `sleep` / `Timeout` を使ったテストは禁止。非同期は `waitFor` / `async/await` で処理する。