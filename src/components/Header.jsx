import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import logo from "../assets/logo1.png";
import "../styles/header.css";

export default function Header() {
    const [open, setOpen] = useState(false);
    const { user } = useAuth();

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

    // When logged in, the account icon links to the right dashboard.
    // When logged out, it goes to the sign-in page.
    const accountTarget =
        !user ? "/signin"
      : user.role_id === 3 ? "/my-account"
      : "/admin";

    const accountLabel =
        !user ? "Sign In"
      : user.role_id === 3 ? "My Account"
      : "Admin";

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
                    <Link to="/projects" className="header-menu-btn">Projects</Link>
                    <Link to="/services" className="header-menu-btn">Services</Link>
                    <Link to="/aboutus" className="header-menu-btn">About Us</Link>
                    <Link to="/contactus" className="header-menu-btn">Contact Us</Link>
                </div>
                <div className="account-btn-holder">
                    {!user && (
                        <Link to="/signin" className="header-menu-btn signin-btn">
                            Sign In
                        </Link>
                    )}
                    <Link
                        to={accountTarget}
                        className="header-menu-btn account-btn"
                        title={accountLabel}
                    ></Link>
                </div>
            </nav>


            <nav ref={menuRef} className={`mobile-menu ${open ? "show" : ""}`}>
                <Link onClick={() => setOpen(false)} to="/" className="header-menu-btn">Home</Link>
                <Link onClick={() => setOpen(false)} to="/projects" className="header-menu-btn">Projects</Link>
                <Link onClick={() => setOpen(false)} to="/services" className="header-menu-btn">Services</Link>
                <Link onClick={() => setOpen(false)} to="/aboutus" className="header-menu-btn">About Us</Link>
                <Link onClick={() => setOpen(false)} to="/contactus" className="header-menu-btn">Contact Us</Link>
                {!user && (
                    <Link onClick={() => setOpen(false)} to="/signin" className="header-menu-btn">Sign In</Link>
                )}
                <Link
                    onClick={() => setOpen(false)}
                    to={!user ? "/account" : accountTarget}
                    className="header-menu-btn"
                >
                    {!user ? "Create Account" : accountLabel}
                </Link>
            </nav>
        </header>
    );
}
