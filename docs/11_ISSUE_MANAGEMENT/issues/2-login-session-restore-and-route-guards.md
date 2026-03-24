---
id: 2
title: ログイン画面とセッション復元・保護ルートを実装する
slug: login-session-restore-and-route-guards
github_issue: null
github_url: null
status: ready
labels:
  - type: feature
  - priority: high
  - scope: frontend
related_docs:
  - docs/01_REQUIREMENTS_DEFINITION/README.md
  - docs/03_API_DESIGN/README.md
  - docs/04_UI-UX_DESIGN/README.md
---

## 概要
Supabase Auth を使ったログイン UI、起動時のセッション復元、保護ルート制御を実装する。

## 背景・目的
未認証ユーザーの導線がないと frontend 実装全体が成立しない。認証切れの復帰導線も先に必要。

## Acceptance Criteria
- [ ] ログイン画面を実装する
- [ ] アプリ起動時にセッション復元を行う
- [ ] 未認証時は dashboard / editor / settings へ入れない
- [ ] ログアウト導線を実装する
- [ ] loading / auth error state を実装する

## 実装メモ
- 認証情報は Supabase client を正とする
