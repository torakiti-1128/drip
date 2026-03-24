---
id: draft
title: Dashboard 集計と Drive Link 注入を実装する
slug: dashboard-drive-link
github_issue: null
github_url: null
status: ready
labels:
  - type: feature
  - priority: medium
  - scope: backend
related_docs:
  - docs/03_API_DESIGN/README.md
  - docs/07_AI_OUTPUT_DESIGN/README.md
  - docs/01_REQUIREMENTS_DEFINITION/README.md
---

## 概要

ダッシュボード集計 API と、AI 出力保存後の driveLink 注入フローを実装する。

## 背景・目的

docs/03_API_DESIGN/README.md と docs/07_AI_OUTPUT_DESIGN/README.md で、学習集計と外部保存リンクの返却が利用価値の中心になっている。AI は driveLink を生成しないため、保存処理側で注入する実装が必要。

## Acceptance Criteria

- [ ] GET /dashboard/stats が summaryPeriod, activity, learning, bottlenecks を camelCase で返す
- [ ] Markdown 保存後に driveLink が batch analysis 詳細へ反映される
- [ ] 集計ロジックと保存フローの spec が追加される

## 実装メモ

- GitHub Issue とこのドキュメントを同時に更新する
