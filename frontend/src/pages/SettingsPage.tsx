import { useAuthContext } from "../components/auth-context";

export function SettingsPage() {
  const authState = useAuthContext();

  return (
    <main>
      <h1>Settings</h1>
      <p>Logged in as {authState.user?.email}</p>
      <button type="button" onClick={() => void authState.signOut()} disabled={authState.isSubmitting}>
        {authState.isSubmitting ? "Signing out..." : "Log out"}
      </button>
    </main>
  );
}
