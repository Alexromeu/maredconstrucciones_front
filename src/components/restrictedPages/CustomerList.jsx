import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCustomer } from "../../contexts/CustomerContext";
import "./styles/CustomerList.css";

export default function AdminCustomerList() {
  const { customers, fetchCustomers } = useCustomer();
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (customers.length === 0) {
      fetchCustomers();
    }
  }, [customers, fetchCustomers]);

  const filtered = customers.filter(c => {
    const full = `${c.name} ${c.lastname}`.toLowerCase();
    return full.includes(search.toLowerCase());
  });

  return (
    <section className="admin-customer-list">
      <h2>Customers</h2>

      <input
        className="search"
        placeholder="Search customers..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      <div className="customer-table">
        {filtered.map(c => (
          <div key={c.id} className="customer-row">
            <div>{c.name} {c.lastname}</div>
            <div>{c.email}</div>
            <Link to={`/admin/customers/edit/${c.id}`} className="edit-btn">
              Edit
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
