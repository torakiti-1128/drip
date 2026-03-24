---
id: 18
title: 通知スケジューラとリマインド機能を実装する
slug: notification-scheduler-and-reminders
github_issue: null
github_url: null
status: ready
labels:
  - type: feature
  - priority: medium
  - scope: backend
related_docs:
  - docs/01_REQUIREMENTS_DEFINITION/README.md
  - docs/04_UI-UX_DESIGN/README.md
  - docs/10_DEPLOYMENT_INFRA/README.md
---

## 概要
朝のクイズ通知、夜の日報リマインド、未読解析結果の通知を送るスケジューラを実装する。

## 背景・目的
継続率はリマインド設計で決まる。通知は後回しに見えて、実運用では必須。

## Acceptance Criteria
- [ ] クイズ通知ジョブを実装する
- [ ] 日報未作成リマインドを実装する
- [ ] 未読解析結果通知を実装する
- [ ] Webhook 送信失敗時の再試行方針を持つ

## 実装メモ
- 設定画面と連動させる
