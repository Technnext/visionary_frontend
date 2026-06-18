import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageHero from '../components/common/PageHero';
import SectionHeading from '../components/common/SectionHeading';
import CardGrid from '../components/common/CardGrid';
import CTABanner from '../components/common/CTABanner';
import Loader from '../components/common/Loader';
import { getAllIndustries } from '../services/industriesService';
import { getStatsByContext } from '../services/homeService';
import { getCtaSection } from '../services/ctaSectionService';
import { getHeroSection } from '../services/heroSectionService';
import '../css/industries-page.css';

const INDUSTRY_ICONS = {
  'banking-financial-services': (
    <svg viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
  ),
  'healthcare': (
    <svg viewBox="0 0 24 24"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
  ),
  'telecommunications': (
    <svg viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.35 2 2 0 0 1 3.6 1.28h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.84a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
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

const ARROW_ICON = (
  <svg className="industry-card-full__link-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);

const FALLBACK_OVERVIEW_STATS = [
  { value: '20+', label: 'Enterprise clients across all sectors' },
  { value: '4+',  label: 'Years of industry domain expertise' },
  { value: '99%', label: 'Client retention rate' },
];

const FALLBACK_HERO = {
  eyebrow: 'Industries We Serve',
  title: 'Deep Expertise Across the Sectors That Matter Most',
  subtitle: 'We bring specialised knowledge, proven delivery frameworks, and dedicated domain teams to the industries driving global economic growth.',
};

const FALLBACK_CTA = {
  title: 'Ready to Explore What We Can Do in Your Industry?',
  description: 'Our industry specialists are ready to discuss your specific challenges and opportunities.',
  primaryButtonText: 'Get in Touch',
  primaryButtonUrl: '/contact',
  secondaryButtonText: 'View Our Services',
  secondaryButtonUrl: '/services',
};

function IndustryCardFull({ slug, title, description, solutions = [] }) {
  return (
    <div className="industry-card-full">
      <div className="industry-card-full__image">
        <img src={`/images/industries/${slug}.jpg`} alt={title} loading="lazy" />
      </div>
      <div className="industry-card-full__header">
        <div className="industry-card-full__icon">
          {INDUSTRY_ICONS[slug] || DEFAULT_ICON}
        </div>
        <h3 className="industry-card-full__title">{title}</h3>
      </div>
      <div className="industry-card-full__body">
        <p className="industry-card-full__description">{description}</p>
        {solutions.length > 0 && (
          <>
            <span className="industry-card-full__solutions-label">Key Solutions</span>
            <div className="industry-card-full__solutions">
              {solutions.slice(0, 4).map((s) => (
                <span key={s.id} className="industry-card-full__solution-chip">{s.title}</span>
              ))}
            </div>
          </>
        )}
      </div>
      <div className="industry-card-full__footer">
        <Link to={`/industries/${slug}`} className="industry-card-full__link">
          Explore Industry {ARROW_ICON}
        </Link>
      </div>
    </div>
  );
}

export default function IndustriesPage() {
  const [industries, setIndustries]       = useState([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState(false);
  const [overviewStats, setOverviewStats] = useState(FALLBACK_OVERVIEW_STATS);
  const [cta, setCta]                     = useState(FALLBACK_CTA);
  const [hero, setHero]                   = useState(FALLBACK_HERO);

  useEffect(() => {
    getAllIndustries()
      .then((res) => setIndustries(res.data || []))
      .catch(() => setError(true))
      .finally(() => setLoading(false));

    getCtaSection('industries')
      .then((res) => { if (res.data) setCta(res.data); })
      .catch(() => {});

    getHeroSection('industries')
      .then((res) => { if (res.data) setHero(res.data); })
      .catch(() => {});

    getStatsByContext('global')
      .then((res) => {
        if (res.data?.length) {
          const data = res.data;
          const clients   = data.find((s) => s.label === 'Global Clients');
          const years     = data.find((s) => s.label === 'Years of Expertise');
          const retention = data.find((s) => s.label === 'Client Retention');
          setOverviewStats([
            { value: clients?.value   ?? '20+', label: 'Enterprise clients across all sectors' },
            { value: years?.value     ?? '4+',  label: 'Years of industry domain expertise' },
            { value: retention?.value ?? '99%', label: 'Client retention rate' },
          ]);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="industries-page">
      <PageHero
        eyebrow={hero.eyebrow}
        title={hero.title}
        description={hero.subtitle}
      />

      {/* ── Overview Strip ── */}
      <section className="industries-overview">
        <div className="industries-overview__container">
          <div className="industries-overview__content">
            <h2 className="industries-overview__title">
              Sector-Specific Solutions Built on Real Domain Knowledge
            </h2>
            <p className="industries-overview__body">
              Unlike generalist providers, Visionary Inspire builds dedicated practice
              areas for each industry we serve. Our teams understand regulatory
              requirements, competitive dynamics, and the operational challenges
              unique to your sector &mdash; so we can deliver value from day one.
            </p>
            <Link to="/contact" className="btn btn--primary">
              Speak to an Industry Expert
            </Link>
          </div>
          <div className="industries-overview__stats">
            {overviewStats.map((stat) => (
              <div key={stat.label} className="industries-overview__stat">
                <span className="industries-overview__stat-value">{stat.value}</span>
                <span className="industries-overview__stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Industries Grid ── */}
      <section className="industries-grid-section">
        <div className="industries-grid-section__container">
          <SectionHeading
            eyebrow="Our Industries"
            title="Every Sector. Every Challenge. One Partner."
            subtitle="Select an industry to explore the specific solutions, capabilities, and case studies relevant to your business."
          />
          {loading ? (
            <Loader />
          ) : error ? (
            <p className="industries-empty">Unable to load industries. Please try again later.</p>
          ) : (
            <CardGrid columns={3}>
              {industries.map((ind) => (
                <IndustryCardFull
                  key={ind.id}
                  slug={ind.slug}
                  title={ind.title}
                  description={ind.description}
                  solutions={ind.solutions || []}
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
