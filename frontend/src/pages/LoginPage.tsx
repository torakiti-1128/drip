import { FormEvent, useMemo, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

import { useAuthContext } from "../components/auth-context";

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
    <div className="page-frame auth-layout">
      <section className="auth-card">
        <div className="auth-card__hero">
          <span className="eyebrow">Auth Gate</span>
          <h1 className="auth-card__title">Reflect today. Adjust tomorrow.</h1>
          <p className="auth-card__copy">
            DRIP は日報の記録から次の改善アクションまでを一本でつなぎます。まずはメールリンクでログインし、
            前回の続きから再開します。
          </p>
          <ul className="meta-list">
            <li>
              <strong>Session restore</strong>
              リロード後も Supabase セッションから自動復帰します。
            </li>
            <li>
              <strong>Protected routes</strong>
              Dashboard / Editor / Settings は未認証のままでは開けません。
            </li>
            <li>
              <strong>Return target</strong>
              認証が完了したら <code>{redirectPath}</code> に戻します。
            </li>
          </ul>
        </div>
        <div className="auth-card__panel">
          <span className="eyebrow">Magic Link</span>
          <h2>Sign in with your email</h2>
          <p className="auth-form__hint">Supabase Auth がログインリンクを送信します。</p>
          <form className="auth-form" onSubmit={(event) => void handleSubmit(event)}>
            <div className="auth-form__field">
              <label className="auth-form__label" htmlFor="email">
                Work email
              </label>
              <input
                className="auth-form__input"
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
            <button className="button-primary" type="submit" disabled={authState.isSubmitting}>
              {authState.isSubmitting ? "Sending link..." : "Send magic link"}
            </button>
          </form>
          {authState.status === "unauthenticated" ? (
            <p className="auth-feedback">No active session. Sign in to continue.</p>
          ) : null}
          {submissionMessage ? <p className="auth-feedback auth-feedback--success">{submissionMessage}</p> : null}
          {authState.errorMessage ? (
            <p className="auth-feedback auth-feedback--error">Authentication failed: {authState.errorMessage}</p>
          ) : null}
        </div>
      </section>
    </div>
  );
}
