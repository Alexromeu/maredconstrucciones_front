import { useState, useEffect, useContext } from "react";

export default function ServiceCard({ service }) {
    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
        if (!expanded) return;

        const timer = setTimeout(() => {
        setExpanded(false);
        }, 5000);

        return () => clearTimeout(timer);
    }, [expanded]);

    return (
        <div 
        className="service-card" 
        onClick={() => setExpanded(true)}
        >
        <img src={service.image_url} alt={service.title} className="service-image" />
        <h3>{service.title}</h3>
        <p className={`service-descrption ${expanded ? "expanded" : ""}`}>{service.description}</p>
        </div>
    );
}