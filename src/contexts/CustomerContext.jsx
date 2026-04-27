import { createContext, useState, useContext } from "react";
import { apiFetch } from "../utiles/api";


export const CustomerContext = createContext();

export function CustomerProvider({ children }) {
  const [customers, setCustomers] = useState([]);

  async function fetchCustomers() {
    const res = await apiFetch("/api/customers");

    const data = await res.json();
    setCustomers(data);
  }

  async function updateCustomer(id, payload) {
    const res = await apiFetch(`/api/customers/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const updated = await res.json();
    setCustomers(prev => prev.map(c => (c.id === id ? updated : c)));
    return updated;
  }

  async function deleteCustomer(id) {
    await apiFetch(`/api/customers/${id}`, {
      method: "DELETE",
    });
    setCustomers(prev => prev.filter(c => c.id !== id));
  }

  return (
    <CustomerContext.Provider
      value={{
        customers,
        fetchCustomers,
        updateCustomer,
        deleteCustomer,
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
}


export function useCustomer() {
  return useContext(CustomerContext);
}
