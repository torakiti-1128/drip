---
id: 9
title: Geminiプロンプトと出力契約を新仕様へ更新する
slug: gemini-prompt-output-contract
github_issue: 21
github_url: https://github.com/torakiti-1128/drip/issues/21
status: ready
labels:
  - type: tech-debt
  - priority: high
  - scope: gemini
related_docs:
  - docs/05_PROMPT_DESIGN/README.md
  - docs/07_AI_OUTPUT_DESIGN/README.md
  - docs/03_API_DESIGN/README.md
---

## 概要
Gemini prompt と期待 JSON を現行 docs 契約へ揃える。

## 背景・目的
旧フィールド名が残ると validator と保存処理が壊れる。

## Acceptance Criteria
- [ ] `camelCase` 出力へ統一する
- [ ] `scorecards` と `driveLink: null` を明記する
- [ ] prompt の変更履歴を残せる構成にする
- [ ] prompt テストを追加する

## 実装メモ
- `driveLink` は AI に生成させない
