import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getStatsByContext } from '../../services/homeService';
import { getHeroSection } from '../../services/heroSectionService';
import '../../css/hero-section.css';

const FALLBACK_HERO = {
  eyebrow: 'Transforming Global Enterprises',
  title: 'People, Process & Technology Working as One',
  subtitle: 'Visionary Inspire partners with leading enterprises to deliver customer experience, intelligent automation, and data-driven transformation that creates lasting competitive advantage.',
  primaryButtonText: 'Get in Touch',
  primaryButtonUrl: '/contact',
  secondaryButtonText: 'Explore Services',
  secondaryButtonUrl: '/services',
};

const PANEL_CARDS = [
  {
    label: 'Customer Experience',
    desc: 'Omnichannel CX that drives loyalty and reduces churn.',
    icon: (
      <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
    ),
  },
  {
    label: 'Intelligent Automation',
    desc: 'RPA and AI solutions that eliminate manual effort at scale.',
    icon: (
      <svg viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8"/><path d="M12 17v4"/></svg>
    ),
  },
  {
    label: 'Data & Analytics',
    desc: 'Turning raw data into decisions that move your business forward.',
    icon: (
      <svg viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
    ),
    wide: true,
  },
];

export default function HeroSection() {
  const [globalStats, setGlobalStats] = useState(null);
  const [hero, setHero]               = useState(FALLBACK_HERO);

  useEffect(() => {
    getStatsByContext('global')
      .then((res) => { if (res.data?.length) setGlobalStats(res.data); })
      .catch(() => {});

    getHeroSection('home')
      .then((res) => { if (res.data) setHero(res.data); })
      .catch(() => {});
  }, []);

  const clients = globalStats?.find((s) => s.label === 'Global Clients')?.value ?? '20+';
  const years   = globalStats?.find((s) => s.label === 'Years of Expertise')?.value ?? '4+';

  return (
    <section className="hero">
      <div className="hero__bg-pattern" aria-hidden="true" />

      <div className="hero__container">
        <div className="hero__content">
          <div className="hero__eyebrow">
            <span className="hero__eyebrow-line" />
            {hero.eyebrow}
          </div>

          <h1 className="hero__title">
            {hero.title.includes('Technology') ? (
              <>
                {hero.title.split('Technology')[0]}
                <span className="hero__title-highlight">Technology</span>
                {hero.title.split('Technology')[1]}
              </>
            ) : (
              hero.title
            )}
          </h1>

          <p className="hero__description">
            {hero.subtitle}
          </p>

          <div className="hero__actions">
            <Link to={hero.primaryButtonUrl} className="btn btn--primary">
              {hero.primaryButtonText}
            </Link>
            <Link to={hero.secondaryButtonUrl} className="btn btn--outline-white">
              {hero.secondaryButtonText}
            </Link>
          </div>

          <div className="hero__trust">
            <span className="hero__trust-text">Trusted by {clients} global enterprises</span>
            <span className="hero__trust-dot" />
            <span className="hero__trust-text">{years} years of expertise</span>
          </div>
        </div>

        <div className="hero__panel">
          {PANEL_CARDS.map((card) => (
            <div
              key={card.label}
              className={`hero__panel-card${card.wide ? ' hero__panel-card--wide' : ''}`}
            >
              <div className="hero__panel-icon">{card.icon}</div>
              <div>
                <div className="hero__panel-label">{card.label}</div>
                <div className="hero__panel-desc">{card.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
