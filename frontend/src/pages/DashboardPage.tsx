import { Link } from "react-router-dom";

import { AppShell } from "../components/AppShell";
import { useAuthContext } from "../components/auth-context";

export function DashboardPage() {
  const authState = useAuthContext();

  return (
    <AppShell>
      <section className="shell-hero">
        <span className="eyebrow">Dashboard</span>
        <h1 className="shell-hero__title">Welcome back, {authState.user?.email?.split("@")[0]}.</h1>
        <p className="shell-hero__copy">
          セッションは復元済みです。ここから日報入力、設定、次のインサイト消化へ進めます。
        </p>
        <div className="shell-hero__actions">
          <Link className="button-primary" to="/editor">
            Open editor
          </Link>
          <Link className="button-secondary" to="/settings">
            Review settings
          </Link>
        </div>
      </section>
      <section className="shell-grid">
        <article className="shell-grid__card">
          <span className="eyebrow">Auth State</span>
          <p className="shell-grid__value">Active</p>
          <p className="shell-grid__copy">保護ルートに入れる状態です。</p>
        </article>
        <article className="shell-grid__card">
          <span className="eyebrow">Return</span>
          <p className="shell-grid__value">Ready</p>
          <p className="shell-grid__copy">ログイン後の復帰導線は route state を使って維持します。</p>
        </article>
        <article className="shell-grid__card">
          <span className="eyebrow">Next Step</span>
          <p className="shell-grid__value">Editor</p>
          <p className="shell-grid__copy">次の issue では日報入力 UI をここから深掘りします。</p>
        </article>
      </section>
    </AppShell>
  );
}
