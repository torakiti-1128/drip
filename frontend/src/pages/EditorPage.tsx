import { AppShell } from "../components/AppShell";

export function EditorPage() {
  return (
    <AppShell>
      <section className="shell-stack">
        <article className="shell-hero">
          <span className="eyebrow">Protected Route</span>
          <h1 className="shell-hero__title">Daily Report Editor</h1>
          <p className="shell-hero__copy">
            この画面は未認証ユーザーから保護されています。issue #13 では認証通過後の遷移先として最低限の器を用意します。
          </p>
        </article>
        <article className="shell-panel">
          <ul className="shell-list">
            <li className="shell-list__item">
              <div>
                <p className="shell-list__label">Draft restore</p>
                <p className="shell-list__meta">Issue #4 で localStorage と入力 UI を実装</p>
              </div>
              <span className="status-pill">Planned</span>
            </li>
            <li className="shell-list__item">
              <div>
                <p className="shell-list__label">Time calculator</p>
                <p className="shell-list__meta">Issue #4 でリアルタイム計算を追加</p>
              </div>
              <span className="status-pill">Planned</span>
            </li>
          </ul>
        </article>
      </section>
    </AppShell>
  );
}
