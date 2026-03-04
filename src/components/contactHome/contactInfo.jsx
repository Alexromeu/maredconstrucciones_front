import "../../styles/main/contactInfo.css";

export default function ContactInfo() {
    return (
        <section className="contact-info-section">
            <div className="contact-info-wrapper">

                <div className="contact-info-block">
                    <h3 className="contact-info-title">Phone</h3>
                    <p className="contact-info-text">+1 (000) 123‑4567</p>
                </div>

                <div className="contact-info-block">
                    <h3 className="contact-info-title">Email</h3>
                    <p className="contact-info-text">info@company.com</p>
                </div>

                <div className="contact-info-block">
                    <h3 className="contact-info-title">Address</h3>
                    <p className="contact-info-text">123 Main Street, City, State</p>
                </div>

                <div className="contact-info-block">
                    <h3 className="contact-info-title">Working Hours</h3>
                    <p className="contact-info-text">Mon – Fri: 8:00 AM – 6:00 PM</p>
                </div>

            </div>
        </section>
    );
}
