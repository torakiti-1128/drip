---
id: 13
title: クイズ回答とアクション完了の更新APIを実装する
slug: learning-interaction-apis
github_issue: null
github_url: null
status: ready
labels:
  - type: feature
  - priority: high
  - scope: backend
related_docs:
  - docs/03_API_DESIGN/README.md
  - docs/09_TESTING_STRATEGY/README.md
---

## 概要
`PATCH /quizzes/:id/answer` と `PATCH /action_plans/:id/toggle` を実装する。

## 背景・目的
学習進捗を書き戻せないと dashboard と継続導線が成立しない。

## Acceptance Criteria
- [ ] quiz answer API を実装する
- [ ] action plan toggle API を実装する
- [ ] 不正な状態遷移を防ぐ
- [ ] request spec を追加する

## 実装メモ
- progress 計算との整合を崩さない
