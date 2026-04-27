import "../../styles/main/footer_styles.css";

export default function Footer() {
    return (
        <footer className="footer-container">
            <div className="footer-wrapper">

                <div className="footer-logo-block">
                    <h2 className="footer-logo">MARED</h2>
                    <p className="footer-description">
                        Building with integrity, precision, and long‑lasting quality.
                    </p>
                </div>

                <div className="footer-links-block">
                    <h3 className="footer-title">Quick Links</h3>
                    <ul className="footer-links">
                        <li><a href="/#projects">Projects</a></li>
                        <li><a href="/services">Services</a></li>
                        <li><a href="/aboutus">About Us</a></li>
                        <li><a href="/contactus">Contact Us</a></li>
                    </ul>
                </div>

                <div className="footer-social-block">
                    <h3 className="footer-title">Follow Us</h3>
                    <ul className="footer-social">
                        <li><a href="#">Facebook</a></li>
                        <li><a href="#">Instagram</a></li>
                        <li><a href="#">LinkedIn</a></li>
                    </ul>
                </div>

            </div>

            <div className="footer-bottom">
                <p>© {new Date().getFullYear()} MARED Construction. All rights reserved.</p>
            </div>
        </footer>
    );
}
