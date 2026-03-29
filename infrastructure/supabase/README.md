# Supabase Notes

- 本番接続は `DATABASE_URL` で pgBouncer 経由に統一する
- Prisma / pgBouncer を使う場合は接続設定を Supabase の推奨値に合わせる
- 全ユーザーデータ系テーブルで RLS を有効化する
- サービスロールキーは GitHub Actions へ直置きせず、Render / Vercel の Secret 管理で扱う
