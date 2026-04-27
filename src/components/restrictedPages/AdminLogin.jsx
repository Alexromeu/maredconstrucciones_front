import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import "./styles/AdminLogin.css";

export default function AdminLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const result = await login({ email: form.email, password: form.password });
    setSubmitting(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    navigate(result.user.role_id === 3 ? "/my-account" : "/admin");
  }

  return (
    <section className="admin-login">
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={submitting}>
          {submitting ? "Signing in..." : "Login"}
        </button>
      </form>

      {error && <p className="admin-login-error">{error}</p>}
    </section>
  );
}
