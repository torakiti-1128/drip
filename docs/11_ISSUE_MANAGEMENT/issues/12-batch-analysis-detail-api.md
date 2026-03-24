---
id: 12
title: Batch Analysis詳細取得APIを実装する
slug: batch-analysis-detail-api
github_issue: 5
github_url: https://github.com/torakiti-1128/drip/issues/5
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
解析結果詳細 API を実装し、summary, progress, quizzes, actionPlans, scorecards, driveLink を返す。

## 背景・目的
このレスポンスが DRIP の消費体験の中心になる。

## Acceptance Criteria
- [ ] 詳細 API を実装する
- [ ] `progress` を計算済みで返す
- [ ] 全レスポンスを `camelCase` に統一する
- [ ] request / serializer spec を追加する

## 実装メモ
- preload 前提で N+1 を避ける
