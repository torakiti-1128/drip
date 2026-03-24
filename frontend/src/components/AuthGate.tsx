import type { PropsWithChildren } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, LifeBuoy, LoaderCircle } from "lucide-react";

import { AuthContext } from "./auth-context";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { useAuthSession } from "../hooks/use-auth-session";

export function AuthGate({ children }: PropsWithChildren) {
  const authState = useAuthSession();

  if (authState.status === "loading") {
    return (
      <section className="grid min-h-screen place-items-center px-4 py-8">
        <Card className="w-full max-w-xl rounded-[32px] bg-[var(--surface-strong)]/90">
          <CardHeader>
            <Badge className="w-fit" variant="outline">
              Session Restorer
            </Badge>
            <CardTitle className="flex items-center gap-3">
              <LoaderCircle className="h-7 w-7 animate-spin text-[var(--brand)]" />
              ログイン状態を確認しています
            </CardTitle>
            <CardDescription>
              Supabase のセッションを復元しています。完了すると前回開いていた保護画面へ戻ります。
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm text-[var(--muted-foreground)]">
            <p>数秒以内に復帰しない場合はネットワーク状態、または認証設定を確認してください。</p>
          </CardContent>
        </Card>
      </section>
    );
  }

  if (authState.status === "error") {
    return (
      <section className="grid min-h-screen place-items-center px-4 py-8">
        <Card className="w-full max-w-2xl rounded-[32px] bg-[var(--surface-strong)]/90">
          <CardHeader>
            <Badge className="w-fit" variant="warn">
              Auth Error
            </Badge>
            <CardTitle className="flex items-center gap-3">
              <AlertTriangle className="h-7 w-7 text-amber-600" />
              認証設定の確認が必要です
            </CardTitle>
            <CardDescription>{authState.errorMessage}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-5">
            <div className="rounded-3xl border border-[var(--line)] bg-white/80 p-5">
              <p className="mb-3 text-sm font-medium text-[var(--foreground)]">最低限必要な設定</p>
              <ul className="grid gap-2 text-sm text-[var(--muted-foreground)]">
                <li>`frontend/.env.local` に `VITE_SUPABASE_URL` を設定する</li>
                <li>`frontend/.env.local` に `VITE_SUPABASE_ANON_KEY` を設定する</li>
                <li>Supabase 側で Magic Link 認証を有効化する</li>
              </ul>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/login">
                <Button>ログイン画面へ戻る</Button>
              </Link>
              <a href="https://supabase.com/dashboard" rel="noreferrer" target="_blank">
                <Button variant="secondary">
                  <LifeBuoy className="h-4 w-4" />
                  Supabase を開く
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>
      </section>
    );
  }

  return <AuthContext.Provider value={authState}>{children}</AuthContext.Provider>;
}
