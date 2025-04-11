"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";

interface User {
  user_id: string;
  email: string;
  display_name: string;
  profile_picture_url?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => void;
  setAuthToken: (token: string) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  logout: () => {},
  setAuthToken: () => {},
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const setAuthToken = (token: string) => {
    localStorage.setItem("authToken", token);
    loadUserFromToken();
  };

  const loadUserFromToken = async () => {
    if (!mounted) return;

    const token = localStorage.getItem("authToken");

    if (!token) {
      setIsLoading(false);
      setUser(null);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/auth/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Invalid token");
      }

      const userData = await response.json();
      setUser(userData);
    } catch (error) {
      console.error("Failed to load user:", error);
      localStorage.removeItem("authToken");
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUserFromToken();
  }, [mounted]);

  const logout = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("authToken");

      // Clear auth state first
      localStorage.removeItem("authToken");
      setUser(null);

      // Try to call logout endpoint if token exists
      if (token) {
        try {
          const response = await fetch("http://localhost:5000/auth/logout", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            console.warn(
              "Logout endpoint returned non-OK status:",
              response.status
            );
          }
        } catch (error) {
          console.warn("Error calling logout endpoint:", error);
          // Continue with logout even if the endpoint call fails
        }
      }

      // Redirect to login page
      router.push("/login");
    } catch (error) {
      console.error("Error during logout:", error);
      // Ensure we still redirect even if there's an error
      router.push("/login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading: !mounted || isLoading,
        isAuthenticated: !!user,
        logout,
        setAuthToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
