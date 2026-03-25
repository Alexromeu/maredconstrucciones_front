import { createContext, useState } from "react";

export const QuoteContext = createContext();

export function QuoteProvider({ children }) {
  const [quotes, setQuotes] = useState([]);

  async function fetchQuotes() {
    const res = await fetch("/api/quotes");
    const data = await res.json();
    setQuotes(data);
  }

  async function createQuote(payload) {
    const res = await fetch("/api/quotes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const newQuote = await res.json();
    setQuotes(prev => [...prev, newQuote]);
    return newQuote;
  }

  async function updateQuote(id, payload) {
    const res = await fetch(`/api/quotes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const updated = await res.json();
    setQuotes(prev => prev.map(q => (q.id === id ? updated : q)));
    return updated;
  }

  async function deleteQuote(id) {
    await fetch(`/api/quotes/${id}`, { method: "DELETE" });
    setQuotes(prev => prev.filter(q => q.id !== id));
  }

  return (
    <QuoteContext.Provider value={{
      quotes,
      fetchQuotes,
      createQuote,
      updateQuote,
      deleteQuote
    }}>
      {children}
    </QuoteContext.Provider>
  );
}
