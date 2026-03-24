---
id: draft
title: Gemini 出力スキーマと ResponseValidator を更新する
slug: gemini-responsevalidator
github_issue: null
github_url: null
status: ready
labels:
  - type: tech-debt
  - priority: high
  - scope: gemini
related_docs:
  - docs/05_PROMPT_DESIGN/README.md
  - docs/07_AI_OUTPUT_DESIGN/README.md
  - docs/09_TESTING_STRATEGY/README.md
---

## 概要

overallSummary, actionPlans, quizzes, scorecards, driveLink を含む新しい JSON 契約に validator と prompt 実装を揃える。

## 背景・目的

docs/05_PROMPT_DESIGN/README.md に scorecards と driveLink を追加したため、Gemini 連携層も同じ契約を前提にしないと parse error と schema mismatch が起きる。

## Acceptance Criteria

- [ ] Gemini prompt builder が新しい JSON 契約を要求する
- [ ] ResponseValidator が scorecards と driveLink null を検証できる
- [ ] timeout, parse_error, schema_validation_error, empty_response を網羅した spec が更新される

## 実装メモ

- GitHub Issue とこのドキュメントを同時に更新する
