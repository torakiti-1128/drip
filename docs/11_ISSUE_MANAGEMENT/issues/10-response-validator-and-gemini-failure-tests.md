---
id: 10
title: ResponseValidatorとGemini失敗耐性テストを整備する
slug: response-validator-and-gemini-failure-tests
github_issue: 3
github_url: https://github.com/torakiti-1128/drip/issues/3
status: ready
labels:
  - type: test
  - priority: high
  - scope: gemini
related_docs:
  - docs/05_PROMPT_DESIGN/README.md
  - docs/09_TESTING_STRATEGY/README.md
---

## 概要
新仕様の validator と耐障害テストを整備する。

## 背景・目的
Gemini 境界は最も壊れやすく、設計書でも重点テスト対象になっている。

## Acceptance Criteria
- [ ] 正常系を検証する
- [ ] `timeout`, `parse_error`, `schema_validation_error`, `empty_response` を網羅する
- [ ] `scorecards.score` 範囲と `driveLink` を検証する
- [ ] 本番 API を叩かない

## 実装メモ
- エラー型は呼び出し側で分岐可能にする
