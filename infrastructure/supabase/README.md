# Supabase Notes

- 本番接続は `DATABASE_URL` で pgBouncer 経由に統一する
- Rails の `prepared_statements` は `false` を前提にする
- 全ユーザーデータ系テーブルで RLS を有効化する
- サービスロールキーは GitHub Actions へ直置きせず、Render / Vercel の Secret 管理で扱う
