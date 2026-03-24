import { createContext, useContext } from "react";

import type { AuthSessionState } from "../types/auth";

export type AuthContextValue = AuthSessionState & {
  signInWithOtp: (email: string) => Promise<boolean>;
  signOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuthContext() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthContext must be used within AuthGate.");
  }

  return context;
}
