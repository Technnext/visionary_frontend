import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageHero from '../components/common/PageHero';
import SectionHeading from '../components/common/SectionHeading';
import CardGrid from '../components/common/CardGrid';
import CTABanner from '../components/common/CTABanner';
import Loader from '../components/common/Loader';
import { getAllServices } from '../services/servicesService';
import { getCtaSection } from '../services/ctaSectionService';
import { getHeroSection } from '../services/heroSectionService';
import '../css/services-page.css';

const ARROW_ICON = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);

const FALLBACK_HERO = {
  eyebrow: 'Our Services',
  title: 'End-to-End Solutions for Enterprise Transformation',
  subtitle: 'From front-office customer experience to back-office automation and analytics, we deliver services that create lasting value across your entire operation.',
};

const FALLBACK_CTA = {
  title: 'Not Sure Which Service Fits Your Needs?',
  description: 'Our experts will help you identify the right solution for your business challenges.',
  primaryButtonText: 'Speak to an Expert',
  primaryButtonUrl: '/contact',
  secondaryButtonText: 'Explore Industries',
  secondaryButtonUrl: '/industries',
};

function ServiceCardFull({ slug, title, description, category, benefits = [] }) {
  return (
    <div className="service-card-full">
      <div className="service-card-full__image">
        <img src={`/images/services/${slug}.jpg`} alt={title} loading="lazy" />
      </div>
      <div className="service-card-full__header">
        <div className="service-card-full__meta">
          {category && <span className="service-card-full__category">{category}</span>}
          <h3 className="service-card-full__title">{title}</h3>
        </div>
      </div>
      <div className="service-card-full__body">
        <p className="service-card-full__description">{description}</p>
        {benefits.length > 0 && (
          <ul className="service-card-full__benefits">
            {benefits.slice(0, 3).map((b) => (
              <li key={b.id} className="service-card-full__benefit">
                <span className="service-card-full__benefit-dot" />
                {b.title}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="service-card-full__footer">
        <Link to={`/services/${slug}`} className="service-card-full__link">
          Learn More
          <span className="service-card-full__link-arrow">{ARROW_ICON}</span>
        </Link>
      </div>
    </div>
  );
}

export default function ServicesPage() {
  const [services, setServices]           = useState([]);
  const [loading, setLoading]             = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [cta, setCta]                     = useState(FALLBACK_CTA);
  const [hero, setHero]                   = useState(FALLBACK_HERO);

  useEffect(() => {
    getAllServices()
      .then((res) => setServices(res.data || []))
      .catch(() => setServices([]))
      .finally(() => setLoading(false));

    getCtaSection('services')
      .then((res) => { if (res.data) setCta(res.data); })
      .catch(() => {});

    getHeroSection('services')
      .then((res) => { if (res.data) setHero(res.data); })
      .catch(() => {});
  }, []);

  const categories = ['All', ...new Set(services.map((s) => s.category).filter(Boolean))];

  const filtered = activeCategory === 'All'
    ? services
    : services.filter((s) => s.category === activeCategory);

  return (
    <div className="services-page">
      <PageHero
        eyebrow={hero.eyebrow}
        title={hero.title}
        description={hero.subtitle}
      />

      <div className="services-filter">
        <div className="services-filter__container">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`services-filter__tab${activeCategory === cat ? ' services-filter__tab--active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <section className="services-grid-section">
        <div className="services-grid-section__container">
          <SectionHeading
            eyebrow={activeCategory === 'All' ? 'All Services' : activeCategory}
            title={activeCategory === 'All' ? 'Everything We Do' : `${activeCategory} Services`}
            subtitle={`Showing ${filtered.length} service${filtered.length !== 1 ? 's' : ''}`}
          />

          {loading ? (
            <Loader />
          ) : filtered.length === 0 ? (
            <p className="services-empty">No services found in this category.</p>
          ) : (
            <CardGrid columns={3}>
              {filtered.map((svc) => (
                <ServiceCardFull
                  key={svc.id}
                  slug={svc.slug}
                  title={svc.title}
                  description={svc.description}
                  category={svc.category}
                  benefits={svc.benefits || []}
                />
              ))}
            </CardGrid>
          )}
        </div>
      </section>

      <CTABanner
        title={cta.title}
        subtitle={cta.description}
        primaryLabel={cta.primaryButtonText}
        primaryTo={cta.primaryButtonUrl}
        secondaryLabel={cta.secondaryButtonText}
        secondaryTo={cta.secondaryButtonUrl}
      />
    </div>
  );
}
