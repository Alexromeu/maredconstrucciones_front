import { createContext, useState, useContext } from "react";
import convert_url from "../utiles/url_convert";

export const QuoteContext = createContext();

export function QuoteProvider({ children }) {
  const [quotes, setQuotes] = useState([]);
  const [myQuotes, setMyQuotes] = useState([]);

  async function fetchMyQuotes() {
    const res = await fetch(convert_url("/api/quotes/my"), {
      credentials: "include",
    });
    const data = await res.json();
    const list = Array.isArray(data) ? data : [];
    setMyQuotes(list);
    return list;
  }

  async function fetchQuotes() {
    const res = await fetch(convert_url("/api/quotes"), {
      credentials: "include",
    });
    const data = await res.json();
    setQuotes(data);
  }

  async function createQuote(payload) {
    const res = await fetch(convert_url("/api/quotes"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });
    const newQuote = await res.json();
    setQuotes(prev => [...prev, newQuote]);
    return newQuote;
  }

  async function updateQuote(id, payload) {
    const res = await fetch(convert_url(`/api/quotes/${id}`), {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });
    const updated = await res.json();
    setQuotes(prev => prev.map(q => (q.id === id ? updated : q)));
    return updated;
  }

  async function deleteQuote(id) {
    await fetch(convert_url(`/api/quotes/${id}`), {
      method: "DELETE",
      credentials: "include",
    });
    setQuotes(prev => prev.filter(q => q.id !== id));
  }

  return (
    <QuoteContext.Provider value={{
      quotes,
      myQuotes,
      fetchQuotes,
      fetchMyQuotes,
      createQuote,
      updateQuote,
      deleteQuote
    }}>
      {children}
    </QuoteContext.Provider>
  );
}



export function useQuote() {
  return useContext(QuoteContext);
}
