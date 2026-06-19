import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SectionHeading from '../common/SectionHeading';
import CardGrid from '../common/CardGrid';
import Loader from '../common/Loader';
import { getServices } from '../../services/homeService';
import '../../css/services-section.css';

function ServiceCard({ slug, title, description, category }) {
  return (
    <div className="service-card">
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
