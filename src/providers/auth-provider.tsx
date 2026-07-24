import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { AuthApi } from "@/features/auth/api/auth.api";
import type { User } from "@/features/auth/auth.type";
import type { LoginFormData } from "@/features/auth/auth.validation";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginFormData) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Attempt to restore session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await AuthApi.getMe();
        if (res.data) {
          setUser(res.data);
        }
      } catch (err) {
        // Not authenticated, user remains null
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (data: LoginFormData) => {
    try {
      // 1. Post login data, backend sets HttpOnly cookie
      await AuthApi.login(data);
      // 2. Fetch user profile now that cookie is set
      const userRes = await AuthApi.getMe();
      if (userRes.data) {
        setUser(userRes.data);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed");
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AuthApi.logout();
    } catch (error) {
      console.error("Logout error", error);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
