import type { PropsWithChildren } from "react";

import { AuthContext } from "./auth-context";
import { useAuthSession } from "../hooks/use-auth-session";

export function AuthGate({ children }: PropsWithChildren) {
  const authState = useAuthSession();

  if (authState.status === "loading") {
    return <div>Authenticating your session...</div>;
  }

  if (authState.status === "error") {
    return <div>Authentication failed: {authState.errorMessage}</div>;
  }

  return <AuthContext.Provider value={authState}>{children}</AuthContext.Provider>;
}
