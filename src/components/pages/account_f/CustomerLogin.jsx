import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import "./CreateAccount.css";

export default function CustomerLogin() {
  const { user, login, resendVerification } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [status, setStatus] = useState("");
  const [needsVerification, setNeedsVerification] = useState(false);

  // If already logged in, skip this page
  useEffect(() => {
    if (!user) return;
    navigate(user.role_id === 3 ? "/my-account" : "/admin", { replace: true });
  }, [user, navigate]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setNeedsVerification(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("Signing in...");
    setNeedsVerification(false);

    const result = await login({ email: form.email, password: form.password });

    if (result.error) {
      setStatus(result.error);
      if (result.status === 403) setNeedsVerification(true);
      return;
    }

    navigate(result.user.role_id === 3 ? "/my-account" : "/admin");
  }

  async function handleResend() {
    setStatus("Sending verification email...");
    await resendVerification(form.email);
    setStatus("If the account exists and is unverified, a new email was sent.");
    setNeedsVerification(false);
  }

  return (
    <div className="create-account-container">
      <h2>Sign In</h2>

      <form onSubmit={handleSubmit} className="create-account-form">
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <button type="submit">Sign In</button>
      </form>

      {status && <p className="status-msg">{status}</p>}

      {needsVerification && (
        <button type="button" onClick={handleResend} className="resend-btn">
          Resend verification email
        </button>
      )}

      <p className="auth-swap">
        Don't have an account? <Link to="/account">Create one</Link>
      </p>
    </div>
  );
}
