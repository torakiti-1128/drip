import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuthContext } from "./auth-context";

export function ProtectedRoute() {
  const location = useLocation();
  const authState = useAuthContext();

  if (authState.status !== "authenticated") {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
