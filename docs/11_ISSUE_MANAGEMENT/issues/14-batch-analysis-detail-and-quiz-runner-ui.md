---
id: 14
title: 解析結果画面とQuiz Runner UIを実装する
slug: batch-analysis-detail-and-quiz-runner-ui
github_issue: null
github_url: null
status: ready
labels:
  - type: feature
  - priority: high
  - scope: frontend
related_docs:
  - docs/03_API_DESIGN/README.md
  - docs/04_UI-UX_DESIGN/README.md
  - docs/07_AI_OUTPUT_DESIGN/README.md
---

## 概要
解析結果画面と Quiz Runner を実装し、改善アクション消化とクイズ受講を完結させる。

## 背景・目的
学びの消化体験が DRIP の価値本体であり、mobile first の UI が必要。

## Acceptance Criteria
- [ ] `SummaryHeader`, `ActionPlanList`, `QuizLauncher` を実装する
- [ ] Quiz Runner の 4 state を実装する
- [ ] ticket 12, 13 の API と連携する
- [ ] loading / error / empty / completed state を実装する

## 実装メモ
- 片手操作を優先する
