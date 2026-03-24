import { useEffect, useState } from "react";

import { AuthUserSchema } from "../schemas/auth-session-schema";
import { supabaseClient } from "../services/supabase-client";
import type { AuthSessionState } from "../types/auth";

const initialState: AuthSessionState = {
  status: "loading",
  user: null,
  errorMessage: null,
  isSubmitting: false
};

export function useAuthSession() {
  const [state, setState] = useState<AuthSessionState>(initialState);

  useEffect(() => {
    let mounted = true;

    async function restoreSession() {
      const { data, error } = await supabaseClient.auth.getUser();

      if (!mounted) {
        return;
      }

      if (error) {
        setState({
          status: "error",
          user: null,
          errorMessage: error.message,
          isSubmitting: false
        });
        return;
      }

      if (!data.user?.email) {
        setState({
          status: "unauthenticated",
          user: null,
          errorMessage: null,
          isSubmitting: false
        });
        return;
      }

      const parsedUser = AuthUserSchema.safeParse({
        id: data.user.id,
        email: data.user.email
      });

      if (!parsedUser.success) {
        setState({
          status: "error",
          user: null,
          errorMessage: "Invalid auth session payload.",
          isSubmitting: false
        });
        return;
      }

      setState({
        status: "authenticated",
        user: parsedUser.data,
        errorMessage: null,
        isSubmitting: false
      });
    }

    restoreSession();

    const {
      data: { subscription }
    } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      if (!mounted) {
        return;
      }

      if (!session?.user?.email) {
        setState({
          status: "unauthenticated",
          user: null,
          errorMessage: null,
          isSubmitting: false
        });
        return;
      }

      setState({
        status: "authenticated",
        user: {
          id: session.user.id,
          email: session.user.email
        },
        errorMessage: null,
        isSubmitting: false
      });
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function signInWithOtp(email: string) {
    setState((currentState) => ({
      ...currentState,
      isSubmitting: true,
      errorMessage: null
    }));

    const { error } = await supabaseClient.auth.signInWithOtp({
      email
    });

    if (error) {
      setState({
        status: "error",
        user: null,
        errorMessage: error.message,
        isSubmitting: false
      });
      return false;
    }

    setState({
      status: "unauthenticated",
      user: null,
      errorMessage: null,
      isSubmitting: false
    });

    return true;
  }

  async function signOut() {
    setState((currentState) => ({
      ...currentState,
      isSubmitting: true,
      errorMessage: null
    }));

    const { error } = await supabaseClient.auth.signOut();

    if (error) {
      setState((currentState) => ({
        ...currentState,
        status: "error",
        errorMessage: error.message,
        isSubmitting: false
      }));
      return;
    }

    setState({
      status: "unauthenticated",
      user: null,
      errorMessage: null,
      isSubmitting: false
    });
  }

  return {
    ...state,
    signInWithOtp,
    signOut
  };
}
