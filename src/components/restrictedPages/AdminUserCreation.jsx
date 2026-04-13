import { useState } from "react";
import "./styles/AdminCreateUser.css";
import { useAuth } from "../../contexts/AuthContext";

export default function AdminCreateUser() {
    const { register } = useAuth();
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        role_id: 2 // default: employee
    });

    const [loading, setLoading] = useState(false);

    function handleChange(e) {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: name === "role_id" ? Number(value) : value,
        }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);

        const result = await register(form);

        setLoading(false);

        if (result?.error) {
            alert(`Error creating user: ${result.error}`);
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
