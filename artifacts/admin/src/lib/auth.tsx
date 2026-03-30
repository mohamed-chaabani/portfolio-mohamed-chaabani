import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { getAbout } from "./api";

type AuthCtx = {
  isAuthenticated: boolean;
  login: (secret: string) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("admin_secret");
    if (saved) {
      localStorage.setItem("admin_secret", saved);
      getAbout()
        .then(() => setIsAuthenticated(true))
        .catch(() => {
          localStorage.removeItem("admin_secret");
          setIsAuthenticated(false);
        });
    }
  }, []);

  const login = async (secret: string): Promise<boolean> => {
    localStorage.setItem("admin_secret", secret);
    try {
      await getAbout();
      setIsAuthenticated(true);
      return true;
    } catch {
      localStorage.removeItem("admin_secret");
      setIsAuthenticated(false);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("admin_secret");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
