import type { PropsWithChildren } from "react";
import { Link, NavLink } from "react-router-dom";

import { useAuthContext } from "./auth-context";

const navigationItems = [
  { to: "/", label: "Dashboard" },
  { to: "/editor", label: "Editor" },
  { to: "/settings", label: "Settings" }
];

export function AppShell({ children }: PropsWithChildren) {
  const authState = useAuthContext();

  return (
    <div className="app-shell">
      <header className="app-shell__header">
        <Link className="app-shell__brand" to="/">
          <span className="app-shell__brand-mark">DRIP</span>
          <span className="app-shell__brand-copy">Daily Report Insights Pipeline</span>
        </Link>
        <nav className="app-shell__nav" aria-label="Global">
          {navigationItems.map((item) => (
            <NavLink
              key={item.to}
              className={({ isActive }) =>
                isActive ? "app-shell__nav-link app-shell__nav-link--active" : "app-shell__nav-link"
              }
              to={item.to}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="app-shell__account">
          <p className="app-shell__account-label">Signed in as</p>
          <p className="app-shell__account-email">{authState.user?.email}</p>
        </div>
      </header>
      <main className="app-shell__content">{children}</main>
    </div>
  );
}
