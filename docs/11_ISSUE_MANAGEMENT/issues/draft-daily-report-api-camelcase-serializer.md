---
id: draft
title: Daily Report API と camelCase serializer を実装する
slug: daily-report-api-camelcase-serializer
github_issue: null
github_url: null
status: ready
labels:
  - type: feature
  - priority: high
  - scope: backend
related_docs:
  - docs/03_API_DESIGN/README.md
  - docs/08_DEVELOPMENT_RULES/README.md
  - docs/09_TESTING_STRATEGY/README.md
---

## 概要

日報保存・一覧 API を camelCase 契約で実装し、workingMinutes と contentLength の計算済みレスポンスを返す。

## 背景・目的

docs/03_API_DESIGN/README.md と AGENTS.md の serializer 方針に合わせて、snake_case を API に露出させない実装が必要。

## Acceptance Criteria

- [ ] POST /daily_reports と GET /daily_reports が camelCase 契約で動作する
- [ ] Serializer 経由で storageUrl, workingMinutes, contentLength を返す
- [ ] request spec と serializer spec が追加される

## 実装メモ

- GitHub Issue とこのドキュメントを同時に更新する
