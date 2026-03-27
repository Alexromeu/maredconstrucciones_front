import { createContext, useState } from "react";
import convert_url from "../utiles/url_convert";

export const ServiceContext = createContext();

export function ServiceProvider({ children }) {
  const [services, setServices] = useState([]);

  async function fetchServices() {
    const res = await fetch(convert_url("/api/services"));
    const data = await res.json();
    setServices(data);
  }

  async function updateService(id, payload) {
    const res = await fetch(convert_url(`/api/services/${id}`), {
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

import { useContext } from "react";

export function useService() {
  return useContext(ServiceContext);
}
