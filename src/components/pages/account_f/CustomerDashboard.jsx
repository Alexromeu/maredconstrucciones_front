import { useEffect } from "react";
import { useQuote } from "../../../contexts/QuoteContext";
import { useAuth } from "../../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import "./CustomerDashboard.css";

const STATUS_LABEL = {
  draft:    "Draft",
  pending:  "Pending",
  approved: "Approved",
  rejected: "Rejected",
};

export default function CustomerDashboard() {
  const { user, logout } = useAuth();
  const { myQuotes, fetchMyQuotes } = useQuote([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyQuotes();
  }, []);

  async function handleLogout() {
    await logout();
    navigate("/admin/login");
  }

  return (
    <div className="customer-dashboard">
      <header className="dashboard-header">
        <h1>My Estimates</h1>
        <div className="dashboard-user">
          <span>{user?.name}</span>
          <button onClick={handleLogout}>Log out</button>
        </div>
      </header>

      {myQuotes.length === 0 ? (
        <p className="no-quotes">You have no estimates yet. Contact us to get started.</p>
      ) : (
        <div className="quotes-list">
          {myQuotes.map(quote => (
            <div key={quote.id} className="quote-card">
              <div className="quote-card-header">
                <span className="quote-id">Estimate #{quote.id}</span>
                <span className={`quote-status status-${quote.status}`}>
                  {STATUS_LABEL[quote.status] ?? quote.status}
                </span>
                <span className="quote-date">
                  {new Date(quote.created_at).toLocaleDateString()}
                </span>
              </div>

              {quote.items.length > 0 && (
                <table className="quote-items-table">
                  <thead>
                    <tr>
                      <th>Service</th>
                      <th>Qty</th>
                      <th>Unit Price</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quote.items.map(item => (
                      <tr key={item.id}>
                        <td>{item.service_name}</td>
                        <td>{item.quantity}</td>
                        <td>${Number(item.price_at_time).toFixed(2)}</td>
                        <td>${Number(item.subtotal).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              <div className="quote-total">
                Total: <strong>${Number(quote.total).toFixed(2)}</strong>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
