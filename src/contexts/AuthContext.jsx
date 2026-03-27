import { createContext, useState, useEffect, useContext } from "react";
import convert_url from "../utiles/url_convert";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("auth");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  function saveUser(data) {
    setUser(data);
    localStorage.setItem("auth", JSON.stringify(data));
  }

    async function login(credentials) {
    const res = await fetch(convert_url("/auth/login"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    const data = await res.json();
    saveUser(data);
    return data;
  }

    function logout() {
    setUser(null);
    localStorage.removeItem("auth");
  }

  async function register({ name, email, password }) {
    try {
      const res = await fetch(convert_url("/auth/register"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
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

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export  function useAuth() {
  return useContext(AuthContext);
}