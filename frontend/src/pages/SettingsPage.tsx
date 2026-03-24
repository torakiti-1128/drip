import { AppShell } from "../components/AppShell";
import { useAuthContext } from "../components/auth-context";

export function SettingsPage() {
  const authState = useAuthContext();

  return (
    <AppShell>
      <section className="shell-stack">
        <article className="shell-hero">
          <span className="eyebrow">Account Panel</span>
          <h1 className="shell-hero__title">Settings</h1>
          <p className="shell-hero__copy">
            現在のログインアカウント確認とログアウト導線を先に固定しています。
          </p>
        </article>
        <article className="shell-panel">
          <ul className="shell-list">
            <li className="shell-list__item">
              <div>
                <p className="shell-list__label">Current account</p>
                <p className="shell-list__meta">{authState.user?.email}</p>
              </div>
              <span className="status-pill">Authenticated</span>
            </li>
            <li className="shell-list__item">
              <div>
                <p className="shell-list__label">Session source</p>
                <p className="shell-list__meta">Supabase Auth session</p>
              </div>
              <button
                className="button-secondary"
                type="button"
                onClick={() => void authState.signOut()}
                disabled={authState.isSubmitting}
              >
                {authState.isSubmitting ? "Signing out..." : "Log out"}
              </button>
            </li>
          </ul>
        </article>
      </section>
    </AppShell>
  );
}
