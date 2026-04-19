import { createContext, useContext, useState } from "react";
import { apiFetch } from "../utiles/api";
import { useCallback } from "react";

export const ServiceContext = createContext();


export function ServiceProvider({ children }) {
  const [services, setServices] = useState([]);

  const fetchServices = useCallback(async () => {
    try {
      const res = await apiFetch("/api/services");
      if (!res.ok) {
        console.error("fetchServices failed:", res.status, res.statusText);
        setServices([]);
        return;
      }
      const data = await res.json();
      setServices(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("fetchServices error:", err);
      setServices([]);
    }
  }, []);

  const updateService = useCallback(async (id, payload) => {
    const res = await apiFetch(`/api/services/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error("Update error:", errorData);
      return { error: errorData.error || "Failed to update service" };
    }
    const updated = await res.json();

    setServices(prev =>
      prev.map(s => (s.id === id ? updated : s))
    );
  }, []);

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



export function useService() {
  return useContext(ServiceContext);
}
