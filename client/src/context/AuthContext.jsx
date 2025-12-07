import { createContext, useContext, useEffect, useState } from "react";
import * as authApi from "../api/authApi";

const AuthContext = createContext();
const TOKEN_KEY = "perfume_auth_token";
const USER_KEY = "perfume_auth_user";

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = localStorage.getItem(TOKEN_KEY);
    const u = localStorage.getItem(USER_KEY);
    if (t) setToken(t);
    if (u) setUser(JSON.parse(u));
    setLoading(false);
  }, []);

  const saveAuth = (t, u) => {
    try {
      localStorage.setItem(TOKEN_KEY, t);
      localStorage.setItem(USER_KEY, JSON.stringify(u));
    } catch (e) {
      console.warn("Failed to persist auth", e);
    }
    setToken(t);
    setUser(u);
  };

  const clearAuth = () => {
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } catch (e) {}
    setToken(null);
    setUser(null);
  };

  const register = async (payload) => {
    const res = await authApi.register(payload);
    saveAuth(res.token, res.user);
    return res;
  };

  const login = async (payload) => {
    const res = await authApi.login(payload);
    saveAuth(res.token, res.user);
    return res;
  };

  const logout = async () => {
    const t = token;
    clearAuth();
    try {
      await authApi.logout(t);
    } catch (e) {
      // ignore
    }
  };

  return (
    <AuthContext.Provider value={{ token, user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
