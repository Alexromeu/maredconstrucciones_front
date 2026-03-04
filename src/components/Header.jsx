import { Link } from "react-router-dom"
import  logo  from "../assets/logo.svg"
import "../styles/header.css"

export default function Header() {
    return <>
        <header className="header-container">
            <Link className="logo-home-link" to="/">
                <img className="logo-header" src={logo} alt="Logo"></img>
            </Link>

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