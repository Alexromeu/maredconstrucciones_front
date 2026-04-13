import { createContext, useContext, useState } from "react";
import convert_url from "../utiles/url_convert";
import { useCallback } from "react";

export const ServiceContext = createContext();


export function ServiceProvider({ children }) {
  const [services, setServices] = useState([]);

  const fetchServices = useCallback(async () => {
    const res = await fetch(convert_url("/api/services"), {
    });
    const data = await res.json();
    setServices(data);
  }, []);

  const updateService = useCallback(async (id, payload) => {
    const res = await fetch(convert_url(`/api/services/${id}`), {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
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
