import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SectionHeading from '../common/SectionHeading';
import CardGrid from '../common/CardGrid';
import Loader from '../common/Loader';
import { getIndustries } from '../../services/homeService';
import '../../css/industries-section.css';

const INDUSTRY_ICONS = {
  'banking-financial-services': (
    <svg viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
  ),
  'healthcare': (
    <svg viewBox="0 0 24 24"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
  ),
  'telecommunications': (
    <svg viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.28h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.84a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
  ),
  'retail-ecommerce': (
    <svg viewBox="0 0 24 24"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
  ),
  'media-entertainment': (
    <svg viewBox="0 0 24 24"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>
  ),
};

const DEFAULT_ICON = (
  <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
);

function IndustryCard({ slug, title, description }) {
  return (
    <div className="industry-card">
      <div className="industry-card__header">
        <div className="industry-card__icon">
          {INDUSTRY_ICONS[slug] || DEFAULT_ICON}
        </div>
        <h3 className="industry-card__title">{title}</h3>
      </div>
      <div className="industry-card__body">
        <p className="industry-card__description">{description}</p>
        <Link to={`/industries/${slug}`} className="industry-card__link">
          Explore Industry
          <svg className="industry-card__link-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
          </svg>
        </Link>
      </div>
    </div>
  );
}

export default function IndustriesSection() {
  const [industries, setIndustries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getIndustries()
      .then((res) => setIndustries(res.data || []))
      .catch(() => setIndustries([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="industries-section">
      <div className="industries-section__container">
        <SectionHeading
          eyebrow="Industries We Serve"
          title="Deep Expertise Across Key Sectors"
          subtitle="We bring specialised knowledge and proven delivery frameworks to the industries that matter most — helping clients navigate complexity with confidence."
        />

        {loading ? (
          <Loader />
        ) : (
          <CardGrid columns={3}>
            {industries.map((ind) => (
              <IndustryCard
                key={ind.id}
                slug={ind.slug}
                title={ind.title}
                description={ind.description}
              />
            ))}
          </CardGrid>
        )}

        <div className="industries-section__footer">
          <Link to="/industries" className="btn btn--outline">View All Industries</Link>
        </div>
      </div>
    </section>
  );
}
