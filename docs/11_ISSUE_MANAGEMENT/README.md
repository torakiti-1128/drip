# 11_ISSUE_MANAGEMENT — GitHub Issues と設計履歴の運用

## 1. 目的

DRIP では、実行管理は GitHub Issues、設計判断と作業コンテキストの保存は `docs/11_ISSUE_MANAGEMENT/issues/` で行う。どちらか片方だけを更新する運用は禁止する。

## 2. 単一責任

- GitHub Issue: ステータス、担当、優先度、レビュー導線の単一管理面
- `docs/11_ISSUE_MANAGEMENT/issues/*.md`: 受け入れ条件、関連設計書、補足判断、実装メモの保管
- `docs/11_ISSUE_MANAGEMENT/archive/*.md`: クローズ済み Issue の履歴

## 3. 命名規則

- GitHub Issue 番号を正とする
- Issue ドキュメント名は `<issue-number>-<slug>.md`
- GitHub 起票前の下書きは `draft-<slug>.md`

例:

```text
docs/11_ISSUE_MANAGEMENT/issues/42-quiz-retry-logic.md
docs/11_ISSUE_MANAGEMENT/archive/42-quiz-retry-logic.md
```

## 4. 運用フロー

1. 要件を確認し、関連する `docs/` を特定する
2. `scripts/create_issue.sh` で Issue ドキュメントを作る
3. `--github` を付ける場合は GitHub Issue を同時作成し、作成された番号でドキュメントを確定させる
4. 実装ブランチは `feature/<issue番号>-<slug>` などの規約に従う
5. PR には `Closes #<issue番号>` を必ず入れる
6. 完了後は `scripts/archive_issue.sh <issue-doc>` で archive へ移す

## 5. 推奨ラベル

### Type

- `type: feature`
- `type: bug`
- `type: tech-debt`
- `type: docs`

### Priority

- `priority: critical`
- `priority: high`
- `priority: medium`
- `priority: low`

### Scope

- `scope: frontend`
- `scope: backend`
- `scope: gemini`
- `scope: infra`
- `scope: docs`

### Status

- `status: ready`
- `status: in-progress`
- `status: blocked`
- `status: review`

## 6. Issue ドキュメントテンプレート

標準テンプレートは [github-issue.md](/home/umeda/projects/drip/docs/11_ISSUE_MANAGEMENT/templates/github-issue.md) を使う。

```markdown
---
id: draft
title: 日報保存 API を追加する
slug: daily-report-create-api
github_issue: null
github_url: null
status: draft
labels:
  - type: feature
  - priority: high
  - scope: backend
related_docs:
  - docs/03_API_DESIGN/README.md
  - docs/09_TESTING_STRATEGY/README.md
---

## 概要
1〜2文で課題を説明する。

## 背景・目的
なぜ必要かを記載する。

## Acceptance Criteria
- [ ] API が追加される
- [ ] RSpec が追加される

## 実装メモ
- 判断理由や関連リンクを記録する。
```

## 7. スクリプト

- `scripts/create_issue.sh`
  - ローカル Issue ドキュメントを作成
  - `--github` 指定時は `gh issue create` を実行
- `scripts/archive_issue.sh`
  - 進行中 Issue ドキュメントを `archive/` に移動

## 8. 禁止事項

- GitHub Issue だけ作ってドキュメントを残さないこと
- `docs/11_ISSUE_MANAGEMENT/issues/` に番号なしの正式 Issue を置くこと
- 受け入れ条件なしで実装を始めること
- 完了後に archive へ移動せず放置すること
