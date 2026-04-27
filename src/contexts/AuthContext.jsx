import { createContext, useState, useEffect, useContext } from "react";
import { apiFetch, getToken, setToken } from "../utiles/api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
      if (!getToken()) return;
      apiFetch("/auth/me")
        .then(async res => {
          if (!res.ok) return;
          const data = await res.json().catch(() => null);
          if (data) setUser(data);
        })
        .catch(() => {});
    }, []);

    useEffect(() => {
      const handler = () => setUser(null);
      window.addEventListener("auth:unauthorized", handler);
      return () => window.removeEventListener("auth:unauthorized", handler);
    }, []);

    async function login(credentials) {
      const res = await apiFetch("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        return { error: data.error || "Login failed", status: res.status };
      }

      const { token, ...userData } = data;
      setToken(token);
      setUser(userData);
      return { user: userData };
    }

    async function logout() {
      await apiFetch("/auth/logout", { method: "POST" }).catch(() => {});
      setToken(null);
      setUser(null);
    }

    async function register(payload) {
      try {
        const res = await apiFetch("/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          return { error: data.error || "Registration failed", status: res.status };
        }

        return { success: true, user: data };
      } catch (err) {
        return { error: "Server error" };
      }
    }

    async function adminCreateUser({ name, email, password, role_id }) {
      if (user?.role_id !== 1) {
        return { error: "Only admins can create users" };
      }
      try {
        const res = await apiFetch("/auth/admin/create-user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password, role_id })
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          return { error: data.error || "Failed to create user", status: res.status };
        }

        return { success: true, user: data };
      } catch (err) {
        return { error: "Server error" };
      }
    }

    async function resendVerification(email) {
      try {
        const res = await apiFetch("/auth/resend-verification", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        return res.ok;
      } catch {
        return false;
      }
    }

    async function verifyEmail(token) {
      try {
        const res = await apiFetch(`/auth/verify-email/${token}`);
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          return { error: data.error || "Verification failed", status: res.status };
        }
        return { success: true };
      } catch {
        return { error: "Server error" };
      }
    }

    return (
      <AuthContext.Provider value={{ user, login, logout, register, adminCreateUser, resendVerification, verifyEmail }}>
        {children}
      </AuthContext.Provider>
    );
}

export  function useAuth() {
  return useContext(AuthContext);
}
