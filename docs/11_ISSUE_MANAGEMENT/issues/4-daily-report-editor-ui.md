---
id: 4
title: 日報入力Editor UIを実装する
slug: daily-report-editor-ui
github_issue: 16
github_url: https://github.com/torakiti-1128/drip/issues/16
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
2ペイン editor、タスク行追加、所感入力、保存導線を持つ日報入力 UI を実装する。

## 背景・目的
入力体験が弱いと継続利用されない。Auto-save とモバイル対応が要件に含まれている。

## Acceptance Criteria
- [ ] PC 2ペイン / mobile タブ切替 UI を実装する
- [ ] `TaskRowItem`, `TimeCalculator`, `DraftManager` を実装する
- [ ] localStorage 下書きを実装する
- [ ] ticket 3 の API と連携する
- [ ] loading / error / saved state を実装する

## 実装メモ
- UI の即時計算と backend の正計算を混同しない
