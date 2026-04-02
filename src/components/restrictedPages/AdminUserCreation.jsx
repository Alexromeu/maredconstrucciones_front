import { useState } from "react";
import convert_url from "../../utiles/url_convert";
import "./styles/AdminCreateUser.css";
import { useAuth } from "../../contexts/AuthContext";

export default function AdminCreateUser() {
    const { user } = useAuth();
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        role_id: 2 // default: employee
    });

    const [loading, setLoading] = useState(false);

    function handleChange(e) {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);

        const res = await fetch(convert_url("/auth/register"), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form)
        });

        setLoading(false);

        if (!res.ok) {
            alert("Error creating user");
            return;
        }

        alert("User created successfully");

        setForm({
            name: "",
            email: "",
            password: "",
            role_id: 2
        });
    }


    return (
        <section className="admin-create-user">
        <h2>Create User (Admin Only)</h2>

        <form className="user-form" onSubmit={handleSubmit}>
            <label>
            Name
            <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
            />
            </label>

            <label>
            Email
            <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
            />
            </label>

            <label>
            Password
            <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
            />
            </label>

            <label>
            Role
            <select
                name="role_id"
                value={form.role_id}
                onChange={handleChange}
            >
                <option value={1}>Admin</option>
                <option value={2}>Employee</option>
                <option value={3}>Customer</option>
            </select>
            </label>

            <button type="submit" className="create-user-btn" disabled={loading}>
            {loading ? "Creating..." : "Create User"}
            </button>
        </form>
        </section>
    );
}
