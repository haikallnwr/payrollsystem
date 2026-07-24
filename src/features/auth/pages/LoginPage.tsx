import { LoginForm } from "../components/LoginForm";
import { Navigate } from "react-router";
import { useAuth } from "@/providers/auth-provider";

export function LoginPage() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null; // Or a spinner if preferred
  }

  // If already logged in, redirect away from login page
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div>
      <LoginForm />
    </div>
  );
}
