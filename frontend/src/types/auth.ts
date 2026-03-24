export type AuthStatus = "loading" | "authenticated" | "unauthenticated" | "error";

export interface AuthUser {
  id: string;
  email: string;
}

export interface AuthSessionState {
  status: AuthStatus;
  user: AuthUser | null;
  errorMessage: string | null;
  isSubmitting: boolean;
}
