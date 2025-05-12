import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";

interface PrivateRouteProps {
  children: ReactNode;
}

export function PrivateRoute({ children }: Readonly<PrivateRouteProps>) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
} 