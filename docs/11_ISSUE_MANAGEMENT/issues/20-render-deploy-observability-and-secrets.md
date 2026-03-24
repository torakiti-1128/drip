---
id: 20
title: Render前提のデプロイ・監視・Secrets運用を整備する
slug: render-deploy-observability-and-secrets
github_issue: 14
github_url: https://github.com/torakiti-1128/drip/issues/14
status: ready
labels:
  - type: feature
  - priority: medium
  - scope: infra
related_docs:
  - docs/10_DEPLOYMENT_INFRA/README.md
  - docs/08_DEVELOPMENT_RULES/README.md
  - docs/01_REQUIREMENTS_DEFINITION/README.md
---

## 概要
Render 前提の backend deploy、Vercel frontend deploy、Secrets、監視、ローカル依存サービスの基盤を整備する。

## 背景・目的
インフラ前提が Fly から Render へ変わったため、docs・workflow・テンプレートを揃える必要がある。

## Acceptance Criteria
- [ ] Render deploy hook ベースの CD を整備する
- [ ] `.env.example` と Secret 方針を docs と一致させる
- [ ] Render / Vercel / Supabase の監視基準を定義する
- [ ] `render.yaml`, `docker-compose.yml`, deploy workflow を整備する

## 実装メモ
- migration と deploy を分離する
