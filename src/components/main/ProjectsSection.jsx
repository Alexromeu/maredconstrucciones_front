import { useEffect } from "react";
import "../../styles/main/projects_section.css";

const projects = [
  {
    image: "/hero-background.jpg",
    title: "Riverside Residences",
    description: "Luxury riverside apartments featuring contemporary design, panoramic views, and sustainable materials throughout.",
  },
  {
    image: "/hero-background2.jpg",
    title: "Downtown Office Tower",
    description: "A 24‑story commercial tower delivered on schedule with LEED Gold certification and modern tenant amenities.",
  },
  {
    image: "/hero-background3.jpg",
    title: "Industrial Logistics Hub",
    description: "Large‑scale warehouse and distribution complex built for durability, safety, and efficient workflow operations.",
  },
  {
    image: "/background3.jpg",
    title: "Coastal Villa Project",
    description: "Custom‑built coastal residence with weather‑resistant finishes and a seamless indoor‑outdoor design language.",
  },
  {
    image: "/background4.jpg",
    title: "Civic Renovation",
    description: "Structural restoration and modernization of a historic civic building while preserving its original character.",
  },
  {
    image: "/background5.jpg",
    title: "Mixed‑Use Development",
    description: "Retail, office, and residential spaces integrated into a vibrant urban block serving the surrounding community.",
  },
];

export default function ProjectsSection() {
  useEffect(() => {
    if (window.location.hash === "#projects") {
      setTimeout(() => {
        document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
      }, 50);
    }
  }, []);

  return (
    <section id="projects" className="projects-section">
      <div className="projects-section-wrapper">
        <h2 className="projects-section-title">Our Projects</h2>
        <p className="projects-section-subtitle">
          A selection of completed and ongoing work across residential, commercial, and industrial sectors.
        </p>

        <div className="projects-grid">
          {projects.map((p) => (
            <article key={p.title} className="project-card">
              <img src={p.image} alt={p.title} className="project-card-image" />
              <div className="project-card-overlay">
                <h3 className="project-card-title">{p.title}</h3>
                <p className="project-card-description">{p.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
