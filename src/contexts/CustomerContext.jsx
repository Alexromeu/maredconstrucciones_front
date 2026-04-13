import { createContext, useState, useContext } from "react";
import convert_url from "../utiles/url_convert";


export const CustomerContext = createContext();

export function CustomerProvider({ children }) {
  const [customers, setCustomers] = useState([]);

  async function fetchCustomers() {
    const res = await fetch(convert_url("/api/customers"), {
      credentials: "include",
    });

    const data = await res.json();
    setCustomers(data);
  }

  async function createCustomer(payload) {
    const res = await fetch(convert_url("/api/customers"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });
    const newCustomer = await res.json();

    setCustomers(prev => [...prev, newCustomer]);
    return newCustomer;
  }

  async function updateCustomer(id, payload) {
    const res = await fetch(convert_url(`/api/customers/${id}`), {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    const updated = await res.json();
    setCustomers(prev => prev.map(c => (c.id === id ? updated : c)));
    return updated;
  }

  async function deleteCustomer(id) {
    await fetch(convert_url(`/api/customers/${id}`), {
      method: "DELETE",
      credentials: "include",
    });
    setCustomers(prev => prev.filter(c => c.id !== id));
  }

  return (
    <CustomerContext.Provider
      value={{
        customers,
        fetchCustomers,
        createCustomer,
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
