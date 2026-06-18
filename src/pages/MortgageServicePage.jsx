import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMortgageServiceBySlug, getMortgageServices } from '../services/mortgageServicesService';
import { getCtaSection } from '../services/ctaSectionService';
import { getHeroSection } from '../services/heroSectionService';
import Loader from '../components/common/Loader';
import '../css/service-detail-page.css';

const ICON_ARROW = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);
const ICON_CHECK = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const ICON_GLOBE = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
);
const ICON_SHIELD = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);
const ICON_USERS = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const ICON_AWARD = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
  </svg>
);

const BENEFIT_ICONS = [
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
];

const FALLBACK_GLOBAL_STATS = [
  { value: '20+',  label: 'Global Clients',     sub: 'Across industries' },
  { value: '99%',  label: 'Client Retention',   sub: 'Year-on-year' },
  { value: '24/7', label: 'Global Delivery',    sub: 'Follow-the-sun model' },
  { value: '4+',   label: 'Years of Expertise', sub: 'Enterprise-grade delivery' },
];

const FALLBACK_CTA = {
  title: 'Ready to Transform Your {name} Operations?',
  description: 'Our specialists are ready to design a solution tailored to your exact business requirements and commercial objectives.',
  primaryButtonText: 'Speak with an Expert',
  primaryButtonUrl: '/contact',
  secondaryButtonText: 'Request Consultation',
  secondaryButtonUrl: '/contact?type=consultation',
};

const FALLBACK_HERO_BUTTONS = {
  primaryButtonText: 'Speak with an Expert',
  primaryButtonUrl: '/contact',
  secondaryButtonText: 'Request Consultation',
  secondaryButtonUrl: '/contact?type=consultation',
};

const HOW_WE_HELP = [
  { number: '01', phase: 'Assess',    title: 'Understand Your Current State', body: 'We begin with a structured discovery to baseline your current operations, identify gaps, and quantify the opportunity.' },
  { number: '02', phase: 'Design',    title: 'Build the Right Solution',       body: 'Our architects and domain experts co-design a solution blueprint aligned to your commercial objectives and operating model.' },
  { number: '03', phase: 'Implement', title: 'Deliver with Precision',         body: 'Agile delivery squads execute against a clear roadmap, with continuous stakeholder alignment and transparent progress reporting.' },
  { number: '04', phase: 'Optimise',  title: 'Continuously Improve',           body: 'Post-deployment, we monitor, measure, and refine — ensuring outcomes compound over time and your investment keeps delivering.' },
];

const OUTCOMES = [
  { icon: ICON_ARROW, metric: 'Up to 3× faster',      title: 'Accelerated Time-to-Value',  body: 'Structured delivery methodology and pre-built accelerators cut programme setup time, enabling measurable outcomes within the first quarter.' },
  { icon: ICON_CHECK, metric: '30–60% cost reduction', title: 'Measurable Cost Reduction',   body: 'Process automation and global delivery models consistently deliver significant reductions in operational cost — with full transparency on ROI.' },
  { icon: ICON_GLOBE, metric: 'India-based delivery',  title: 'Focused Scale & Resilience',  body: 'India-based delivery and elastic capacity models ensure continuity and performance at peak demand, across every time zone.' },
  { icon: ICON_AWARD, metric: 'SLA-bound delivery',    title: 'Quality You Can Measure',     body: 'Every engagement is governed by SLA-bound quality frameworks, continuous improvement cycles, and executive-level reporting dashboards.' },
];

const WHY_US = [
  { icon: ICON_USERS,  heading: 'Deep Domain Expertise',  points: ['Mortgage-trained delivery teams', 'Industry-specific process frameworks', 'Regulatory and compliance fluency'] },
  { icon: ICON_GLOBE,  heading: 'Delivery Model',          points: ['India-based delivery centres', 'Follow-the-sun operations', 'Multilingual capability'] },
  { icon: ICON_SHIELD, heading: 'Security & Compliance',   points: ['ISO 27001 & SOC 2 Type II certified', 'RESPA, TILA, CFPB aligned processes', 'Regular third-party security audits'] },
  { icon: ICON_AWARD,  heading: 'Recognised Excellence',   points: ['Everest Group PEAK Matrix Leader', 'Gartner Magic Quadrant recognised', 'Great Place to Work certified'] },
];

function NotFound() {
  return (
    <div className="sdp-not-found">
      <h2>Service Not Found</h2>
      <p>The service you are looking for does not exist or has been moved.</p>
      <Link to="/" className="btn btn--primary">Back to Home</Link>
    </div>
  );
}

export default function MortgageServicePage() {
  const { slug } = useParams();
  const [service,  setService]  = useState(null);
  const [related,  setRelated]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [cta,      setCta]      = useState(FALLBACK_CTA);
  const [heroButtons, setHeroButtons] = useState(FALLBACK_HERO_BUTTONS);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    getMortgageServiceBySlug(slug)
      .then((res) => setService(res.data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));

    getCtaSection('mortgage_service_detail')
      .then((res) => { if (res.data) setCta(res.data); })
      .catch(() => {});

    getHeroSection('mortgage_service_detail')
      .then((res) => { if (res.data) setHeroButtons(res.data); })
      .catch(() => {});
  }, [slug]);

  useEffect(() => {
    if (!service) return;
    getMortgageServices()
      .then((res) => {
        const all = res.data || [];
        const sameCategory = all.filter((s) => s.slug !== slug && s.category === service.category);
        const others = all.filter((s) => s.slug !== slug && s.category !== service.category);
        setRelated([...sameCategory, ...others].slice(0, 3));
      })
      .catch(() => {});
  }, [service, slug]);

  if (loading) return <div className="sdp-loader-wrap"><Loader /></div>;
  if (notFound || !service) return <div className="sdp-loader-wrap"><NotFound /></div>;

  return (
    <div className="sdp">

      {/* ── 1. Hero ── */}
      <section
        className="sdp-hero"
        style={service.bannerUrl ? { backgroundImage: `url(${service.bannerUrl})` } : undefined}
      >
        <div className="sdp-hero__bg" aria-hidden="true" />
        <div className="sdp-hero__overlay" aria-hidden="true" />
        <div className="sdp-hero__container">

          <nav className="sdp-hero__breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span aria-hidden="true">›</span>
            <span>Services</span>
            <span aria-hidden="true">›</span>
            <span>{service.title}</span>
          </nav>

          <div className="sdp-hero__body">
            <div className="sdp-hero__content">
              <span className="sdp-hero__eyebrow">
                <span className="sdp-hero__eyebrow-dot" aria-hidden="true" />
                {service.category}
              </span>
              <h1 className="sdp-hero__title">{service.title}</h1>
              <p className="sdp-hero__summary">
                {service.description.slice(0, 240)}{service.description.length > 240 ? '…' : ''}
              </p>
              <div className="sdp-hero__actions">
                <Link to={heroButtons.primaryButtonUrl} className="sdp-hero__btn-primary">
                  {heroButtons.primaryButtonText}
                  <span className="sdp-btn-icon" aria-hidden="true">{ICON_ARROW}</span>
                </Link>
                <Link to={heroButtons.secondaryButtonUrl} className="sdp-hero__btn-secondary">
                  {heroButtons.secondaryButtonText}
                </Link>
              </div>
            </div>
            <div className="sdp-hero__trust">
              <p className="sdp-hero__trust-label">Trusted by enterprises across</p>
              <div className="sdp-hero__trust-grid">
                {FALLBACK_GLOBAL_STATS.map((s) => (
                  <div key={s.label} className="sdp-hero__trust-item">
                    <span className="sdp-hero__trust-value">{s.value}</span>
                    <span className="sdp-hero__trust-name">{s.label}</span>
                    <span className="sdp-hero__trust-sub">{s.sub}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="sdp-hero__stats">
            {FALLBACK_GLOBAL_STATS.map((s) => (
              <div key={s.label} className="sdp-hero__stat">
                <span className="sdp-hero__stat-value">{s.value}</span>
                <span className="sdp-hero__stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 2. Overview ── */}
      <section className="sdp-challenges">
        <div className="sdp-section-container">
          <div className="sdp-challenges__layout">
            <div className="sdp-challenges__left">
              <span className="sdp-eyebrow">Overview</span>
              <h2 className="sdp-section-title">About This Service</h2>
              {service.imageUrl && (
                <img
                  src={service.imageUrl}
                  alt={service.title}
                  className="msp-overview-img"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              )}
              <p className="sdp-section-sub">{service.overview}</p>
              <Link to="/contact" className="sdp-challenges__link">
                Discuss your requirements {ICON_ARROW}
              </Link>
            </div>
            <div className="sdp-challenges__cards">
              {(service.solutions || []).map((sol, i) => (
                <div key={i} className="sdp-challenge-card">
                  <span className="sdp-challenge-card__num">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <h3 className="sdp-challenge-card__title">{sol.title}</h3>
                    <p className="sdp-challenge-card__body">{sol.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Outcomes ── */}
      <section className="sdp-outcomes">
        <div className="sdp-section-container">
          <div className="sdp-section-header">
            <span className="sdp-eyebrow">Business Outcomes</span>
            <h2 className="sdp-section-title">Delivering Measurable Business Value</h2>
            <p className="sdp-section-sub">
              Every engagement is designed around commercial outcomes. Here is what clients consistently achieve.
            </p>
          </div>
          <div className="sdp-outcomes__grid">
            {OUTCOMES.map((o) => (
              <div key={o.title} className="sdp-outcome-card">
                <div className="sdp-outcome-card__top">
                  <div className="sdp-outcome-card__icon">{o.icon}</div>
                  <span className="sdp-outcome-card__metric">{o.metric}</span>
                </div>
                <h3 className="sdp-outcome-card__title">{o.title}</h3>
                <p className="sdp-outcome-card__body">{o.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. How We Help ── */}
      <section className="sdp-how">
        <div className="sdp-section-container">
          <div className="sdp-how__layout">
            <div className="sdp-how__left">
              <span className="sdp-eyebrow">Our Approach</span>
              <h2 className="sdp-section-title sdp-section-title--white">How We Deliver Results</h2>
              <p className="sdp-section-sub sdp-section-sub--white">
                A proven four-phase delivery model that takes you from current-state assessment through to sustained optimisation.
              </p>
              <Link to="/contact" className="sdp-how__cta">
                Start the conversation {ICON_ARROW}
              </Link>
            </div>
            <div className="sdp-how__steps">
              {HOW_WE_HELP.map((step) => (
                <div key={step.number} className="sdp-how-step">
                  <div className="sdp-how-step__num">{step.number}</div>
                  <div className="sdp-how-step__content">
                    <span className="sdp-how-step__phase">{step.phase}</span>
                    <h3 className="sdp-how-step__title">{step.title}</h3>
                    <p className="sdp-how-step__body">{step.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. Key Benefits ── */}
      <section className="sdp-benefits">
        <div className="sdp-section-container">
          <div className="sdp-section-header">
            <span className="sdp-eyebrow">Key Benefits</span>
            <h2 className="sdp-section-title">What Our {service.title} Service Delivers</h2>
            <p className="sdp-section-sub">
              Proven capabilities built through multiple mortgage industry engagements.
            </p>
          </div>
          <div className="sdp-benefits__grid">
            {(service.benefits || []).map((b, i) => (
              <div key={b.id} className="sdp-benefit-card">
                <div className="sdp-benefit-card__header">
                  <div className="sdp-benefit-card__icon">
                    {BENEFIT_ICONS[i % BENEFIT_ICONS.length]}
                  </div>
                  <span className="sdp-benefit-card__num">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <h3 className="sdp-benefit-card__title">{b.title}</h3>
                <p className="sdp-benefit-card__body">{b.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. Why Us ── */}
      <section className="sdp-why">
        <div className="sdp-section-container">
          <div className="sdp-section-header sdp-section-header--white">
            <span className="sdp-eyebrow sdp-eyebrow--accent">Why Visionary Inspire</span>
            <h2 className="sdp-section-title sdp-section-title--white">The Partner Enterprises Choose</h2>
            <p className="sdp-section-sub sdp-section-sub--white">
              4+ years of mortgage industry delivery experience and an unwavering commitment to measurable outcomes.
            </p>
          </div>
          <div className="sdp-why__grid">
            {WHY_US.map((w) => (
              <div key={w.heading} className="sdp-why-card">
                <div className="sdp-why-card__icon">{w.icon}</div>
                <h3 className="sdp-why-card__heading">{w.heading}</h3>
                <ul className="sdp-why-card__list">
                  {w.points.map((p) => (
                    <li key={p}>
                      <span className="sdp-why-card__check">{ICON_CHECK}</span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. Stats Strip ── */}
      <section className="sdp-stats-strip">
        <div className="sdp-section-container sdp-stats-strip__inner">
          {FALLBACK_GLOBAL_STATS.map((s) => (
            <div key={s.label} className="sdp-stats-strip__item">
              <span className="sdp-stats-strip__value">{s.value}</span>
              <span className="sdp-stats-strip__label">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── 8. Related Mortgage Services ── */}
      {related.length > 0 && (
        <section className="sdp-related">
          <div className="sdp-section-container">
            <div className="sdp-section-header">
              <span className="sdp-eyebrow">Explore Further</span>
              <h2 className="sdp-section-title">Related Mortgage Services</h2>
            </div>
            <div className="sdp-related__grid">
              {related.map((s) => (
                <Link key={s.slug} to={`/mortgage-services/${s.slug}`} className="sdp-related-card">
                  <div className="sdp-related-card__body">
                    <span className="sdp-related-card__category">{s.category}</span>
                    <h3 className="sdp-related-card__title">{s.title}</h3>
                    <p className="sdp-related-card__desc">{s.description.slice(0, 110)}…</p>
                  </div>
                  <span className="sdp-related-card__cta">
                    Explore Service {ICON_ARROW}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 9. CTA Band ── */}
      <section className="sdp-cta-band">
        <div className="sdp-cta-band__container">
          <div className="sdp-cta-band__content">
            <h2 className="sdp-cta-band__title">
              {cta.title.replace('{name}', service.title)}
            </h2>
            <p className="sdp-cta-band__sub">
              {cta.description}
            </p>
          </div>
          <div className="sdp-cta-band__actions">
            <Link to={cta.primaryButtonUrl} className="btn btn--primary sdp-cta-band__btn">
              {cta.primaryButtonText} {ICON_ARROW}
            </Link>
            <Link to={cta.secondaryButtonUrl} className="btn btn--outline-white sdp-cta-band__btn">
              {cta.secondaryButtonText}
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
