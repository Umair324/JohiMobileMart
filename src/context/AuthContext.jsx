import { createContext, useContext, useEffect, useState } from "react";
import { authApi } from "../api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("jmm_token");
    if (!token) {
      setLoading(false);
      return;
    }
    authApi
      .me()
      .then((data) => setUser(data.user))
      .catch(() => {
        localStorage.removeItem("jmm_token");
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (identifier, password) => {
    const data = await authApi.login({ identifier, password });
    localStorage.setItem("jmm_token", data.token);
    setUser(data.user);
    return data.user;
  };

  const register = async (payload) => {
    const data = await authApi.register(payload);
    localStorage.setItem("jmm_token", data.token);
    setUser(data.user);
    return data.user;
  };

  const loginWithGoogle = async (credential, intent) => {
    const data = await authApi.google(credential, intent);
    localStorage.setItem("jmm_token", data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem("jmm_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        loginWithGoogle,
        logout,
        setUser,
        isAdmin: user?.role === "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}