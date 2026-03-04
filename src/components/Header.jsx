import { Link } from "react-router-dom"
import "../styles/header.css"

export default function Header() {
    return <>
        <header className="header-container">
            <img className="logo-header" src="http://" alt="Logo"></img>

            <div className="menu-container">
                <nav className="nav-menu">
                    <Link to="/" className="header-menu-btn">Home</Link>
                    <Link to="/projects" className="header-menu-btn">Projects</Link>
                    <Link to="/services" className="header-menu-btn">Services</Link>
                    <Link to="/aboutus" className="header-menu-btn">About Us</Link>
                    <Link to="/contactus" className="header-menu-btn">Contact Us</Link>
                </nav>
            </div>
        </header>
    </>
}