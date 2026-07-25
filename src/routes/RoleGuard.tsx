import { useAuth } from "@/providers/auth-provider";
import type { RoleUser } from "@/features/profile";
import { Navigate } from "react-router";
import { toast } from "sonner";
import { useEffect } from "react";

interface RoleGuardProps {
  allowedRoles: RoleUser[];
  children: React.ReactNode;
}

export function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const { user, isLoading } = useAuth();

  const isAllowed = user && allowedRoles.includes(user.role as RoleUser);

  useEffect(() => {
    if (!isLoading && user && !isAllowed) {
      toast.error("Access Denied: Insufficient privileges for this page.");
    }
  }, [isLoading, user, isAllowed]);

  if (isLoading) {
    return (
      <div className="p-12 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent" />
        <p className="mt-2 text-sm text-slate-500">Checking page authorization...</p>
      </div>
    );
  }

  if (!user || !isAllowed) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
