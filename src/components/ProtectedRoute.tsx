import React, { type ReactElement } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface ProtectedRouteProps {
  children: ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { token } = useAuth();

  if (!token) return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoute;
