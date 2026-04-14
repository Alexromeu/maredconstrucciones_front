import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import logo from "../assets/logo1.png";
import "../styles/header.css";

export default function Header() {
    const [open, setOpen] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    async function handleLogout() {
        await logout();
        setOpen(false);
        navigate("/");
    }

    function handleProjectsClick(e) {
        setOpen(false);
        if (location.pathname === "/") {
            e.preventDefault();
            document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
        }
    }

    const menuRef = useRef(null);
    const btnRef = useRef(null);

    // Close menu when clicking outside
    useEffect(() => {
        if (!open) return;

        function handleClickOutside(e) {
            if (
                menuRef.current &&
                !menuRef.current.contains(e.target) &&
                btnRef.current &&
                !btnRef.current.contains(e.target)
            ) {
                setOpen(false);
            }
        }

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, [open]);

    // Public header is customer-facing only. Admin/staff never expose admin links
    // in the public UI — that area is reached only by typing the URL.
    const isCustomer = user?.role_id === 3;
    const showAccountArea = !user || isCustomer;

    const accountTarget = isCustomer ? "/my-account" : "/signin";
    const accountLabel  = isCustomer ? "My Account"  : "Sign In";

    return (
        <header className="header-container">
            <div className="header-top">
                <Link className="logo-home-link" to="/">
                    <img className="logo-header" src={logo} alt="Logo" />
                </Link>

                <button
                    className={`burger-btn ${open ? "open" : ""}`}
                    onClick={() => setOpen(!open)}
                    ref={btnRef}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>


            <nav className="desktop-menu">
                <div className="btns-holder">
                    <Link to="/" className="header-menu-btn">Home</Link>
                    <Link to="/#projects" onClick={handleProjectsClick} className="header-menu-btn">Projects</Link>
                    <Link to="/services" className="header-menu-btn">Services</Link>
                    <Link to="/quote" className="header-menu-btn">Estimate</Link>
                    <Link to="/aboutus" className="header-menu-btn">About Us</Link>
                    <Link to="/contactus" className="header-menu-btn">Contact Us</Link>
                </div>
                <div className="account-btn-holder">
                    {user && (
                        <button
                            onClick={handleLogout}
                            className="header-menu-btn signin-btn logout-btn"
                        >
                            Logout
                        </button>
                    )}
                    {showAccountArea && (
                        <Link
                            to={accountTarget}
                            className="header-menu-btn account-btn"
                            title={accountLabel}
                        ></Link>
                    )}
                </div>
            </nav>


            <nav ref={menuRef} className={`mobile-menu ${open ? "show" : ""}`}>
                <Link onClick={() => setOpen(false)} to="/" className="header-menu-btn">Home</Link>
                <Link onClick={handleProjectsClick} to="/#projects" className="header-menu-btn">Projects</Link>
                <Link onClick={() => setOpen(false)} to="/services" className="header-menu-btn">Services</Link>
                <Link onClick={() => setOpen(false)} to="/quote" className="header-menu-btn">Estimate</Link>
                <Link onClick={() => setOpen(false)} to="/aboutus" className="header-menu-btn">About Us</Link>
                <Link onClick={() => setOpen(false)} to="/contactus" className="header-menu-btn">Contact Us</Link>
                {!user && (
                    <>
                        <Link onClick={() => setOpen(false)} to="/signin" className="header-menu-btn">Sign In</Link>
                        <Link onClick={() => setOpen(false)} to="/account" className="header-menu-btn">Create Account</Link>
                    </>
                )}
                {isCustomer && (
                    <Link onClick={() => setOpen(false)} to="/my-account" className="header-menu-btn">My Account</Link>
                )}
                {user && (
                    <button onClick={handleLogout} className="header-menu-btn logout-btn">Logout</button>
                )}
            </nav>
        </header>
    );
}
