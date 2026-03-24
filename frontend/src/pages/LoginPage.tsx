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
    <main>
      <h1>Log In</h1>
      <p>メールリンクでログインします。認証後は元の画面へ戻ります。</p>
      <p>Return target: {redirectPath}</p>
      <form onSubmit={(event) => void handleSubmit(event)}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          required
        />
        <button type="submit" disabled={authState.isSubmitting}>
          {authState.isSubmitting ? "Sending..." : "Send magic link"}
        </button>
      </form>
      {authState.status === "unauthenticated" ? <p>Your session is not active.</p> : null}
      {submissionMessage ? <p>{submissionMessage}</p> : null}
      {authState.errorMessage ? <p>Authentication failed: {authState.errorMessage}</p> : null}
    </main>
  );
}
