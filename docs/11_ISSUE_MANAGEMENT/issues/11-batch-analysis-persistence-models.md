---
id: 11
title: Batch Analysis保存モデルを実装する
slug: batch-analysis-persistence-models
github_issue: 4
github_url: https://github.com/torakiti-1128/drip/issues/4
status: ready
labels:
  - type: feature
  - priority: high
  - scope: backend
related_docs:
  - docs/02_DATABASE_DESIGN/README.md
  - docs/03_API_DESIGN/README.md
  - docs/05_PROMPT_DESIGN/README.md
---

## 概要
解析結果を `batch_analyses`, `action_plans`, `quizzes` へ保存する service を実装する。

## 背景・目的
保存対象を誤ると batch detail, dashboard, quiz が全部崩れる。

## Acceptance Criteria
- [ ] summary / actionPlans / quizzes を保存できる
- [ ] tag 関連付けを保存できる
- [ ] `scorecards` の保存方針を設計して実装する
- [ ] service spec を追加する

## 実装メモ
- `scorecards` 保存方針は docs 反映込みで決める
