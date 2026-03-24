# 11_ISSUE_MANAGEMENT ー プロジェクトのタスク管理

## 1. 運用フロー
1.  **Issue起票**: 以下のテンプレートを使用して `docs/11_ISSUE_MANAGEMENT/XXX-issue-title.md` を作成。
2.  **AIへのアサイン**: Codexで `@arch` や `@driller` を呼び出し、「このIssueを読み取って実装を開始して」と指示。
3.  **完了定義**: 受け入れ条件（AC）をすべて満たし、テストがパスすること。
4.  **クローズ**: Issueファイルを `archived/` フォルダへ移動し、コミットする。

## 2. Issueラベル
| カテゴリ | ラベル | 意味 |
| :--- | :--- | :--- |
| **Type** | `type: feature` | 新機能 |
| | `type: bug` | バグ |
| | `type: tech-debt` | 技術的負債・リファクタリング |
| | `type: docs` | ドキュメント更新 |
| **Priority** | `priority: critical` | サービス停止級、最優先 |
| | `priority: high` | 今スプリント（直近1週間以内） |
| | `priority: medium` | 次スプリント候補 |
| | `priority: low` | バックログ（余裕があれば） |
| **Scope** | `scope: frontend` | FEのみ影響 |
| | `scope: backend` | BEのみ影響 |
| | `scope: gemini` | AI/LLM連携部分 |

## 3. Issueテンプレート
```markdown
---
id: XXX
title: (Issueタイトル)
labels: [type: xxx, priority: xxx, scope: xxx]
assignee: "@logic" (担当させるAIスキル)
---

## 概要
(1〜2文で何の問題・要求か)

## 背景・目的
(なぜ必要か。設計思想のどの部分を具現化するものか)

## 受け入れ条件 (Acceptance Criteria)
- [ ] ○○ができる
- [ ] ○○の場合に△△が表示される
- [ ] 関連するテスト（RSpec/Vitest）がパスする
- [ ] CLAUDE.md の規約を逸脱していない

## 関連設計書
- docs/xx_xxx/README.md