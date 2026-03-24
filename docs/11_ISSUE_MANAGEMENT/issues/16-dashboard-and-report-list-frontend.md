---
id: 16
title: Dashboardと日報一覧のfrontendを実装する
slug: dashboard-and-report-list-frontend
github_issue: 9
github_url: https://github.com/torakiti-1128/drip/issues/9
status: ready
labels:
  - type: feature
  - priority: medium
  - scope: frontend
related_docs:
  - docs/01_REQUIREMENTS_DEFINITION/README.md
  - docs/03_API_DESIGN/README.md
  - docs/04_UI-UX_DESIGN/README.md
---

## 概要
Dashboard と report list を実装し、KPI と履歴導線を frontend に組み込む。

## 背景・目的
ユーザーが最初に見る画面と過去記録の導線が揃って初めて継続利用が成立する。

## Acceptance Criteria
- [ ] dashboard 主要コンポーネントを実装する
- [ ] report list を実装する
- [ ] ticket 3, 15 の API と連携する
- [ ] loading / error / empty state を実装する

## 実装メモ
- frontend では KPI の再計算をしない
