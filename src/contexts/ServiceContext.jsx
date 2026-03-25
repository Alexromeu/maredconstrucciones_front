import { createContext, useState } from "react";

export const ServiceContext = createContext();

export function ServiceProvider({ children }) {
  const [services, setServices] = useState([]);

  async function fetchServices() {
    const res = await fetch("/api/services");
    const data = await res.json();
    setServices(data);
  }

  async function updateService(id, payload) {
    const res = await fetch(`/api/services/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const updated = await res.json();

    setServices(prev =>
      prev.map(s => (s.id === id ? updated : s))
    );
  }

  return (
    <ServiceContext.Provider value={{
      services,
      fetchServices,
      updateService
    }}>
      {children}
    </ServiceContext.Provider>
  );
}
