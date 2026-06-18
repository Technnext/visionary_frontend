import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageHero from '../components/common/PageHero';
import SectionHeading from '../components/common/SectionHeading';
import CardGrid from '../components/common/CardGrid';
import CTABanner from '../components/common/CTABanner';
import Loader from '../components/common/Loader';
import { getLeaders, getAwards } from '../services/aboutService';
import { getStatsByContext } from '../services/homeService';
import { getCtaSection } from '../services/ctaSectionService';
import { getHeroSection } from '../services/heroSectionService';
import '../css/about-page.css';

/* ─── Icons ─────────────────────────────────────────────────────────────── */
const TARGET_ICN  = <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>;
const EYE_ICN     = <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
const HEART_ICN   = <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>;
const MAP_ICN     = <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;
const AWARD_ICN   = <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>;
const LI_ICN      = <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>;

/* ─── Fallbacks ──────────────────────────────────────────────────────────── */
const FALLBACK_OVERVIEW_STATS = [
  { value: '4', suffix: '+', label: 'Years of enterprise expertise', accent: false },
  { value: '20', suffix: '+', label: 'Global enterprise clients', accent: true },
  { value: '11', suffix: 'K+', label: 'Professionals worldwide', accent: false },
];

const FALLBACK_GLOBAL_STATS = [
  { value: '3', suffix: '', label: 'Office Locations' },
  { value: '20', suffix: '+', label: 'Delivery centres' },
  { value: '10', suffix: '+', label: 'Nationalities' },
  { value: '24/7', suffix: '', label: 'Global coverage' },
];

const FALLBACK_CTA = {
  title: "Partner With a Team That\u2019s Invested in Your Success",
  description: "Let\u2019s talk about how Visionary Inspire can help you achieve your transformation goals.",
  primaryButtonText: 'Get in Touch',
  primaryButtonUrl: '/contact',
  secondaryButtonText: 'Explore Services',
  secondaryButtonUrl: '/services',
};

const FALLBACK_HERO = {
  eyebrow: 'About Us',
  title: '{years}+ Years of Transforming Global Enterprises',
  subtitle: 'Visionary Inspire is a business process and technology services company, partnering with leading enterprises to deliver outcomes that matter.',
};

/* ─── Static data ────────────────────────────────────────────────────────── */
const MISSION_CARDS = [
  {
    icon: TARGET_ICN,
    title: 'Our Mission',
    body: 'To partner with global enterprises in transforming their operations through a powerful combination of people expertise, process excellence, and technology innovation — delivering measurable outcomes that create lasting competitive advantage.',
  },
  {
    icon: EYE_ICN,
    title: 'Our Vision',
    body: 'To be the most trusted transformation partner for the world\'s leading enterprises — recognised for the quality of our people, the reliability of our delivery, and the depth of the value we create for every client we serve.',
  },
  {
    icon: HEART_ICN,
    title: 'Our Values',
    body: 'Integrity in every interaction. Accountability for every outcome. Empathy for every person — our clients, our colleagues, and the customers we serve together. These are not aspirations; they are the standards we hold ourselves to every day.',
  },
];

const GLOBAL_LOCATIONS = [
  'Chennai, India',
  'Hyderabad, India',
  'Bangalore, India',
];

/* ─── Helpers ────────────────────────────────────────────────────────────── */
function getInitials(name) {
  if (!name) return 'VI';
  return name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();
}

/* ─── Sub-components ─────────────────────────────────────────────────────── */
function MissionCard({ icon, title, body }) {
  return (
    <div className="mission-card">
      <div className="mission-card__icon">{icon}</div>
      <h3 className="mission-card__title">{title}</h3>
      <p className="mission-card__body">{body}</p>
    </div>
  );
}

function LeaderCard({ name, title, bio, photoUrl, linkedinUrl }) {
  const [imgFailed, setImgFailed] = useState(false);
  const hasPhoto = photoUrl?.trim() && !imgFailed;
  return (
    <div className="leader-card">
      {hasPhoto && (
        <div className="leader-card__avatar">
          <img
            src={photoUrl}
            alt={name}
            className="leader-card__avatar-img"
            onError={() => setImgFailed(true)}
          />
        </div>
      )}
      <div className="leader-card__body">
        <h3 className="leader-card__name">{name}</h3>
        <span className="leader-card__title">{title}</span>
        {bio && <p className="leader-card__bio">{bio}</p>}
      </div>
      <div className="leader-card__footer">
        <a
          href={linkedinUrl || '#'}
          className="leader-card__linkedin"
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${name} on LinkedIn`}
        >
          {LI_ICN} LinkedIn
        </a>
      </div>
    </div>
  );
}

function AwardCard({ title, year, logoUrl }) {
  return (
    <div className="award-card">
      {logoUrl ? (
        <img
          src={logoUrl}
          alt={title}
          className="award-card__logo"
          onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/images/awards/default-award.png'; }}
        />
      ) : (
        <div className="award-card__icon">{AWARD_ICN}</div>
      )}
      <div className="award-card__content">
        {year && <span className="award-card__year">{year}</span>}
        <h4 className="award-card__title">{title}</h4>
      </div>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────── */
export default function AboutPage() {
  const [leaders, setLeaders]             = useState([]);
  const [awards, setAwards]               = useState([]);
  const [leadersLoading, setLLoading]     = useState(true);
  const [awardsLoading, setALoading]      = useState(true);
  const [overviewStats, setOverviewStats] = useState(FALLBACK_OVERVIEW_STATS);
  const [globalStats, setGlobalStats]     = useState(FALLBACK_GLOBAL_STATS);
  const [cta, setCta]                     = useState(FALLBACK_CTA);
  const [hero, setHero]                   = useState(FALLBACK_HERO);

  useEffect(() => {
    getLeaders()
      .then((res) => setLeaders(res.data || []))
      .catch(() => setLeaders([]))
      .finally(() => setLLoading(false));

    getAwards()
      .then((res) => setAwards(res.data || []))
      .catch(() => setAwards([]))
      .finally(() => setALoading(false));

    getStatsByContext('about_overview')
      .then((res) => { if (res.data?.length) setOverviewStats(res.data); })
      .catch(() => {});

    getStatsByContext('about_global')
      .then((res) => { if (res.data?.length) setGlobalStats(res.data); })
      .catch(() => {});

    getCtaSection('about')
      .then((res) => { if (res.data) setCta(res.data); })
      .catch(() => {});

    getHeroSection('about')
      .then((res) => { if (res.data) setHero(res.data); })
      .catch(() => {});
  }, []);

  // derive prose values from overview stats with fallback
  const yearsValue   = overviewStats.find((s) => s.label?.toLowerCase().includes('year'))?.value ?? '4';
  const yearsSuffix  = overviewStats.find((s) => s.label?.toLowerCase().includes('year'))?.suffix ?? '+';
  const clientsValue = overviewStats.find((s) => s.label?.toLowerCase().includes('client'))?.value ?? '20';
  const clientsSuffix = overviewStats.find((s) => s.label?.toLowerCase().includes('client'))?.suffix ?? '+';

  return (
    <div className="about-page">

      <PageHero
        eyebrow={hero.eyebrow}
        title={hero.title.replace('{years}', yearsValue)}
        description={hero.subtitle}
      />

      {/* ── Company Overview ── */}
      <section className="about-overview">
        <div className="about-overview__container">
          <div className="about-overview__content">
            <span className="about-overview__eyebrow">Who We Are</span>
            <h2 className="about-overview__title">
              A Different Kind of Transformation Partner
            </h2>
            <p className="about-overview__body">
              Founded over {yearsValue}{yearsSuffix} years ago, Visionary Inspire has grown from a
              specialist contact centre operator into a full-service enterprise
              transformation partner. Today we work with more than {clientsValue}{clientsSuffix} of the
              world's leading organisations — helping them reimagine how they
              operate, serve customers, and compete in an increasingly complex
              global marketplace.
            </p>
            <p className="about-overview__body">
              What sets us apart is the depth of our domain expertise. We do not
              offer generic solutions. We build dedicated practice areas for each
              industry and service we deliver — combining sector knowledge with
              operational excellence and the right technology to create outcomes
              that make a measurable difference.
            </p>
            <div className="about-overview__actions">
              <Link to="/services" className="btn btn--primary">Our Services</Link>
              <Link to="/contact" className="btn btn--outline">Get in Touch</Link>
            </div>
          </div>

          <div className="about-overview__panel">
            {overviewStats.map((stat) => (
              <div
                key={stat.label}
                className={`about-overview__stat${stat.accent ? ' about-overview__stat--accent' : ''}`}
              >
                <div className="about-overview__stat-value">
                  {stat.value}
                  <span className="about-overview__stat-suffix">{stat.suffix}</span>
                </div>
                <div className="about-overview__stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mission, Vision, Values ── */}
      <section className="about-mission">
        <div className="about-mission__container">
          <SectionHeading
            eyebrow="What Drives Us"
            title="Mission, Vision &amp; Values"
            subtitle="The principles that guide every decision we make, every solution we design, and every relationship we build."
            center
          />
          <div className="about-mission__grid">
            {MISSION_CARDS.map((card) => (
              <MissionCard key={card.title} {...card} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Global Presence ── */}
      <section className="about-global">
        <div className="about-global__container">
          <div className="about-global__content">
            <h2 className="about-global__title">
              A Truly Global Delivery Footprint
            </h2>
            <p className="about-global__body">
              With offices across India, we are always close to the clients and
              markets we serve. Our operating model ensures strong coverage, while
              our local teams bring cultural fluency and regional market knowledge
              to every engagement.
            </p>
            <div className="about-global__locations">
              {GLOBAL_LOCATIONS.map((loc) => (
                <div key={loc} className="about-global__location">
                  {MAP_ICN} {loc}
                </div>
              ))}
            </div>
          </div>

          <div className="about-global__stats">
            {globalStats.map((stat) => (
              <div key={stat.label} className="about-global__stat">
                <div className="about-global__stat-value">
                  {stat.value}
                  {stat.suffix && (
                    <span className="about-global__stat-suffix">{stat.suffix}</span>
                  )}
                </div>
                <div className="about-global__stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Leadership Team ── */}
      <section className="about-leadership" id="leadership">
        <div className="about-leadership__container">
          <SectionHeading
            eyebrow="Leadership"
            title="The People Who Lead Visionary Inspire"
            subtitle="An experienced leadership team that brings decades of domain expertise, operational excellence, and strategic vision to everything we do."
          />
          {leadersLoading ? (
            <Loader />
          ) : leaders.length === 0 ? (
            <p className="about-leadership__empty">
              Leadership profiles coming soon.
            </p>
          ) : (
            <CardGrid columns={4}>
              {leaders.map((leader) => (
                <LeaderCard
                  key={leader.id}
                  name={leader.name}
                  title={leader.title}
                  bio={leader.bio}
                  photoUrl={leader.photoUrl}
                  linkedinUrl={leader.linkedinUrl}
                />
              ))}
            </CardGrid>
          )}
        </div>
      </section>

      {/* ── Awards & Certifications ── */}
      <section className="about-awards">
        <div className="about-awards__container">
          <SectionHeading
            eyebrow="Recognition"
            title="Awards &amp; Certifications"
            subtitle="Recognised by leading analyst firms and industry bodies for our commitment to excellence, innovation, and our people."
          />
          {awardsLoading ? (
            <Loader />
          ) : (
            <div className="about-awards__grid">
              {awards.map((award) => (
                <AwardCard
                  key={award.id}
                  title={award.title}
                  year={award.year}
                  logoUrl={award.logoUrl}
                />
              ))}
            </div>
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
