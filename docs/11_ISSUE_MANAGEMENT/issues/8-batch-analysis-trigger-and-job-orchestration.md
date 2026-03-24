---
id: 8
title: Batch Analysis起動と非同期ジョブ制御を実装する
slug: batch-analysis-trigger-and-job-orchestration
github_issue: 20
github_url: https://github.com/torakiti-1128/drip/issues/20
status: ready
labels:
  - type: feature
  - priority: high
  - scope: backend
related_docs:
  - docs/01_REQUIREMENTS_DEFINITION/README.md
  - docs/03_API_DESIGN/README.md
  - docs/09_TESTING_STRATEGY/README.md
---

## 概要
`POST /batch_analyses` の受付 API と非同期ジョブ制御を実装する。

## 背景・目的
AI 解析は同期処理にできない。受付と実行を分離して安定させる必要がある。

## Acceptance Criteria
- [ ] 期間指定の受付 API を実装する
- [ ] ジョブ投入と冪等性方針を実装する
- [ ] 対象日報ゼロ件などの異常系を扱う
- [ ] request / job spec を追加する

## 実装メモ
- 実行基盤は Redis 前提で設計する
