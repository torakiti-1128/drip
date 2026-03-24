---
id: 6
title: タグと設定の管理APIを実装する
slug: tags-and-settings-api
github_issue: 18
github_url: https://github.com/torakiti-1128/drip/issues/18
status: ready
labels:
  - type: feature
  - priority: medium
  - scope: backend
related_docs:
  - docs/02_DATABASE_DESIGN/README.md
  - docs/03_API_DESIGN/README.md
---

## 概要
`GET /tags`, `GET /settings`, `PATCH /settings` を実装する。

## 背景・目的
タグ・通知・プロンプト設定が API に落ちていないと管理画面を作れない。

## Acceptance Criteria
- [ ] tags 一覧 API を実装する
- [ ] settings 取得 / 更新 API を実装する
- [ ] `camelCase` レスポンスに統一する
- [ ] request spec を追加する

## 実装メモ
- settings は 1 user 1 record を前提にする
