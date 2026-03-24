---
id: 5
title: 日報一覧と外部保存リンク導線を実装する
slug: report-list-and-storage-link-ui
github_issue: 17
github_url: https://github.com/torakiti-1128/drip/issues/17
status: ready
labels:
  - type: feature
  - priority: medium
  - scope: frontend
related_docs:
  - docs/01_REQUIREMENTS_DEFINITION/README.md
  - docs/03_API_DESIGN/README.md
  - docs/04_UI-UX_DESIGN/README.md
---

## 概要
日報一覧画面を実装し、状態・稼働時間・保存先リンクを確認できるようにする。

## 背景・目的
入力継続には「過去の記録に戻れること」が必要。storage link も活用導線として明示する。

## Acceptance Criteria
- [ ] 日報一覧画面を実装する
- [ ] `targetDate`, `workingMinutes`, `status`, `storageUrl` を表示する
- [ ] 一覧から編集画面へ遷移できる
- [ ] empty / loading / error state を実装する

## 実装メモ
- モバイルでの視認性を優先する
