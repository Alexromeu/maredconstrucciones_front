import { Link } from "react-router-dom";
import "./styles/AdminHub.css";

export default function AdminHub() {
  const links = [
    { label: "Edit Services", path: "/admin/services/edit" },
    { label: "Create Service", path: "/admin/services/create" },
    { label: "Manage Images", path: "/admin/images" },
    { label: "View Logs", path: "/admin/logs" },
    { label: "Settings", path: "/admin/settings" },
    { label: "Create User", path: "/admin/users/create" },
    { label: "Customer List", path: "/admin/customers" }
  ];

  return (
    <section className="admin-hub">
      <h1 className="admin-title">Admin Dashboard</h1>

      <div className="admin-grid">
        {links.map((item, i) => (
          <Link key={i} to={item.path} className="admin-card">
            {item.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
