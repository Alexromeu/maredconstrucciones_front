import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCustomer } from "../../contexts/CustomerContext";
import "./styles/CustomerEdit.css";


export default function AdminEditCustomer() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { customers, fetchCustomers, updateCustomer } = useCustomer();

  const [form, setForm] = useState({
    name: "",
    lastname: "",
    phone_number: "",
    email: "",
    address: ""
  });

  const [loading, setLoading] = useState(false);

  // Load customer from context OR fetch if not loaded
  useEffect(() => {
    async function load() {
      if (customers.length === 0) {
        await fetchCustomers();
      }

      const customer = customers.find(c => c.id === Number(id));

      if (customer) {
        setForm({
          name: customer.name ?? "",
          lastname: customer.lastname ?? "",
          phone_number: customer.phone_number ?? "",
          email: customer.email ?? "",
          address: customer.address ?? ""
        });
      }
    }

    load();
  }, [customers, id, fetchCustomers]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    await updateCustomer(id, form);

    setLoading(false);
    alert("Customer updated successfully");
    navigate("/admin");
  }

  return (
    <section className="admin-edit-customer">
      <h2>Edit Customer</h2>

      <form onSubmit={handleSubmit}>
        <label>
          Name
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
          />
        </label>

        <label>
          Lastname
          <input
            name="lastname"
            value={form.lastname}
            onChange={handleChange}
          />
        </label>

        <label>
          Phone Number
          <input
            name="phone_number"
            value={form.phone_number}
            onChange={handleChange}
          />
        </label>

        <label>
          Email
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
          />
        </label>

        <label>
          Address
          <input
            name="address"
            value={form.address}
            onChange={handleChange}
          />
        </label>

        <button disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </section>
  );
}
