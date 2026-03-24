# 08_DEVELOPMENT_RULES — 開発ルール・Git運用・レビュー基準

> **対象者**: DRIP開発に関わるすべての人間・AIエージェント。
> AGENTS.md §4〜§5 の詳細版。矛盾が生じた場合はこのドキュメントが優先される。

---

## 1. ブランチ戦略（Git Flow 簡略版）

```
origin/main
  └── origin/develop          ← 統合ブランチ（常にグリーンを維持）
        ├── feature/xxx        ← 新機能
        ├── fix/xxx            ← バグ修正
        ├── refactor/xxx       ← リファクタリング（機能変更なし）
        ├── chore/xxx          ← 依存更新・設定変更
        └── docs/xxx           ← ドキュメントのみ
```

### ブランチ命名規則

```
feature/<issue番号>-<短い説明>     例: feature/42-quiz-retry-logic
fix/<issue番号>-<短い説明>         例: fix/57-gemini-timeout-crash
refactor/<対象>-<目的>             例: refactor/insight-service-extract-validator
chore/<対象>                       例: chore/update-tanstack-query-v5
docs/<対象>                        例: docs/api-design-v1-endpoints
```

### マージルール

| from | to | 方法 | 条件 |
|------|----|------|------|
| `feature/*` | `develop` | Squash & Merge | CIグリーン + レビュー |
| `fix/*` | `develop` | Squash & Merge | CIグリーン |
| `develop` | `main` | Merge Commit | CIグリーン + 動作確認済み |

- `main` への直接 push は **絶対禁止**（Branch Protection Rule で強制）。
- `develop` への直接 push も **禁止**（緊急hotfixを除く）。

---

## 2. コミットメッセージ規約（Conventional Commits）

### フォーマット

```
<type>(<scope>): <subject>
<空行>
<body>（任意: なぜそうしたかの理由）
<空行>
<footer>（任意: Breaking Change / Closes #xxx）
```

### type一覧

| type | 用途 |
|------|------|
| `feat` | 新機能の追加 |
| `fix` | バグ修正 |
| `docs` | ドキュメントのみの変更 |
| `refactor` | バグ修正・機能追加を含まないコード変更 |
| `test` | テストの追加・修正 |
| `perf` | パフォーマンス改善 |
| `chore` | ビルドプロセス・補助ツールの変更 |
| `ci` | CI/CD設定の変更 |
| `revert` | 過去コミットの取り消し |

### scope一覧（DRIPプロジェクト固有）

`frontend` / `backend` / `db` / `gemini` / `deploy` / `docs` / `auth`

### 良い例・悪い例

```bash
# ✅ Good
feat(gemini): add exponential backoff for API timeout retry
fix(frontend): resolve quiz answer state lost on back navigation
test(backend): add schema validation edge cases for empty Gemini response
refactor(backend): extract prompt building logic to PromptTemplateService
docs(api): add request/response examples for POST /api/v1/reports

# ❌ Bad — 却下される
git commit -m "fix"
git commit -m "update stuff"
git commit -m "WIP"
git commit -m "いろいろ修正"
git commit -m "feat: add stuff and fix bug and update docs"  # 複数の変更を1コミットに混ぜる
```

### コミットの粒度原則

- **1コミット = 1つの論理的変更**。
- テストと実装は同一コミットに含める（TDDのRed→Green→Refactorサイクルを1コミットにする）。
- コミット後に `git log --oneline` で読んで意味が通るか確認せよ。

---

## 3. プルリクエスト（PR）ルール

### PRの前提条件

```
□ ブランチ名がルールに沿っているか
□ CIが全てグリーンか（rspec / vitest / rubocop / eslint / tsc）
□ コンフリクトが解消されているか（developへのrebaseが完了しているか）
□ .envや秘密情報がコミットに含まれていないか（git-secretsで確認）
```

### PRのタイトル

コミットメッセージと同じ`type(scope): subject`フォーマットを使用する。

### PRの説明（テンプレートに従う）

`.github/pull_request_template.md` を必ず使用する。記載項目:

1. **変更の目的** （なぜこの変更が必要か）
2. **変更内容のサマリー** （何を変えたか、箇条書き）
3. **AIセルフレビュー結果** （Codex/Claudeによる差分評価コメント）
4. **テスト方法** （どのようにテストしたか、手動確認が必要な場合はスクショ）
5. **関連Issue** （`Closes #xxx`）
6. **関連設計書** （どの`docs/`を参照・更新したか）

### レビュー基準

| 観点 | チェック内容 |
|------|------------|
| 設計整合性 | AGENTS.md の制約に違反していないか |
| セキュリティ | 秘密情報のハードコード・SQLインジェクション・認証バイパスリスク |
| パフォーマンス | N+1クエリ・不要な再レンダリング・大量データへの無制限クエリ |
| テスト充足 | 境界値・異常系・Gemini失敗ケースがカバーされているか |
| 型安全性 | `any`の使用・型アサーション（`as`）の過用 |
| 命名 | 規約に従っているか・意図が名前から読み取れるか |

---

## 4. コードレビュー文化

### AIセルフレビューの手順（Codex向け）

実装完了後、コミット前に以下を自問せよ:

```
1. 「この変更の目的は何か？」 → PRタイトルに書けるか
2. 「テストが仕様を文書化しているか？」 → describeを読めば何をするコードか分かるか
3. 「Gemini障害時に何が起きるか？」 → フォールバックが実装されているか
4. 「型が嘘をついていないか？」 → 実際のデータと型定義が一致しているか
5. 「5年後の自分がこのコードを読んで理解できるか？」 → コメント・命名が十分か
```

### レビューコメントの分類

```
[BLOCKER] 必ず修正してからマージ。セキュリティ・バグ・設計違反。
[MAJOR]   強く修正を推奨。パフォーマンス・保守性・テスト不足。
[MINOR]   修正を推奨するが任意。スタイル・命名・コメント。
[NIT]     細かい好み。スルー可。
[QUESTION] 理解のための質問。修正不要の場合あり。
```

---

## 5. 禁止事項一覧（即却下）

```
□ APIキー・パスワードのハードコード（.envに移動せよ）
□ TypeScriptの `any` 型（unknownと型ガードで代替せよ）
□ Service Objectを使わないビジネスロジック（Controllerに書かない）
□ テストのないService Object（95%カバレッジが必須）
□ Gemini APIを直接叩くControllerコード（GeminiClientを経由せよ）
□ スキーマ検証なしのAIレスポンスのDB保存
□ mainブランチへの直接push
□ 意味不明なコミットメッセージ（"fix", "update", "WIP"）
□ NULLを許容する新規カラムの無断追加（設計書記載と理由コメント必須）
□ 外部キー制約のないマイグレーション
```

---

## 6. Issue管理

### Issueラベル
詳細: [`./docs/11_ISSUE_MANAGEMENT/README.md`](./11_ISSUE_MANAGEMENT/README.md)

| ラベル | 意味 |
|-------|------|
| `type: feature` | 新機能 |
| `type: bug` | バグ |
| `type: tech-debt` | 技術的負債 |
| `type: docs` | ドキュメント |
| `priority: critical` | 即対応 |
| `priority: high` | 今スプリント |
| `priority: medium` | 次スプリント候補 |
| `priority: low` | バックログ |
| `scope: frontend` | FEのみ影響 |
| `scope: backend` | BEのみ影響 |
| `scope: gemini` | AI連携部分 |

### Issueテンプレート

```markdown
## 概要
（1〜2文で何の問題・要求か）

## 背景・目的
（なぜ必要か。AGENTS.mdのどの設計思想に紐付くか）

## 受け入れ条件（Acceptance Criteria）
- [ ] ○○ができる
- [ ] ○○の場合に△△が表示される
- [ ] テストカバレッジが基準を満たす

## 関連設計書
- docs/xx_xxx/README.md
```