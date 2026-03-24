import type { PropsWithChildren } from "react";
import { Link } from "react-router-dom";

import { AuthContext } from "./auth-context";
import { useAuthSession } from "../hooks/use-auth-session";

export function AuthGate({ children }: PropsWithChildren) {
  const authState = useAuthSession();

  if (authState.status === "loading") {
    return (
      <section className="status-layout">
        <div className="status-card">
          <span className="status-pill">Session Restorer</span>
          <h1 className="status-card__title">Checking your session.</h1>
          <p className="status-card__copy">
            Supabase Auth から現在のログイン状態を復元しています。成功したら dashboard へ戻します。
          </p>
        </div>
      </section>
    );
  }

  if (authState.status === "error") {
    return (
      <section className="status-layout">
        <div className="status-card">
          <span className="status-pill">Auth Error</span>
          <h1 className="status-card__title">Authentication setup needs attention.</h1>
          <p className="status-card__copy">{authState.errorMessage}</p>
          <div className="status-card__actions">
            <Link className="button-primary" to="/login">
              Open login
            </Link>
            <a className="button-secondary" href="https://supabase.com/dashboard" rel="noreferrer" target="_blank">
              Open Supabase
            </a>
          </div>
        </div>
      </section>
    );
  }

  return <AuthContext.Provider value={authState}>{children}</AuthContext.Provider>;
}
