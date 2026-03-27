import { useState } from "react";
import { useCustomer } from "../../../contexts/CustomerContext";
import "./CreateAccount.css";

export default function CreateAccount() {
  const [form, setForm] = useState({
    name: "",
    lastname: "",
    phone_number: "",
    email: "",
    address: ""
  });

  const customerContext = useCustomer();
  const [status, setStatus] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("Creating account...");
console.log("Submitting form:", form);
    const result = await customerContext.createCustomer(form);
  
    if (result.error) {
      setStatus(result.error);

    } else {
      setStatus("Account created successfully!");
      setForm({
        name: "",
        lastname: "",
        phone_number: "",
        email: "",
        address: ""
      });
    }
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

        <button type="submit">Create Account</button>
      </form>

      {status && <p className="status-msg">{status}</p>}
    </div>
  );
}
