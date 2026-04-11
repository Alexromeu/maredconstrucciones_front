import { createContext, useContext, useState } from "react";
import convert_url from "../utiles/url_convert";
import { useCallback } from "react";

export const ServiceContext = createContext();

const MOCK_SERVICES = [
  {
    id: 1,
    name: "General Contracting",
    description: "Full-scope construction management from planning to delivery. We coordinate all trades and subcontractors to keep your project on time and on budget.",
    base_price: 5000.00,
    unit: "project",
    is_active: true,
    image_url: null,
  },
  {
    id: 2,
    name: "Structural Renovation",
    description: "Walls, columns, beams, and foundations. We handle structural changes safely, with proper permits and engineering oversight.",
    base_price: 120.00,
    unit: "m²",
    is_active: true,
    image_url: null,
  },
  {
    id: 3,
    name: "Flooring Installation",
    description: "Ceramic, porcelain, hardwood, or epoxy — precision installation for residential and commercial spaces.",
    base_price: 35.00,
    unit: "m²",
    is_active: true,
    image_url: null,
  },
  {
    id: 4,
    name: "Painting & Finishing",
    description: "Interior and exterior painting, plastering, and surface finishing. We prep properly so the finish lasts.",
    base_price: 18.00,
    unit: "m²",
    is_active: true,
    image_url: null,
  },
  {
    id: 5,
    name: "Electrical Work",
    description: "Complete electrical installations, panel upgrades, and rewiring by licensed electricians. Residential and commercial.",
    base_price: 80.00,
    unit: "hour",
    is_active: true,
    image_url: null,
  },
  {
    id: 6,
    name: "Project Management",
    description: "Dedicated project management to oversee schedules, budgets, and quality control across all phases of construction.",
    base_price: 2500.00,
    unit: "month",
    is_active: true,
    image_url: null,
  },
];

export function ServiceProvider({ children }) {
  const [services, setServices] = useState(MOCK_SERVICES);

  const fetchServices = useCallback(async () => {
    const res = await fetch(convert_url("/api/services"));
    const data = await res.json();
    setServices(data);
  }, []);

  const updateService = useCallback(async (id, payload) => {
    const res = await fetch(convert_url(`/api/services/${id}`), {
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
