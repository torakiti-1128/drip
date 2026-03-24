---
id: draft
title: Batch Analysis 生成と保存モデルを実装する
slug: batch-analysis
github_issue: null
github_url: null
status: ready
labels:
  - type: feature
  - priority: high
  - scope: backend
related_docs:
  - docs/02_DATABASE_DESIGN/README.md
  - docs/03_API_DESIGN/README.md
  - docs/05_PROMPT_DESIGN/README.md
  - docs/09_TESTING_STRATEGY/README.md
---

## 概要

期間指定の batch analysis 実行から actionPlans, quizzes, scorecards の保存までを実装する。

## 背景・目的

docs を正とした結果、解析・定着系の中心は insights ではなく batch_analyses / action_plans / quizzes になった。Gemini 結果をこのモデルへ正しく永続化する必要がある。

## Acceptance Criteria

- [ ] POST /batch_analyses が startDate/endDate を受けて非同期受付できる
- [ ] Gemini 出力が actionPlans, quizzes, scorecards に変換されて保存される
- [ ] 正常系と失敗系の service spec が追加される

## 実装メモ

- GitHub Issue とこのドキュメントを同時に更新する
