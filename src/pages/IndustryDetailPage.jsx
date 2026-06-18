import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Loader from '../components/common/Loader';
import { getIndustryBySlug } from '../services/industriesService';
import { getAllServices } from '../services/servicesService';
import { getStatsByContext } from '../services/homeService';
import { getCtaSection } from '../services/ctaSectionService';
import { getHeroSection } from '../services/heroSectionService';
import '../css/industry-detail-page.css';

// ─── SVG icons ────────────────────────────────────────────────────────────────
const ICON_ARROW  = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>;
const ICON_CHECK  = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const ICON_SHIELD = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const ICON_GLOBE  = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>;
const ICON_USERS  = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const ICON_AWARD  = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>;
const ICON_CHART  = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>;
const ICON_PULSE  = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>;

// Solution icon pool
const SOL_ICONS = [
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>,
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
];

// ─── Static data ──────────────────────────────────────────────────────────────
const FALLBACK_GLOBAL_STATS = [
  { value: '20+',  label: 'Global Clients',     sub: 'Across industries' },
  { value: '99%',  label: 'Client Retention',   sub: 'Year-on-year' },
  { value: '24/7', label: 'Global Delivery',    sub: 'Follow-the-sun model' },
  { value: '4+',   label: 'Years of Expertise', sub: 'Enterprise-grade delivery' },
];

const FALLBACK_CTA = {
  title: 'Ready to Transform Your {name} Operations?',
  description: "Our industry specialists are ready to design a solution built around your sector\u2019s specific regulatory environment, competitive pressures, and operational requirements.",
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

const FALLBACK_INDUSTRY_HIGHLIGHTS = {
  'banking-financial-services': [
    { value: '5+',    label: 'Banking & insurance clients' },
    { value: '99%',   label: 'Regulatory compliance rate' },
    { value: '40%',   label: 'Reduction in onboarding drop-off' },
    { value: '24/7',  label: 'Fraud operations coverage' },
  ],
  'healthcare': [
    { value: '4+',    label: 'Healthcare clients across payer & provider' },
    { value: '98%',   label: 'Claims accuracy rate' },
    { value: '35%',   label: 'Reduction in prior auth turnaround' },
    { value: 'HIPAA', label: 'Fully compliant operations' },
  ],
  'telecommunications': [
    { value: '3+',    label: 'Telecom operators supported' },
    { value: '60%',   label: 'First-call resolution improvement' },
    { value: '45%',   label: 'Reduction in churn through retention' },
    { value: '5G',    label: 'Ready delivery frameworks' },
  ],
  'retail-ecommerce': [
    { value: '5+',    label: 'Retail & e-commerce clients' },
    { value: '99.5%', label: 'Order processing accuracy' },
    { value: '3×',    label: 'Peak season scale-up capacity' },
    { value: '48h',   label: 'Average seller onboarding time' },
  ],
  'media-entertainment': [
    { value: '10+',   label: 'Languages moderated' },
    { value: '99.5%', label: 'Content review accuracy' },
    { value: '3+',    label: 'Streaming platform clients' },
    { value: '<2h',   label: 'Escalation response time' },
  ],
};

const SLUG_TO_CONTEXT = {
  'banking-financial-services': 'industry_bfs',
  'healthcare':                  'industry_healthcare',
  'telecommunications':          'industry_telecom',
  'retail-ecommerce':            'industry_retail',
  'media-entertainment':         'industry_media',
};

const CHALLENGES_BY_SLUG = {
  'banking-financial-services': [
    { title: 'Increasing Regulatory Complexity', body: 'AML, KYC, GDPR, and sector-specific mandates are evolving faster than internal teams can adapt, creating significant compliance risk.' },
    { title: 'Rising Fraud & Financial Crime', body: 'Sophisticated fraud vectors are outpacing legacy detection systems, requiring real-time intelligence and specialist analyst capability.' },
    { title: 'CX Gap vs Digital-Native Challengers', body: 'Traditional institutions are losing customers to fintechs that deliver frictionless digital experiences across every touchpoint.' },
  ],
  'healthcare': [
    { title: 'Revenue Cycle Inefficiency', body: 'High denial rates, slow reimbursement cycles, and manual billing processes are directly eroding margins across payer and provider organisations.' },
    { title: 'Regulatory & Compliance Burden', body: 'HIPAA, CMS, and state-specific requirements demand meticulous process governance that strains internal operations teams.' },
    { title: 'Patient Experience Under Pressure', body: 'Disconnected care journeys and reactive engagement models lead to poor satisfaction scores and reduced patient retention.' },
  ],
  'telecommunications': [
    { title: 'Subscriber Churn & Retention', body: 'Intense market competition and low switching costs mean that even minor service failures translate directly into subscriber attrition.' },
    { title: 'Cost-to-Serve Escalation', body: 'Legacy OSS/BSS environments and high-volume inbound contact drive operating costs that erode margins in an already low-ARPU market.' },
    { title: '5G & Digital Transformation Execution', body: 'Network evolution requires simultaneous modernisation of customer operations and back-office systems at significant organisational risk.' },
  ],
  'retail-ecommerce': [
    { title: 'Peak Season Operational Risk', body: 'Unpredictable demand spikes during peak periods expose fragile fulfilment, customer service, and returns operations to failure.' },
    { title: 'Marketplace Complexity at Scale', body: 'Managing thousands of sellers, SKUs, and fulfilment partners requires scalable operations that most internal teams cannot sustain.' },
    { title: 'Customer Expectation Inflation', body: 'Same-day delivery, instant resolution, and seamless returns are now baseline expectations that require enterprise-grade operational capability.' },
  ],
  'media-entertainment': [
    { title: 'Content Moderation at Platform Scale', body: 'User-generated content volumes are growing faster than manual review capacity, creating brand, legal, and regulatory exposure.' },
    { title: 'Subscriber Acquisition & Retention', body: 'Streaming market saturation means growth is increasingly driven by retention — requiring proactive engagement and churn prevention.' },
    { title: 'Rights & Compliance Complexity', body: 'Global content distribution across jurisdictions creates licensing, rights management, and localisation complexity that demands specialist operations.' },
  ],
};

const DEFAULT_CHALLENGES = [
  { title: 'Operational Cost Pressure', body: 'Manual, inefficient processes are consuming resources that should be directed at strategic, customer-facing priorities.' },
  { title: 'Talent & Capability Gaps', body: 'Building specialist capabilities in-house is costly and time-consuming — the market demands faster, more agile solutions.' },
  { title: 'Delivering on Digital Expectations', body: 'Customers and regulators alike are raising the bar on digital experience and compliance, requiring continuous transformation.' },
];

const HOW_WE_HELP_STEPS = [
  { number: '01', phase: 'Assess',     title: 'Understand Your Sector Context',     body: 'We begin with a structured discovery grounded in your industry — benchmarking your operations against sector best practice and quantifying the transformation opportunity.' },
  { number: '02', phase: 'Design',     title: 'Build an Industry-Fit Solution',     body: 'Our domain experts co-design a solution blueprint tailored to your sector\'s regulatory environment, competitive dynamics, and operational constraints.' },
  { number: '03', phase: 'Implement',  title: 'Deliver with Sector Precision',      body: 'Dedicated industry delivery teams execute against a clear roadmap — bringing pre-built frameworks that accelerate time-to-value while reducing delivery risk.' },
  { number: '04', phase: 'Optimise',   title: 'Compound Results Over Time',         body: 'We monitor sector-specific KPIs, continuously refine processes, and adapt to regulatory and market changes — ensuring your investment keeps delivering.' },
];

const OUTCOMES_BY_SLUG = {
  'banking-financial-services': [
    { metric: 'Up to 40%', title: 'Reduction in Onboarding Drop-off', body: 'Streamlined digital KYC and account opening journeys that convert more applicants while meeting full AML compliance.' },
    { metric: '99%+',      title: 'Regulatory Compliance Rate',       body: 'Governance frameworks and specialist teams ensuring zero-defect regulatory reporting and audit readiness at all times.' },
    { metric: '24/7',      title: 'Fraud Operations Coverage',         body: 'Round-the-clock analyst teams and AI signals ensuring rapid detection and response to financial crime attempts.' },
    { metric: '30–50%',    title: 'Improvement in Collections Recovery', body: 'Empathetic, compliant collections strategies powered by propensity modelling and omnichannel outreach.' },
  ],
  'healthcare': [
    { metric: 'Up to 35%', title: 'Reduction in Prior Auth Turnaround', body: 'Faster pre-authorisation processing that reduces delays in care delivery and improves patient outcomes.' },
    { metric: '98%+',      title: 'Claims Accuracy Rate',               body: 'Expert coding and adjudication teams ensuring accurate, compliant claims submission and accelerated reimbursement.' },
    { metric: '25%',       title: 'Reduction in Denials',               body: 'Proactive denial prevention through root-cause analysis and upstream workflow improvements.' },
    { metric: 'HIPAA',     title: 'Fully Compliant Operations',         body: 'All processes designed, operated, and audited to meet HIPAA requirements — with documented evidence for regulatory review.' },
  ],
  'telecommunications': [
    { metric: 'Up to 60%', title: 'Improvement in First-Call Resolution', body: 'Skilled technical support teams and AI-assisted diagnostics resolving subscriber issues faster and more permanently.' },
    { metric: '45%',       title: 'Reduction in Subscriber Churn',       body: 'Proactive retention programmes powered by churn propensity models and specialist retention specialists.' },
    { metric: '40%',       title: 'Reduction in Cost-to-Serve',          body: 'Digital deflection, self-service enablement, and process automation driving sustainable cost reduction.' },
    { metric: '5G-Ready',  title: 'Future-Proof Delivery Frameworks',   body: 'Operations designed to scale and adapt as 5G services are launched and subscriber expectations evolve.' },
  ],
  'retail-ecommerce': [
    { metric: '3×',        title: 'Peak Season Scale-Up Capacity',       body: 'Elastic operations that flex instantly to handle Black Friday and seasonal demand without quality compromise.' },
    { metric: '99.5%',     title: 'Order Processing Accuracy',           body: 'High-accuracy order management and exception handling across all fulfilment channels and seller types.' },
    { metric: '48h',       title: 'Average Seller Onboarding Time',      body: 'Rapid marketplace seller activation enabling faster GMV growth and stronger seller satisfaction.' },
    { metric: '30%',       title: 'Reduction in Returns Processing Cost', body: 'Streamlined reverse logistics and refund processing that preserves customer loyalty and reduces operational burden.' },
  ],
  'media-entertainment': [
    { metric: '30+',       title: 'Languages Moderated',                  body: 'Native-speaker reviewers ensuring culturally accurate policy enforcement across global platform user bases.' },
    { metric: '99.5%',     title: 'Content Review Accuracy',             body: 'Human-in-the-loop review delivering policy-compliant moderation at enterprise scale without compromising quality.' },
    { metric: '<2h',       title: 'Escalation Response Time',            body: 'Rapid escalation workflows ensuring high-severity content incidents are reviewed and resolved promptly.' },
    { metric: '20+',       title: 'Streaming Platform Clients',          body: 'Proven track record supporting subscriber growth, content moderation, and audience engagement at scale.' },
  ],
};

const DEFAULT_OUTCOMES = [
  { metric: '30–60%', title: 'Reduction in Operational Costs',    body: 'Process automation and global delivery models consistently deliver measurable cost reduction across all engagements.' },
  { metric: '3×',     title: 'Faster Time-to-Value',              body: 'Pre-built industry frameworks and structured delivery methodology enable faster deployment of solutions.' },
  { metric: '99%',    title: 'Client Retention Rate',             body: 'Our commitment to outcomes, not just outputs, is reflected in a near-perfect annual client retention rate.' },
  { metric: '24/7',   title: 'Global Operations Coverage',        body: 'Follow-the-sun delivery models ensuring continuous operations across every time zone your business operates in.' },
];

const TRUST_PILLARS = [
  {
    icon: ICON_SHIELD,
    heading: 'Compliance & Governance',
    points: ['ISO 27001 & SOC 2 Type II certified', 'GDPR, CCPA, and HIPAA aligned processes', 'Regular third-party security audits'],
  },
  {
    icon: ICON_USERS,
    heading: 'Deep Domain Expertise',
    points: ['Sector-trained delivery teams', 'Industry-specific process frameworks', 'Dedicated industry practice leads'],
  },
  {
    icon: ICON_GLOBE,
    heading: 'Global Delivery Capability',
    points: ['India-based delivery centres', 'Follow-the-sun operations', 'Multilingual capability'],
  },
  {
    icon: ICON_AWARD,
    heading: 'Recognised Excellence',
    points: ['Everest Group PEAK Matrix Leader', 'Gartner Magic Quadrant recognised', 'Great Place to Work certified'],
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────
function ChallengeCard({ title, body, index }) {
  return (
    <div className="idp-challenge-card">
      <span className="idp-challenge-card__num">{String(index + 1).padStart(2, '0')}</span>
      <div className="idp-challenge-card__content">
        <h3 className="idp-challenge-card__title">{title}</h3>
        <p className="idp-challenge-card__body">{body}</p>
      </div>
    </div>
  );
}

function SolutionCard({ sol, index }) {
  return (
    <div className="idp-solution-card">
      <div className="idp-solution-card__header">
        <div className="idp-solution-card__icon">
          {SOL_ICONS[index % SOL_ICONS.length]}
        </div>
        <span className="idp-solution-card__num">{String(index + 1).padStart(2, '0')}</span>
      </div>
      <h3 className="idp-solution-card__title">{sol.title}</h3>
      <p className="idp-solution-card__body">{sol.description}</p>
    </div>
  );
}

function OutcomeCard({ metric, title, body }) {
  return (
    <div className="idp-outcome-card">
      <span className="idp-outcome-card__metric">{metric}</span>
      <h3 className="idp-outcome-card__title">{title}</h3>
      <p className="idp-outcome-card__body">{body}</p>
    </div>
  );
}

function RelatedServiceCard({ svc }) {
  return (
    <Link to={`/services/${svc.slug}`} className="idp-related-card">
      <div className="idp-related-card__body">
        <span className="idp-related-card__category">{svc.category}</span>
        <h3 className="idp-related-card__title">{svc.title}</h3>
        <p className="idp-related-card__desc">{svc.description?.slice(0, 110)}…</p>
      </div>
      <span className="idp-related-card__cta">
        Explore Service {ICON_ARROW}
      </span>
    </Link>
  );
}

function NotFound() {
  return (
    <div className="idp-not-found">
      <h2>Industry Not Found</h2>
      <p>The industry page you are looking for does not exist or has been moved.</p>
      <Link to="/industries" className="btn btn--primary">Back to Industries</Link>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function IndustryDetailPage() {
  const { slug } = useParams();
  const [industry, setIndustry]       = useState(null);
  const [services, setServices]       = useState([]);
  const [loading,  setLoading]        = useState(true);
  const [notFound, setNotFound]       = useState(false);
  const [globalStats, setGlobalStats] = useState(FALLBACK_GLOBAL_STATS);
  const [highlights, setHighlights]   = useState(
    FALLBACK_INDUSTRY_HIGHLIGHTS[slug] ?? FALLBACK_GLOBAL_STATS.map((s) => ({ value: s.value, label: s.label }))
  );
  const [cta, setCta]                 = useState(FALLBACK_CTA);
  const [heroButtons, setHeroButtons] = useState(FALLBACK_HERO_BUTTONS);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    setIndustry(null);
    setServices([]);
    setHighlights(
      FALLBACK_INDUSTRY_HIGHLIGHTS[slug] ?? FALLBACK_GLOBAL_STATS.map((s) => ({ value: s.value, label: s.label }))
    );

    Promise.all([getIndustryBySlug(slug), getAllServices()])
      .then(([indRes, svcRes]) => {
        setIndustry(indRes.data);
        setServices(svcRes.data || []);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));

    getStatsByContext('global')
      .then((res) => { if (res.data?.length) setGlobalStats(res.data); })
      .catch(() => {});

    const ctx = SLUG_TO_CONTEXT[slug];
    if (ctx) {
      getStatsByContext(ctx)
        .then((res) => { if (res.data?.length) setHighlights(res.data); })
        .catch(() => {});
    }

    getCtaSection('industry_detail')
      .then((res) => { if (res.data) setCta(res.data); })
      .catch(() => {});

    getHeroSection('industry_detail')
      .then((res) => { if (res.data) setHeroButtons(res.data); })
      .catch(() => {});
  }, [slug]);

  if (loading)               return <div className="idp-loader-wrap"><Loader /></div>;
  if (notFound || !industry) return <div className="idp-loader-wrap"><NotFound /></div>;

  const solutions   = industry.solutions || [];
  const challenges  = CHALLENGES_BY_SLUG[slug] || DEFAULT_CHALLENGES;
  const outcomes    = OUTCOMES_BY_SLUG[slug]   || DEFAULT_OUTCOMES;
  const relatedSvcs = services.slice(0, 3);

  return (
    <div className="idp">

      {/* ── 1. Hero ───────────────────────────────────────────────────────── */}
      <section
        className="idp-hero"
        style={industry.bannerUrl ? { backgroundImage: `url(${industry.bannerUrl})` } : undefined}
      >
        <div className="idp-hero__bg"      aria-hidden="true" />
        <div className="idp-hero__overlay" aria-hidden="true" />
        <div className="idp-hero__container">

          <nav className="idp-hero__breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span aria-hidden="true">›</span>
            <Link to="/industries">Industries</Link>
            <span aria-hidden="true">›</span>
            <span>{industry.title}</span>
          </nav>

          <div className="idp-hero__body">
            <div className="idp-hero__content">
              <span className="idp-hero__eyebrow">
                <span className="idp-hero__eyebrow-dot" aria-hidden="true" />
                Industries We Serve
              </span>
              <h1 className="idp-hero__title">{industry.title}</h1>
              <p className="idp-hero__summary">
                {industry.description?.slice(0, 240)}
                {industry.description?.length > 240 ? '…' : ''}
              </p>
              <div className="idp-hero__actions">
                <Link to={heroButtons.primaryButtonUrl} className="idp-hero__btn-primary">
                  {heroButtons.primaryButtonText}
                  <span className="idp-btn-icon" aria-hidden="true">{ICON_ARROW}</span>
                </Link>
                <Link to={heroButtons.secondaryButtonUrl} className="idp-hero__btn-secondary">
                  {heroButtons.secondaryButtonText}
                </Link>
              </div>
            </div>

            {/* Stats panel */}
            <div className="idp-hero__trust">
              <p className="idp-hero__trust-label">Our {industry.title} track record</p>
              <div className="idp-hero__trust-grid">
                {highlights.map((h) => (
                  <div key={h.label} className="idp-hero__trust-item">
                    <span className="idp-hero__trust-value">{h.value}</span>
                    <span className="idp-hero__trust-name">{h.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="idp-hero__stats">
            {globalStats.map((s) => (
              <div key={s.label} className="idp-hero__stat">
                <span className="idp-hero__stat-value">{s.value}</span>
                <span className="idp-hero__stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 2. Industry Challenges ────────────────────────────────────────── */}
      <section className="idp-challenges">
        <div className="idp-section-container">
          <div className="idp-challenges__layout">
            <div className="idp-challenges__left">
              <span className="idp-eyebrow">The Challenge</span>
              <h2 className="idp-section-title">What {industry.title} Organisations Face</h2>
              <p className="idp-section-sub">
                We have partnered with leading organisations across {industry.title} since our founding. These are the challenges we encounter most — and solve most consistently.
              </p>
              <Link to="/contact" className="idp-challenges__link">
                Discuss your challenges {ICON_ARROW}
              </Link>
            </div>
            <div className="idp-challenges__cards">
              {challenges.map((c, i) => (
                <ChallengeCard key={c.title} {...c} index={i} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. How We Help ───────────────────────────────────────────────── */}
      <section className="idp-how">
        <div className="idp-section-container">
          <div className="idp-how__layout">
            <div className="idp-how__left">
              <span className="idp-eyebrow">Our Approach</span>
              <h2 className="idp-section-title idp-section-title--white">
                How We Deliver for {industry.title}
              </h2>
              <p className="idp-section-sub idp-section-sub--white">
                A proven four-phase model — grounded in deep industry knowledge — that takes you from current-state assessment through to sustained, compounding improvement.
              </p>
              <Link to="/contact" className="idp-how__cta">
                Start the conversation {ICON_ARROW}
              </Link>
            </div>
            <div className="idp-how__steps">
              {HOW_WE_HELP_STEPS.map((step) => (
                <div key={step.number} className="idp-how-step">
                  <div className="idp-how-step__num">{step.number}</div>
                  <div className="idp-how-step__content">
                    <span className="idp-how-step__phase">{step.phase}</span>
                    <h3 className="idp-how-step__title">{step.title}</h3>
                    <p className="idp-how-step__body">{step.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. Solutions ─────────────────────────────────────────────────── */}
      {solutions.length > 0 && (
        <section className="idp-solutions">
          <div className="idp-section-container">
            <div className="idp-section-header">
              <span className="idp-eyebrow">What We Deliver</span>
              <h2 className="idp-section-title">Solutions for {industry.title}</h2>
              <p className="idp-section-sub">
                Proven capabilities designed specifically for the challenges and regulatory context of your sector — not repurposed generic services.
              </p>
            </div>
            <div className="idp-solutions__grid">
              {solutions.map((sol, i) => (
                <SolutionCard key={sol.id} sol={sol} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 5. Industry Outcomes ─────────────────────────────────────────── */}
      <section className="idp-outcomes">
        <div className="idp-section-container">
          <div className="idp-section-header">
            <span className="idp-eyebrow">Business Outcomes</span>
            <h2 className="idp-section-title">What Clients in {industry.title} Achieve</h2>
            <p className="idp-section-sub">
              Real results delivered for real clients — KPIs and outcomes that reflect our commitment to measurable impact, not just activity.
            </p>
          </div>
          <div className="idp-outcomes__grid">
            {outcomes.map((o) => (
              <OutcomeCard key={o.title} {...o} />
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. Trust & Expertise ─────────────────────────────────────────── */}
      <section className="idp-trust">
        <div className="idp-section-container">
          <div className="idp-section-header idp-section-header--white">
            <span className="idp-eyebrow idp-eyebrow--accent">Why Visionary Inspire</span>
            <h2 className="idp-section-title idp-section-title--white">
              The Partner {industry.title} Leaders Choose
            </h2>
            <p className="idp-section-sub idp-section-sub--white">
              4+ years of deep industry commitment, a focused delivery footprint, and an uncompromising focus on compliance and measurable results.
            </p>
          </div>
          <div className="idp-trust__grid">
            {TRUST_PILLARS.map((pillar) => (
              <div key={pillar.heading} className="idp-trust-card">
                <div className="idp-trust-card__icon">{pillar.icon}</div>
                <h3 className="idp-trust-card__heading">{pillar.heading}</h3>
                <ul className="idp-trust-card__list">
                  {pillar.points.map((p) => (
                    <li key={p}>
                      <span className="idp-trust-card__check">{ICON_CHECK}</span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. Statistics Strip ──────────────────────────────────────────── */}
      <section className="idp-stats-strip">
        <div className="idp-section-container idp-stats-strip__inner">
          {globalStats.map((s) => (
            <div key={s.label} className="idp-stats-strip__item">
              <span className="idp-stats-strip__value">{s.value}</span>
              <span className="idp-stats-strip__label">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── 8. Related Services ──────────────────────────────────────────── */}
      {relatedSvcs.length > 0 && (
        <section className="idp-related">
          <div className="idp-section-container">
            <div className="idp-section-header">
              <span className="idp-eyebrow">Services We Apply</span>
              <h2 className="idp-section-title">The Services That Power Our {industry.title} Work</h2>
              <p className="idp-section-sub">
                Our horizontal service capabilities are applied with deep industry context to deliver outcomes that matter to your specific sector.
              </p>
            </div>
            <div className="idp-related__grid">
              {relatedSvcs.map((svc) => (
                <RelatedServiceCard key={svc.id} svc={svc} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 9. CTA Band ──────────────────────────────────────────────────── */}
      <section className="idp-cta-band">
        <div className="idp-cta-band__container">
          <div className="idp-cta-band__content">
            <h2 className="idp-cta-band__title">
              {cta.title.replace('{name}', industry.title)}
            </h2>
            <p className="idp-cta-band__sub">
              {cta.description}
            </p>
          </div>
          <div className="idp-cta-band__actions">
            <Link to={cta.primaryButtonUrl} className="idp-cta-band__btn idp-cta-band__btn--primary">
              {cta.primaryButtonText}
              <span className="idp-btn-icon" aria-hidden="true">{ICON_ARROW}</span>
            </Link>
            <Link to={cta.secondaryButtonUrl} className="idp-cta-band__btn idp-cta-band__btn--outline">
              {cta.secondaryButtonText}
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
