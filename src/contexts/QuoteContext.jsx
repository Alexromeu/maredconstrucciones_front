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
    console.log(document.cookie);
    const data = await res.json().catch(() => ({}));
    
    if (!res.ok) {
      const message = data?.error || `Failed to create quote (${res.status})`;
      console.error("createQuote failed:", message, data);
      throw new Error(message);
    }
    setQuotes(prev => [...prev, data]);
    setMyQuotes(prev => [data, ...(Array.isArray(prev) ? prev : [])]);
    return data;
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
    const res = await fetch(convert_url(`/api/quotes/${id}`), {
      method: "DELETE",
      credentials: "include",
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      const message = data?.error || `Failed to delete quote (${res.status})`;
      throw new Error(message);
    }
    setQuotes(prev => prev.filter(q => q.id !== id));
    setMyQuotes(prev =>
      Array.isArray(prev) ? prev.filter(q => q.id !== id) : prev
    );
  }

  async function deleteQuoteItem(itemId) {
    const res = await fetch(convert_url(`/api/quote-items/${itemId}`), {
      method: "DELETE",
      credentials: "include",
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      const message = data?.error || `Failed to delete item (${res.status})`;
      throw new Error(message);
    }

    const orphanedQuoteIds = [];

    const stripItem = quote => {
      const originalLength = quote.items?.length || 0;
      const items = (quote.items || []).filter(i => i.id !== itemId);
      if (items.length === originalLength) return quote;
      if (items.length === 0) {
        orphanedQuoteIds.push(quote.id);
        return null;
      }
      const total = items.reduce(
        (sum, i) => sum + Number(i.subtotal ?? Number(i.price_at_time) * Number(i.quantity)),
        0
      );
      return { ...quote, items, total };
    };

    setMyQuotes(prev =>
      Array.isArray(prev) ? prev.map(stripItem).filter(Boolean) : prev
    );
    setQuotes(prev => prev.map(stripItem).filter(Boolean));

    await Promise.all(
      orphanedQuoteIds.map(qid =>
        fetch(convert_url(`/api/quotes/${qid}`), {
          method: "DELETE",
          credentials: "include",
        }).catch(err => console.error("Failed to delete empty quote", qid, err))
      )
    );
  }

  return (
    <QuoteContext.Provider value={{
      quotes,
      myQuotes,
      fetchQuotes,
      fetchMyQuotes,
      createQuote,
      updateQuote,
      deleteQuote,
      deleteQuoteItem
    }}>
      {children}
    </QuoteContext.Provider>
  );
}



export function useQuote() {
  return useContext(QuoteContext);
}
