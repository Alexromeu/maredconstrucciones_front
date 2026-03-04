import "../../styles/main/presentation_section.css";

export default function PresentationSection() {
  return (
    <section className="home-presentation">
      <div className="presentation-wrapper">
        
        <div className="presentation-image">
          <img
            src="https://images.unsplash.com/photo-1581091012184-5c7b6c2a3f5b"
            alt="Construction site"
          />
        </div>

        <div className="presentation-content">
          <h2>Building With Integrity & Precision</h2>

          <p>
            We are a dedicated construction company committed to delivering
            high‑quality craftsmanship on every project. From residential homes
            to large commercial developments, our team brings decades of
            experience and a passion for excellence.
          </p>

          <p>
            Our mission is to create durable, beautiful structures that stand
            the test of time. We work closely with clients to ensure every
            project is completed safely, efficiently, and to the highest
            industry standards.
          </p>

          <button className="presentation-btn">Learn More</button>
        </div>

      </div>
    </section>
  );
}
