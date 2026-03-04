import { useState } from "react";
import "./ContactUs.css"

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:3000/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });

    const data = await res.json();
    console.log(data);
  };

  return (
    <>
    <h1 className="contact-title">Contactanos</h1>
    <form className="contact-form" onSubmit={handleSubmit}>
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

      <button type="submit">Enviar</button>
    </form>
    </>
  );
}
