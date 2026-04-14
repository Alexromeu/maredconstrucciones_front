import { useEffect, useMemo, useState } from "react";
import { useService } from "../../../contexts/ServiceContext";
import { useQuote } from "../../../contexts/QuoteContext";
import { useAuth } from "../../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import "./QuoteBuilder.css";

export default function QuoteBuilder() {
  const { user } = useAuth();
  const { services, fetchServices } = useService();
  const { myQuotes, fetchMyQuotes, createQuote } = useQuote();
  const navigate = useNavigate();

  const [selections, setSelections] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  useEffect(() => {
    fetchServices();
    fetchMyQuotes();
  }, []);

  useEffect(() => {
    if (!services.length) return;

    const latest = Array.isArray(myQuotes) && myQuotes.length > 0
      ? [...myQuotes].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0]
      : null;

    const preset = {};
    if (latest?.items?.length) {
      for (const item of latest.items) {
        const svc = services.find(s =>
          (item.service_id && s.id === item.service_id) ||
          (item.service_name && s.name === item.service_name)
        );
        if (svc) {
          preset[svc.id] = { selected: true, quantity: Number(item.quantity) || 1 };
        }
      }
    }
    setSelections(preset);
  }, [services, myQuotes]);

  function toggleService(id) {
    setSelections(prev => {
      const existing = prev[id];
      if (existing?.selected) {
        return { ...prev, [id]: { ...existing, selected: false } };
      }
      return { ...prev, [id]: { selected: true, quantity: existing?.quantity || 1 } };
    });
  }

  function updateQuantity(id, value) {
    const qty = Math.max(1, Number(value) || 1);
    setSelections(prev => ({
      ...prev,
      [id]: { selected: prev[id]?.selected ?? true, quantity: qty },
    }));
  }

  const total = useMemo(() => {
    return services.reduce((sum, svc) => {
      const entry = selections[svc.id];
      if (!entry?.selected) return sum;
      return sum + Number(svc.base_price) * entry.quantity;
    }, 0);
  }, [services, selections]);

  const selectedCount = Object.values(selections).filter(s => s.selected).length;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!user) {
      navigate("/signin");
      return;
    }
    if (selectedCount === 0) {
      setStatusMsg("Please select at least one service.");
      return;
    }

    const items = services
      .filter(svc => selections[svc.id]?.selected)
      .map(svc => ({
        service_id: svc.id,
        quantity: selections[svc.id].quantity,
      }));

    setSubmitting(true);
    setStatusMsg("");
    try {
      await createQuote({ items });
      setStatusMsg("Estimate submitted successfully.");
      await fetchMyQuotes();
    } catch (err) {
      console.error(err);
      setStatusMsg("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="quote-page">
      <div className="quote-container">
        <h2>Request an Estimate</h2>
        <p className="quote-intro">
          Select the services you are interested in and set the quantity. The
          estimated total will update automatically.
        </p>

        <form className="quote-form" onSubmit={handleSubmit}>
          <div className="quote-services-list">
            {services.length === 0 ? (
              <p className="quote-empty">No services available right now.</p>
            ) : (
              services.map(svc => {
                const entry = selections[svc.id];
                const checked = !!entry?.selected;
                const qty = entry?.quantity || 1;
                return (
                  <div
                    key={svc.id}
                    className={`quote-service-row ${checked ? "is-selected" : ""}`}
                  >
                    <label className="quote-service-label">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleService(svc.id)}
                      />
                      <span className="quote-service-name">{svc.name}</span>
                      <span className="quote-service-price">
                        ${Number(svc.base_price).toLocaleString()}
                        {svc.unit && <small> / {svc.unit}</small>}
                      </span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      className="quote-quantity"
                      value={qty}
                      disabled={!checked}
                      onChange={e => updateQuantity(svc.id, e.target.value)}
                    />
                  </div>
                );
              })
            )}
          </div>

          <div className="quote-total-bar">
            <span>Estimated Total</span>
            <strong>${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
          </div>

          <button type="submit" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Estimate"}
          </button>

          {statusMsg && <p className="quote-status">{statusMsg}</p>}
        </form>
      </div>
    </section>
  );
}
