---
id: 17
title: Markdown出力とDrive Link反映フローを実装する
slug: markdown-export-and-drive-link-flow
github_issue: null
github_url: null
status: ready
labels:
  - type: feature
  - priority: medium
  - scope: backend
related_docs:
  - docs/01_REQUIREMENTS_DEFINITION/README.md
  - docs/06_DAILY_REPORT_DESIGN/README.md
  - docs/07_AI_OUTPUT_DESIGN/README.md
---

## 概要
日報と AI 出力を Markdown 化し、外部保存後に `driveLink` / `storageUrl` を反映するフローを実装する。

## 背景・目的
外部ナレッジベースへの還流と再閲覧導線が要件に含まれている。

## Acceptance Criteria
- [ ] 日報 Markdown 生成を実装する
- [ ] batch analysis Markdown 生成を実装する
- [ ] 保存後 URL を `storageUrl` / `driveLink` へ反映する
- [ ] 失敗時のリトライ方針を定義する

## 実装メモ
- AI は URL を生成しない
