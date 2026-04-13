import "./Services.css";
import ServiceCard from "./ServiceCard";
import { useEffect } from "react";
import { useService } from "../../../contexts/ServiceContext";

export default function Services() {
    const { services, fetchServices } = useService();

    useEffect(() => {
        fetchServices();
    }, []);

    return (
        <section className="services-page">
            <h1 className="services-title">Our Services</h1>
                <p className="services-description">
                    We offer a wide range of construction services including general contracting,
                    renovations, structural work, and project management. Our team ensures every
                    project is completed with precision and reliability.
                </p>
            <div className="services-wrapper">
                {services.map(service => (
                    <ServiceCard key={service.id} service={service} />
                ))}
            </div>
        </section>
    );
}
