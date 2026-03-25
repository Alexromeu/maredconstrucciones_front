import { createContext, useState, useEffect } from "react";
import { login, logout } from "../api/auth_api";

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
    const res = await fetch("/api/auth/login", {
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

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
