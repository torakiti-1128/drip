---
id: 1
title: Supabase JWT検証とcurrentUser解決を実装する
slug: auth-jwt-verification-and-current-user
github_issue: null
github_url: null
status: ready
labels:
  - type: feature
  - priority: high
  - scope: backend
related_docs:
  - docs/00_PROJECT_OVERVIEW/README.md
  - docs/03_API_DESIGN/README.md
  - docs/10_DEPLOYMENT_INFRA/README.md
---

## 概要
Supabase JWT を Rails API で検証し、保護 API から `currentUser` を取得できる認証基盤を実装する。

## 背景・目的
認証は Overview にしか定義がなく、実装単位へ落ちていない。全 API の前提になるため最初に確定させる。

## Acceptance Criteria
- [ ] Bearer JWT の検証が共通化される
- [ ] `currentUser` を controller / service から利用できる
- [ ] 未認証時に `401 Unauthorized` を返す
- [ ] request spec で認証成功 / 失敗を検証する

## 実装メモ
- アプリ独自のログイン API は持たず、Supabase Auth を正とする
