---
id: 3
title: 日報APIと保存serviceを実装する
slug: daily-report-api-and-save-service
github_issue: 15
github_url: https://github.com/torakiti-1128/drip/issues/15
status: ready
labels:
  - type: feature
  - priority: high
  - scope: backend
related_docs:
  - docs/02_DATABASE_DESIGN/README.md
  - docs/03_API_DESIGN/README.md
  - docs/09_TESTING_STRATEGY/README.md
---

## 概要
`POST /daily_reports` と `GET /daily_reports`、保存 service、serializer を実装する。

## 背景・目的
日報保存は全機能の起点であり、API 契約と計算ロジックを同時に固める必要がある。

## Acceptance Criteria
- [ ] `camelCase` 契約の save/list API を実装する
- [ ] `workingMinutes` と `contentLength` を保存時に計算する
- [ ] serializer 経由でレスポンスを返す
- [ ] request / service spec を追加する

## 実装メモ
- reflections / memos の jsonb 扱いを先に固める
