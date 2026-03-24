---
id: draft
title: Batch Analysis 詳細 API と学習操作 API を実装する
slug: batch-analysis-api-api
github_issue: null
github_url: null
status: ready
labels:
  - type: feature
  - priority: high
  - scope: backend
related_docs:
  - docs/03_API_DESIGN/README.md
  - docs/07_AI_OUTPUT_DESIGN/README.md
  - docs/09_TESTING_STRATEGY/README.md
---

## 概要

batch analysis 詳細取得、quiz 回答、action plan 完了切替の API を docs 契約どおりに実装する。

## 背景・目的

docs/03_API_DESIGN/README.md では progress, quizzes, actionPlans, driveLink を返す詳細 API と、学習系の更新 API が中核導線になっている。

## Acceptance Criteria

- [ ] GET /batch_analyses/:id が progress, scorecards, driveLink を含んで返る
- [ ] PATCH /quizzes/:id/answer が isCorrect と completedAt を更新する
- [ ] PATCH /action_plans/:id/toggle が状態遷移を反映する request spec が追加される

## 実装メモ

- GitHub Issue とこのドキュメントを同時に更新する
