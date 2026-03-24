---
id: 15
title: Dashboard集計APIを実装する
slug: dashboard-stats-api
github_issue: null
github_url: null
status: ready
labels:
  - type: feature
  - priority: medium
  - scope: backend
related_docs:
  - docs/01_REQUIREMENTS_DEFINITION/README.md
  - docs/03_API_DESIGN/README.md
---

## 概要
`GET /dashboard/stats` を実装し、activity / learning / bottlenecks を集計して返す。

## 背景・目的
KPI 可視化は継続利用の中核であり、frontend 再計算ではなく backend 集計が前提になっている。

## Acceptance Criteria
- [ ] dashboard stats API を実装する
- [ ] `summaryPeriod`, `activity`, `learning`, `bottlenecks` を返す
- [ ] tag 別集計と weakTags を返す
- [ ] query / service spec を追加する

## 実装メモ
- クエリコストを測る
