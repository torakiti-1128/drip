## 変更の目的

<!-- なぜこの変更が必要か。解決するIssue・ユーザーストーリーを記載 -->

Closes #

---

## 変更内容

<!-- 何を変えたか。箇条書きで簡潔に -->

- 
- 

---

## AIセルフレビュー結果

<!-- Codex / Claude Code による差分評価を貼り付けること。実施していない場合はマージ不可 -->

```
セルフレビュー実施日時: 
評価サマリー:
指摘事項と対処:
```

---

## テスト方法

<!-- どのようにテストしたか。新規テストケースがあれば記載 -->

- [ ] `bundle exec rspec` グリーン
- [ ] `npm run test:run` グリーン
- [ ] `bundle exec rubocop` グリーン
- [ ] `npm run lint && npm run type-check` グリーン
- [ ] 手動確認: （確認内容を記載）

---

## チェックリスト

- [ ] コミットメッセージがConventional Commits形式に従っている
- [ ] `any`型・ハードコードされた秘密情報が含まれていない
- [ ] Gemini連携がある場合、5つの耐性テストケースが実装されている
- [ ] 関連する`docs/`の設計書を参照・必要に応じて更新した
- [ ] DBスキーマ変更がある場合、外部キー制約と`NOT NULL`が設定されている

---

## 関連設計書

<!-- 参照・更新した docs/ を記載 -->

- `docs/xx_xxx/README.md`

---

## 関連 Issue 運用

<!-- GitHub Issue と docs/11_ISSUE_MANAGEMENT/issues/ の両方を記載 -->

- GitHub Issue: `Closes #xxx`
- Issue Doc: `docs/11_ISSUE_MANAGEMENT/issues/xxx-sample.md`

---

## スクリーンショット（UIの変更がある場合）

<!-- Before / After を貼り付ける -->
