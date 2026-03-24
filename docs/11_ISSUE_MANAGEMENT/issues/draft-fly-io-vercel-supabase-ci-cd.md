---
id: draft
title: Fly.io Vercel Supabase 前提の CI/CD を整備する
slug: fly-io-vercel-supabase-ci-cd
github_issue: null
github_url: null
status: ready
labels:
  - type: feature
  - priority: medium
  - scope: infra
related_docs:
  - docs/10_DEPLOYMENT_INFRA/README.md
  - docs/01_REQUIREMENTS_DEFINITION/README.md
  - docs/08_DEVELOPMENT_RULES/README.md
---

## 概要

develop と main の運用方針に合わせて、main 向け本番 deploy のみを持つ CI/CD と環境変数管理を整備する。

## 背景・目的

docs/10_DEPLOYMENT_INFRA/README.md と docs/01_REQUIREMENTS_DEFINITION/README.md を Fly.io / Vercel / Supabase 前提に揃えたため、実際の workflow と infrastructure 設定も同じ前提へ合わせる必要がある。

## Acceptance Criteria

- [ ] CI が backend/frontend/repo-health を分離して実行できる
- [ ] CD は main の CI success 後のみ本番 deploy する
- [ ] staging 前提の設定が残っていないことを確認する

## 実装メモ

- GitHub Issue とこのドキュメントを同時に更新する
