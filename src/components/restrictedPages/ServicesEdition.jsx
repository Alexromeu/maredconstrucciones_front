import { useState, useEffect } from "react";
import { useService } from "../../contexts/ServiceContext";
import "./styles/AdminServiceEditor.css";

export default function AdminServiceEditor() {
  const { services, fetchServices, updateService } = useService();

  const [selectedId, setSelectedId] = useState("");
  const [form, setForm] = useState({
    name: "",
    description: "",
    image_url: "",
    base_price: "",
    unit: "",
    is_active: true,
  });

  // Load services once (context already prevents re-fetch)
  useEffect(() => {
    fetchServices();
  }, []);

  // When selecting a service, populate the form
  useEffect(() => {
    if (!selectedId) return;

    const svc = services.find(s => s.id === Number(selectedId));
    if (!svc) return;

    setForm({
      name: svc.name,
      description: svc.description,
      image_url: svc.image_url,
      base_price: svc.base_price,
      unit: svc.unit,
      is_active: svc.is_active,
    });
  }, [selectedId, services]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!selectedId) return;

    await updateService(selectedId, form);
    alert("Service updated successfully");
  }

  return (
    <section className="admin-service-editor">
      <h1>Edit Service</h1>

      <div className="service-select">
        <label>Select a service to edit:</label>
        <select
          value={selectedId}
          onChange={e => setSelectedId(e.target.value)}
        >
          <option value="">-- Choose a service --</option>
          {services.map(s => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>


      {selectedId && (
        <form className="service-form" onSubmit={handleSubmit}>
          <label>
            Title
            <input
              name="title"
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
            Image URL
            <input
              name="image_url"
              value={form.image_url}
              onChange={handleChange}
            />
          </label>

          <label>
            Base Price
            <input
              name="base_price"
              type="number"
              value={form.base_price}
              onChange={handleChange}
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

          <label className="checkbox-row">
            <input
              type="checkbox"
              name="is_active"
              checked={form.is_active}
              onChange={handleChange}
            />
            Active
          </label>

          <button type="submit" className="save-btn">
            Save Changes
          </button>
        </form>
      )}
    </section>
  );
}
