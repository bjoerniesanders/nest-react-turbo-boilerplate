import { AuthService } from "@/services/Authservice";
import { createContext, useEffect, useState, useMemo, useCallback, type ReactNode, useContext } from "react";
import { Cookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

const cookies = new Cookies();

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const login = useCallback(async (email: string, password: string) => {
    try {
      await AuthService.login(email, password);
      setIsAuthenticated(true);
      navigate("/dashboard", { replace: true });
    } catch (error) {
      setIsAuthenticated(false);
      throw new Error(error instanceof Error ? error.message : "Login failed");
    }
  }, [navigate]);

  const logout = useCallback(async () => {
    try {
      await AuthService.logout();
      setIsAuthenticated(false);
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }, [navigate]);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const refreshToken = cookies.get("refresh_token");
        console.log("Initializing auth, refresh token present:", !!refreshToken);
        
        if (refreshToken) {
          await AuthService.refresh();
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Auth initialization failed:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const value = useMemo(
    () => ({ isAuthenticated, isLoading, login, logout }),
    [isAuthenticated, isLoading, login, logout]
  );

  if (isLoading) {
    return null; // oder einen Loading-Spinner
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
