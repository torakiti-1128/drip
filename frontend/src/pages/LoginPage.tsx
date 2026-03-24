import { FormEvent, useMemo, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { ArrowRight, CheckCircle2, LockKeyhole, Sparkles } from "lucide-react";

import { useAuthContext } from "../components/auth-context";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";

interface LoginRouteState {
  from?: string;
}

export function LoginPage() {
  const location = useLocation();
  const authState = useAuthContext();
  const [email, setEmail] = useState("");
  const [submissionMessage, setSubmissionMessage] = useState<string | null>(null);
  const redirectPath = useMemo(() => {
    const routeState = location.state as LoginRouteState | null;

    return routeState?.from ?? "/";
  }, [location.state]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmissionMessage(null);

    const succeeded = await authState.signInWithOtp(email);

    if (!succeeded) {
      return;
    }

    setSubmissionMessage("ログインリンクを送信しました。メールを確認してください。");
  }

  if (authState.status === "authenticated") {
    return <Navigate to={redirectPath} replace />;
  }

  return (
    <div className="min-h-screen px-4 py-5 md:px-8 md:py-8">
      <div className="mx-auto grid min-h-[calc(100vh-2.5rem)] w-full max-w-7xl items-center gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <Card className="overflow-hidden rounded-[36px] border-none bg-transparent shadow-none">
          <CardContent className="relative flex h-full flex-col justify-between overflow-hidden rounded-[36px] border border-white/70 bg-[linear-gradient(135deg,rgba(43,95,138,0.95),rgba(73,116,156,0.92))] px-7 py-8 text-white md:px-10 md:py-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_32%)]" />
            <div className="relative grid gap-7">
              <Badge className="w-fit bg-white/16 text-white">DRIP Auth Gate</Badge>
              <div className="grid gap-4">
                <h1 className="text-4xl font-semibold leading-tight md:text-6xl">日報を、次の一手に変える。</h1>
                <p className="max-w-xl text-sm leading-7 text-white/84 md:text-base">
                  DRIP は書いた内容をそのまま流さず、改善アクションと学習定着へつなげます。ログイン後は前回の続きからそのまま戻ります。
                </p>
              </div>
              <div className="grid gap-3">
                {[
                  "リロード後も Supabase セッションから自動復元",
                  "未認証のまま Dashboard / 日報入力 / 設定へ入れない",
                  `認証後は ${redirectPath} に戻る`
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-4 backdrop-blur"
                  >
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
                    <p className="text-sm leading-6 text-white/84">{item}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative mt-8 flex items-center gap-3 rounded-3xl border border-white/12 bg-white/10 px-4 py-4 backdrop-blur">
              <Sparkles className="h-5 w-5 shrink-0" />
              <p className="text-sm leading-6 text-white/84">
                日本語 UI で余白を広めに取り、情報量を抑えた設計にしています。最初の 1 画面で迷わせないためです。
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[36px] bg-[var(--surface-strong)]/95">
          <CardHeader className="gap-4">
            <Badge className="w-fit" variant="outline">
              Magic Link
            </Badge>
            <CardTitle className="flex items-center gap-3">
              <LockKeyhole className="h-6 w-6 text-[var(--brand)]" />
              メールリンクでログイン
            </CardTitle>
            <CardDescription>
              メールアドレスを入力すると、Supabase Auth がサインイン用リンクを送信します。
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-5">
            <form className="grid gap-4" onSubmit={(event) => void handleSubmit(event)}>
              <div className="grid gap-2">
                <label className="text-sm font-medium text-[var(--foreground)]" htmlFor="email">
                  メールアドレス
                </label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>
              <Button className="w-full justify-center" size="lg" type="submit" disabled={authState.isSubmitting}>
                {authState.isSubmitting ? "リンクを送信しています..." : "ログインリンクを送信"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>

            <div className="grid gap-3 rounded-[28px] border border-[var(--line)] bg-white/80 p-5">
              <p className="text-sm font-medium text-[var(--foreground)]">この画面で担保していること</p>
              <ul className="grid gap-2 text-sm leading-6 text-[var(--muted-foreground)]">
                <li>起動時のセッション復元</li>
                <li>未認証時の保護ルート遮断</li>
                <li>ログアウト後の状態遷移</li>
              </ul>
            </div>

            {authState.status === "unauthenticated" ? (
              <div className="rounded-3xl border border-[var(--line)] bg-white/75 px-4 py-4 text-sm text-[var(--muted-foreground)]">
                現在は未ログインです。メールリンクでサインインしてください。
              </div>
            ) : null}
            {submissionMessage ? (
              <div className="rounded-3xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm text-emerald-700">
                {submissionMessage}
              </div>
            ) : null}
            {authState.errorMessage ? (
              <div className="rounded-3xl border border-rose-200 bg-rose-50 px-4 py-4 text-sm text-rose-700">
                認証エラー: {authState.errorMessage}
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
