import { createContext, useState } from "react";

export const OfferedServicesContext = createContext();

export function OfferedServicesProvider({ children }) {
  const [offeredServices, setOfferedServices] = useState([]);

  async function fetchOfferedServices(quoteId) {
    const res = await fetch(`/api/quotes/${quoteId}/offered-services`);
    const data = await res.json();
    setOfferedServices(data);
  }

  async function addOfferedService(quoteId, payload) {
    const res = await fetch(`/api/quotes/${quoteId}/offered-services`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const newItem = await res.json();
    setOfferedServices(prev => [...prev, newItem]);
    return newItem;
  }

  async function updateOfferedService(id, payload) {
    const res = await fetch(`/api/offered-services/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const updated = await res.json();
    setOfferedServices(prev => prev.map(i => (i.id === id ? updated : i)));
    return updated;
  }

  async function deleteOfferedService(id) {
    await fetch(`/api/offered-services/${id}`, { method: "DELETE" });
    setOfferedServices(prev => prev.filter(i => i.id !== id));
  }

  return (
    <OfferedServicesContext.Provider value={{
      offeredServices,
      fetchOfferedServices,
      addOfferedService,
      updateOfferedService,
      deleteOfferedService
    }}>
      {children}
    </OfferedServicesContext.Provider>
  );
}
