import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import "./styles/AdminLogin.css";

export default function AdminLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const data = await login({ email: form.email, password: form.password });
    if (!data) return alert("Invalid credentials");

    navigate(data.role_id === 3 ? "/my-account" : "/admin");
  }

  return (
    <section className="admin-login">
      <h2>Admin Login</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />

        <button type="submit">Login</button>
      </form>
    </section>
  );
}
