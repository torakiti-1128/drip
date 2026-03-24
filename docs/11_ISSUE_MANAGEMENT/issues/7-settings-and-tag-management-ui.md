---
id: 7
title: 設定画面とタグ管理UIを実装する
slug: settings-and-tag-management-ui
github_issue: 19
github_url: https://github.com/torakiti-1128/drip/issues/19
status: ready
labels:
  - type: feature
  - priority: medium
  - scope: frontend
related_docs:
  - docs/01_REQUIREMENTS_DEFINITION/README.md
  - docs/04_UI-UX_DESIGN/README.md
  - docs/03_API_DESIGN/README.md
---

## 概要
プロンプト設定、Webhook 設定、タグ確認、アカウントパネルを持つ settings UI を実装する。

## 背景・目的
個人運用でも設定導線がないと prompt 改善や通知調整が回らない。

## Acceptance Criteria
- [ ] `PromptTemplateEditor`, `WebhookSettingsForm`, `TagManager`, `AccountPanel` を実装する
- [ ] ticket 6 の API と連携する
- [ ] 設定保存の成功 / 失敗状態を UI に出す
- [ ] ログアウト導線を settings から利用できる

## 実装メモ
- admin UI でも 3 ステートを守る
