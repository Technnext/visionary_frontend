import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import PageHero from '../components/common/PageHero';
import SectionHeading from '../components/common/SectionHeading';
import CardGrid from '../components/common/CardGrid';
import CTABanner from '../components/common/CTABanner';
import Loader from '../components/common/Loader';
import { getAllJobs } from '../services/careersService';
import { getStatsByContext } from '../services/homeService';
import { getCtaSection } from '../services/ctaSectionService';
import { getHeroSection } from '../services/heroSectionService';
import '../css/careers-page.css';

/* ─── Icons ─────────────────────────────────────────────────────────────── */
const GROWTH_ICN  = <svg viewBox="0 0 24 24"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>;
const PEOPLE_ICN  = <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const GLOBE_ICN   = <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>;
const AWARD_ICN   = <svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>;
const BAG_ICN     = <svg viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>;
const MAP_ICN     = <svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;
const CLOCK_ICN   = <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const CHEVRON_ICN = <svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>;

/* ─── Static data ────────────────────────────────────────────────────────── */
const EVP_CARDS = [
  {
    icon: GROWTH_ICN,
    title: 'Accelerated Career Growth',
    description:
      'Structured learning paths, mentorship programmes, and fast-track leadership pipelines ensure your career progresses as quickly as your ambitions.',
  },
  {
    icon: GLOBE_ICN,
    title: 'Global Exposure',
    description:
      'Work with leading enterprises across India, gaining cross-functional experience and building an international professional network.',
  },
  {
    icon: PEOPLE_ICN,
    title: 'Inclusive Culture',
    description:
      'A workplace built on respect, collaboration, and belonging — where diverse perspectives are not just welcomed but essential to how we deliver.',
  },
  {
    icon: AWARD_ICN,
    title: 'Recognised Excellence',
    description:
      'Great Place to Work certified and consistently recognised by industry bodies for employee wellbeing, development, and engagement initiatives.',
  },
];

const FALLBACK_CAREER_STATS = [
  { value: '11', suffix: 'K+', label: 'Employees globally' },
  { value: '3',  suffix: '+',  label: 'Office locations' },
  { value: '10', suffix: '+',  label: 'Nationalities represented' },
  { value: '68', suffix: '%',  label: 'Internal promotion rate' },
];

const FALLBACK_HERO = {
  eyebrow: 'Careers',
  title: 'Build a Career That Makes a Global Impact',
  subtitle: 'Join a team of growing professionals working at the intersection of people, process, and technology to transform enterprises.',
};

const FALLBACK_CTA = {
  title: "Don\u2019t See the Right Role?",
  description: "Send us your CV and we\u2019ll reach out when a suitable position opens up.",
  primaryButtonText: 'Get in Touch',
  primaryButtonUrl: '/contact',
  secondaryButtonText: 'About Us',
  secondaryButtonUrl: '/about',
};

/* ─── Helpers ────────────────────────────────────────────────────────────── */
function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

/* ─── EVP Card ───────────────────────────────────────────────────────────── */
function EvpCard({ icon, title, description }) {
  return (
    <div className="evp-card">
      <div className="evp-card__icon">{icon}</div>
      <h3 className="evp-card__title">{title}</h3>
      <p className="evp-card__description">{description}</p>
    </div>
  );
}

/* ─── Job Card ───────────────────────────────────────────────────────────── */
function JobCard({ job }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`job-card${expanded ? ' job-card--expanded' : ''}`}>
      <div className="job-card__header" onClick={() => setExpanded((p) => !p)}>
        <div className="job-card__info">
          <h3 className="job-card__title">{job.title}</h3>
          <div className="job-card__tags">
            <span className="job-card__tag job-card__tag--dept">
              {BAG_ICN} {job.department}
            </span>
            <span className="job-card__tag job-card__tag--location">
              {MAP_ICN} {job.location}
            </span>
            <span className="job-card__tag job-card__tag--type">
              {CLOCK_ICN} {job.type}
            </span>
          </div>
          {job.postedDate && (
            <span className="job-card__date">
              Posted {formatDate(job.postedDate)}
            </span>
          )}
        </div>

        <div className="job-card__actions">
          <button
            className="job-card__toggle"
            aria-label={expanded ? 'Collapse' : 'Expand'}
            aria-expanded={expanded}
          >
            {CHEVRON_ICN}
          </button>
        </div>
      </div>

      <div className="job-card__panel">
        {job.description && (
          <p className="job-card__description">{job.description}</p>
        )}
        <div className="job-card__panel-footer">
          <Link to={`/careers/${job.id}`} className="btn btn--primary">
            Apply Now
          </Link>
          <Link to="/contact" className="btn btn--outline">
            Enquire
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────── */
export default function CareersPage() {
  const [jobs, setJobs]               = useState([]);
  const [loading, setLoading]         = useState(true);
  const [deptFilter, setDept]         = useState('All');
  const [locFilter, setLoc]           = useState('All');
  const [careerStats, setCareerStats] = useState(FALLBACK_CAREER_STATS);
  const [cta, setCta]                 = useState(FALLBACK_CTA);
  const [hero, setHero]               = useState(FALLBACK_HERO);

  useEffect(() => {
    getAllJobs()
      .then((res) => setJobs(res.data || []))
      .catch((err) => {
        console.error('Failed to load jobs:', err);
        setJobs([]);
      })
      .finally(() => setLoading(false));

    getStatsByContext('careers')
      .then((res) => { if (res.data?.length) setCareerStats(res.data); })
      .catch(() => {});

    getCtaSection('careers')
      .then((res) => { if (res.data) setCta(res.data); })
      .catch(() => {});

    getHeroSection('careers')
      .then((res) => { if (res.data) setHero(res.data); })
      .catch(() => {});
  }, []);

  const departments = useMemo(
    () => ['All', ...new Set(jobs.map((j) => j.department).filter(Boolean))],
    [jobs],
  );

  const locations = useMemo(
    () => ['All', ...new Set(jobs.map((j) => j.location).filter(Boolean))],
    [jobs],
  );

  const filtered = useMemo(() => {
    return jobs.filter((j) => {
      const deptMatch = deptFilter === 'All' || j.department === deptFilter;
      const locMatch  = locFilter  === 'All' || j.location  === locFilter;
      return deptMatch && locMatch;
    });
  }, [jobs, deptFilter, locFilter]);

  const hasFilters = deptFilter !== 'All' || locFilter !== 'All';

  return (
    <div className="careers-page">
      <PageHero
        eyebrow={hero.eyebrow}
        title={hero.title}
        description={hero.subtitle}
      />

      {/* ── Why Join Us ── */}
      <section className="careers-why">
        <div className="careers-why__container">
          <SectionHeading
            eyebrow="Why Visionary Inspire"
            title="More Than a Job. A Career That Matters."
            subtitle="We invest in our people with the same commitment we bring to our clients — because we know that outstanding talent is the foundation of everything we deliver."
          />
          <CardGrid columns={4}>
            {EVP_CARDS.map((card) => (
              <EvpCard key={card.title} {...card} />
            ))}
          </CardGrid>
        </div>
      </section>

      {/* ── Stats Strip ── */}
      <div className="careers-stats">
        <div className="careers-stats__container">
          {careerStats.map((stat) => (
            <div key={stat.label} className="careers-stats__item">
              <div className="careers-stats__value">
                {stat.value}
                <span className="careers-stats__suffix">{stat.suffix}</span>
              </div>
              <div className="careers-stats__label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Job Listings ── */}
      <section className="careers-jobs">
        <div className="careers-jobs__container">
          <SectionHeading
            eyebrow="Open Positions"
            title="Find Your Next Role"
            subtitle="Explore opportunities across our global delivery centres and corporate functions."
          />

          {/* Filters */}
          <div className="careers-filters">
            <span className="careers-filters__label">Filter by:</span>

            <select
              className="careers-filters__select"
              value={deptFilter}
              onChange={(e) => setDept(e.target.value)}
              aria-label="Filter by department"
            >
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d === 'All' ? 'All Departments' : d}
                </option>
              ))}
            </select>

            <select
              className="careers-filters__select"
              value={locFilter}
              onChange={(e) => setLoc(e.target.value)}
              aria-label="Filter by location"
            >
              {locations.map((l) => (
                <option key={l} value={l}>
                  {l === 'All' ? 'All Locations' : l}
                </option>
              ))}
            </select>

            {hasFilters && (
              <button
                className="careers-filters__reset"
                onClick={() => { setDept('All'); setLoc('All'); }}
              >
                Clear filters ×
              </button>
            )}

            {!loading && (
              <span className="careers-filters__count">
                {filtered.length} position{filtered.length !== 1 ? 's' : ''} found
              </span>
            )}
          </div>

          {/* Listings */}
          {loading ? (
            <Loader />
          ) : filtered.length === 0 ? (
            <div className="careers-empty">
              <p className="careers-empty__title">
                {hasFilters ? 'No positions match your filters.' : 'No open positions at the moment.'}
              </p>
              <p>Check back soon or clear your filters to see all roles.</p>
            </div>
          ) : (
            <div className="careers-jobs__grid">
              {filtered.map((job) => (
                <JobCard key={job.id} job={job} />
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
