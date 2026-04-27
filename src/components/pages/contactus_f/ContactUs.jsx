import { useState } from "react";
import { apiFetch } from "../../../utiles/api";
import "../account_f/CreateAccount.css";
import "./ContactUs.css";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    website: "",
  });
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus("");

    try {
      const res = await apiFetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setStatus(data.error || "No se pudo enviar el mensaje.");
      } else {
        setStatus("¡Mensaje enviado! Te responderemos pronto.");
        setFormData({ name: "", email: "", message: "", website: "" });
      }
    } catch {
      setStatus("Error de red. Intenta de nuevo.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="create-account-container">
      <h2>Contáctanos</h2>

      <form className="create-account-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Nombre"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <textarea
          name="message"
          placeholder="Mensaje"
          value={formData.message}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="website"
          value={formData.website}
          onChange={handleChange}
          tabIndex="-1"
          autoComplete="off"
          style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px" }}
          aria-hidden="true"
        />

        <button type="submit" disabled={submitting}>
          {submitting ? "Enviando..." : "Enviar"}
        </button>
      </form>

      {status && <p className="status-msg">{status}</p>}
    </div>
  );
}
