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
      
      const data = await res.json();

      if (!res.ok) return null;

      // data contains id, email, name, role_id — no token (stored in HTTP-only cookie)
      setUser(data);
      sessionStorage.setItem("auth_user", JSON.stringify(data));
      return data;
    }

    async function logout() {
      await fetch(convert_url("/auth/logout"), {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
      sessionStorage.removeItem("auth_user");
    }

    async function register({ name, email, password, role_id }) {
      try {
        const res = await fetch(convert_url("/auth/register"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ name, email, password, role_id })
        });

        const data = await res.json();

        if (!res.ok) {
          return { error: data.error || "Registration failed" };
        }

        return { success: true };
      } catch (err) {
        return { error: "Server error" };
      }
    }

    async function registerAdmin({ name, email, password }) {
      if (user?.role_id !== 1) {
        return { error: "Only admins can create admin accounts" };
      }
      return register({ name, email, password, role_id: 1 });
    }

    return (
      <AuthContext.Provider value={{ user, login, logout, register, registerAdmin }}>
        {children}
      </AuthContext.Provider>
    );
}

export  function useAuth() {
  return useContext(AuthContext);
}