import { createContext, useState, useEffect, useContext } from "react";
import convert_url from "../utiles/url_convert";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
      const stored = sessionStorage.getItem("auth_user");
      if (stored) setUser(JSON.parse(stored));
    }, []);

    async function login(credentials) {
      const res = await fetch(convert_url("/auth/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(credentials),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        return { error: data.error || "Login failed", status: res.status };
      }

      setUser(data);
      sessionStorage.setItem("auth_user", JSON.stringify(data));
      return { user: data };
    }

    async function logout() {
      await fetch(convert_url("/auth/logout"), {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
      sessionStorage.removeItem("auth_user");
    }

    async function register({ name, email, password }) {
      try {
        const res = await fetch(convert_url("/auth/register"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ name, email, password })
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
        const res = await fetch(convert_url("/auth/admin/create-user"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
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
        const res = await fetch(convert_url("/auth/resend-verification"), {
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
        const res = await fetch(convert_url(`/auth/verify-email/${token}`));
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
