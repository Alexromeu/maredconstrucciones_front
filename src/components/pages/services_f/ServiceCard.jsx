import { useState, useEffect } from "react";

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
            onClick={() => setExpanded(prev => !prev)}
        >
            {service.image_url ? (
                <img src={service.image_url} alt={service.name} className="service-image" />
            ) : (
                <div className="service-image-placeholder" />
            )}
            <h3>{service.name}</h3>
            <p className="service-price">
                From <strong>${Number(service.base_price).toLocaleString()}</strong>
                {service.unit && <span className="service-unit"> / {service.unit}</span>}
            </p>
            <p className={`service-description ${expanded ? "expanded" : ""}`}>
                {service.description}
            </p>
        </div>
    );
}
