import { useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import "./CreateAccount.css";

export default function CreateAccount() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    lastname: "",
    phone_number: "",
    email: "",
    address: "",
    password: "",
    confirmPassword: ""
  });

  const [status, setStatus] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setStatus("Passwords do not match.");
      return;
    }

    setStatus("Creating account...");

    const result = await register({
      name: form.name,
      lastname: form.lastname,
      phone_number: form.phone_number,
      email: form.email,
      address: form.address,
      password: form.password,
    });

    if (result?.error) {
      setStatus(result.error);
      return;
    }

    setStatus("Account created! Check your inbox to verify your email before signing in.");
    setTimeout(() => navigate("/signin"), 2500);
  }

  return (
    <div className="create-account-container">
      <h2>Create Your Account</h2>

      <form onSubmit={handleSubmit} className="create-account-form">
        <input
          type="text"
          name="name"
          placeholder="First Name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="lastname"
          placeholder="Last Name"
          value={form.lastname}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="phone_number"
          placeholder="Phone Number"
          value={form.phone_number}
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onChange={handleChange}
          required
        />

        <button type="submit">Create Account</button>
      </form>

      {status && <p className="status-msg">{status}</p>}

      <p className="auth-swap">
        Already have an account? <Link to="/signin">Sign in</Link>
      </p>
    </div>
  );
}
