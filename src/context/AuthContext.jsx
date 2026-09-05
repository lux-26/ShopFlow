import { createContext, useCallback, useContext, useEffect, useState } from "react";
import apiClient from "../utils/apiClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // isLoading : true tant qu'on n'a pas encore vérifié la session auprès du serveur.
  // Sert à éviter un "flash" où une route protégée redirige vers /login avant
  // même d'avoir eu la réponse de /api/auth/me.
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const data = await apiClient.get("/auth/me");
      setUser(data.user);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Récupération de la session au montage : setState asynchrone après le
    // fetch, une fois la réponse reçue — pas un enchaînement de rendus synchrones.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
  }, [refresh]);

  const login = useCallback(async (email, password) => {
    const data = await apiClient.post("/auth/login", { email, password });
    setUser(data.user);
    return data.user;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const data = await apiClient.post("/auth/register", { name, email, password });
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiClient.post("/auth/logout");
    } finally {
      setUser(null);
    }
  }, []);

  const value = {
    user,
    isAuthenticated: Boolean(user),
    isAdmin: user?.role === "ADMIN",
    isLoading,
    login,
    register,
    logout,
    refresh,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Ce hook est exporté avec son provider pour garder l'API du contexte concise.
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth() doit être utilisé à l'intérieur d'un <AuthProvider>.");
  }
  return context;
};
