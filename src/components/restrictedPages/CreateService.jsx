import { useState } from "react";
import { apiFetch } from "../../utiles/api";
import { useService } from "../../contexts/ServiceContext";
import "./styles/AdminCreateService.css";

export default function AdminCreateService() {
  const { fetchServices } = useService();

  const [form, setForm] = useState({
    name: "",
    description: "",
    base_price: "",
    unit: "",
    is_active: true,
    image_url: ""
  });

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const res = await apiFetch("/api/services", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      alert("Error creating service");
      return;
    }

    await fetchServices(); // refresh context
    alert("Service created successfully");

    // Reset form
    setForm({
      name: "",
      description: "",
      base_price: "",
      unit: "",
      is_active: true,
      image_url: ""
    });
  }

  return (
    <section className="admin-create-service">
      <h2>Create New Service</h2>

      <form className="create-form" onSubmit={handleSubmit}>
        <label>
          Name
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Description
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="4"
            required
          />
        </label>

        <label>
          Base Price
          <input
            type="number"
            name="base_price"
            value={form.base_price}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Unit
          <input
            name="unit"
            value={form.unit}
            onChange={handleChange}
          />
        </label>

        <label>
          Image URL
          <input
            name="image_url"
            value={form.image_url}
            onChange={handleChange}
          />
        </label>

        <label className="checkbox-row">
          <input
            type="checkbox"
            name="is_active"
            checked={form.is_active}
            onChange={handleChange}
          />
          Active
        </label>

        <button type="submit" className="create-btn">
          Create Service
        </button>
      </form>
    </section>
  );
}
