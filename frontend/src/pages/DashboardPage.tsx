import { Link } from "react-router-dom";

import { useAuthContext } from "../components/auth-context";

export function DashboardPage() {
  const authState = useAuthContext();

  return (
    <main>
      <h1>Dashboard</h1>
      <p>Signed in as {authState.user?.email}</p>
      <nav>
        <Link to="/editor">Editor</Link> | <Link to="/settings">Settings</Link>
      </nav>
    </main>
  );
}
