import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SectionHeading from '../common/SectionHeading';
import CardGrid from '../common/CardGrid';
import Loader from '../common/Loader';
import { getServices } from '../../services/homeService';
import '../../css/services-section.css';

const SERVICE_ICONS = {
  'customer-experience-management': (
    <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
  ),
  'digital-transformation': (
    <svg viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
  ),
  'data-and-analytics': (
    <svg viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
  ),
  'intelligent-automation': (
    <svg viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8"/><path d="M12 17v4"/></svg>
  ),
  'trust-and-safety': (
    <svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
  ),
};

const DEFAULT_ICON = (
  <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
);

function ServiceCard({ slug, title, description, category }) {
  return (
    <div className="service-card">
      <div className="service-card__icon">
        {SERVICE_ICONS[slug] || DEFAULT_ICON}
      </div>
      {category && <span className="service-card__category">{category}</span>}
      <h3 className="service-card__title">{title}</h3>
      <p className="service-card__description">{description}</p>
      <Link to={`/services/${slug}`} className="service-card__link">
        Learn More
        <svg className="service-card__link-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
        </svg>
      </Link>
    </div>
  );
}

export default function ServicesSection() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getServices()
      .then((res) => setServices(res.data || []))
      .catch(() => setServices([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="services-section">
      <div className="services-section__container">
        <SectionHeading
          eyebrow="What We Do"
          title="Services Built for Enterprise Scale"
          subtitle="From customer experience transformation to intelligent automation, we deliver end-to-end solutions that drive measurable business outcomes."
        />

        {loading ? (
          <Loader />
        ) : (
          <CardGrid columns={3}>
            {services.map((svc) => (
              <ServiceCard
                key={svc.id}
                slug={svc.slug}
                title={svc.title}
                description={svc.description}
                category={svc.category}
              />
            ))}
          </CardGrid>
        )}

        <div className="services-section__footer">
          <Link to="/services" className="btn btn--outline">View All Services</Link>
        </div>
      </div>
    </section>
  );
}
