import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Loader from '../components/common/Loader';
import api from '../services/api';
import { getStatsByContext } from '../services/homeService';
import '../css/job-details-page.css';

// ─── Icons ────────────────────────────────────────────────────────────────────
const BAG_ICN   = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>;
const MAP_ICN   = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;
const CLOCK_ICN = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const CAL_ICN   = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
const CHECK_ICN = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const ARROW_ICN = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>;

// ─── Static enrichment data (keyed by department) ─────────────────────────────
const DEPT_DETAILS = {
  'Customer Experience': {
    experience: '2–5 years',
    responsibilities: [
      'Handle inbound and outbound interactions across voice, chat, and email channels',
      'Drive first-call resolution and maintain CSAT targets above threshold',
      'Document customer interactions accurately in CRM systems',
      'Escalate complex issues to appropriate teams following defined protocols',
      'Contribute to continuous improvement initiatives within the team',
    ],
    skills: ['Customer Service', 'CRM Systems', 'Communication', 'Problem Solving', 'Active Listening'],
    benefits: ['Competitive salary', 'Performance bonuses', 'Health insurance', 'Learning & development budget', 'Flexible working hours'],
  },
  'Intelligent Automation': {
    experience: '3–6 years',
    responsibilities: [
      'Design, develop, and deploy automation workflows using leading RPA platforms',
      'Collaborate with business analysts to identify and document automation opportunities',
      'Build and maintain reusable automation components and libraries',
      'Perform unit and integration testing of automated solutions',
      'Support go-live and hypercare phases of automation deployments',
    ],
    skills: ['UiPath', 'Automation Anywhere', 'Python', 'Process Analysis', 'SQL'],
    benefits: ['Competitive salary', 'Tech certifications sponsored', 'Health insurance', 'Remote work options', 'Annual bonus'],
  },
  'Data & Analytics': {
    experience: '3–7 years',
    responsibilities: [
      'Build and maintain scalable data pipelines on cloud platforms',
      'Design data models and schemas optimised for analytics workloads',
      'Work with analytics teams to deliver reliable data products for business intelligence',
      'Ensure data quality, lineage tracking, and governance compliance',
      'Collaborate with stakeholders to translate business requirements into data solutions',
    ],
    skills: ['Python', 'SQL', 'Apache Spark', 'Cloud Platforms (AWS/Azure/GCP)', 'Data Modelling'],
    benefits: ['Competitive salary', 'Cloud certifications sponsored', 'Health insurance', 'Flexible work', 'Conference attendance'],
  },
  'Trust & Safety': {
    experience: '1–3 years',
    responsibilities: [
      'Review user-generated content against platform policies across text, image, and video',
      'Apply policy guidelines consistently and accurately at volume',
      'Escalate complex or edge-case content to senior reviewers',
      'Maintain productivity and quality metrics within defined SLA targets',
      'Participate in calibration sessions to ensure policy alignment',
    ],
    skills: ['Policy Enforcement', 'Attention to Detail', 'Resilience', 'Critical Thinking', 'Multilingual (desirable)'],
    benefits: ['Competitive salary', 'Wellness programme', 'Health insurance', 'Peer support resources', 'Career progression paths'],
  },
  'Digital Transformation': {
    experience: '5–10 years',
    responsibilities: [
      'Lead digital strategy engagements for enterprise clients',
      'Develop business cases, operating model designs, and technology roadmaps',
      'Facilitate workshops with C-suite and senior stakeholders',
      'Manage engagement delivery to time, budget, and quality targets',
      'Contribute to business development and proposal activity',
    ],
    skills: ['Digital Strategy', 'Business Analysis', 'Stakeholder Management', 'Consulting', 'Agile Delivery'],
    benefits: ['Competitive salary', 'Travel allowance', 'Health insurance', 'Executive coaching', 'Annual bonus'],
  },
  'Healthcare Operations': {
    experience: '2–5 years',
    responsibilities: [
      'Process and adjudicate medical claims for US payer clients',
      'Ensure accuracy and compliance with CMS guidelines',
      'Meet SLA turnaround targets for claims processing',
      'Identify and resolve claim discrepancies with payer and provider teams',
      'Maintain up-to-date knowledge of coding standards (ICD-10, CPT)',
    ],
    skills: ['Medical Coding', 'ICD-10/CPT', 'Claims Processing', 'HIPAA Compliance', 'Attention to Detail'],
    benefits: ['Competitive salary', 'Healthcare certifications funded', 'Health insurance', 'Shift flexibility', 'Performance incentives'],
  },
  'Human Resources': {
    experience: '5–8 years',
    responsibilities: [
      'Partner with delivery leaders to drive talent management and engagement programmes',
      'Lead performance management cycles and succession planning',
      'Manage employee relations cases and workplace investigations',
      'Design and implement HR initiatives aligned to business strategy',
      'Analyse HR metrics and provide data-driven insights to leadership',
    ],
    skills: ['HR Business Partnering', 'Employment Law', 'Talent Management', 'Employee Relations', 'HRIS Systems'],
    benefits: ['Competitive salary', 'Professional HR qualifications supported', 'Health insurance', 'Hybrid working', 'Leadership development'],
  },
};

const DEFAULT_DETAILS = {
  experience: '2–5 years',
  responsibilities: [
    'Deliver high-quality work aligned to team and client objectives',
    'Collaborate with cross-functional teams across global delivery centres',
    'Continuously develop skills in line with practice area requirements',
    'Contribute to process improvement and knowledge-sharing initiatives',
    'Maintain accurate records and documentation in relevant systems',
  ],
  skills: ['Communication', 'Analytical Thinking', 'Teamwork', 'Attention to Detail', 'Adaptability'],
  benefits: ['Competitive salary', 'Health insurance', 'Learning & development', 'Career progression', 'Inclusive culture'],
};

function getDetails(department) {
  return DEPT_DETAILS[department] || DEFAULT_DETAILS;
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

// ─── Not Found ────────────────────────────────────────────────────────────────
function NotFound() {
  return (
    <div className="jdp-not-found">
      <h2>Job Not Found</h2>
      <p>This position may have been filled or removed.</p>
      <Link to="/careers" className="btn btn--primary">Back to Careers</Link>
    </div>
  );
}

// ─── Application Form ─────────────────────────────────────────────────────────
function ApplicationForm({ jobId, jobTitle }) {
  const [form, setForm] = useState({
    fullName: '', email: '', phone: '', location: '',
    experience: '', linkedinUrl: '', coverLetter: '',
  });
  const [resume, setResume] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState('');
  const fileRef = useRef(null);

  function validate() {
    const e = {};
    if (!form.fullName.trim())   e.fullName   = 'Full name is required';
    if (!form.email.trim())      e.email      = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.phone.trim())      e.phone      = 'Phone number is required';
    if (!form.location.trim())   e.location   = 'Current location is required';
    if (!form.experience.trim()) e.experience = 'Years of experience is required';
    if (!resume)                 e.resume     = 'Resume is required';
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setServerError('');
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setSubmitting(true);

    const data = new FormData();
    data.append('jobId',      jobId);
    data.append('fullName',   form.fullName);
    data.append('email',      form.email);
    data.append('phone',      form.phone);
    data.append('location',   form.location);
    data.append('experience', form.experience);
    if (form.linkedinUrl)  data.append('linkedinUrl',  form.linkedinUrl);
    if (form.coverLetter)  data.append('coverLetter',  form.coverLetter);
    data.append('resume', resume);

    try {
      await api.post('/careers/apply', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSubmitted(true);
    } catch {
      setServerError('Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  function field(name) {
    return {
      value: form[name],
      onChange: (e) => setForm((p) => ({ ...p, [name]: e.target.value })),
      className: `${errors[name] ? 'jdp-error' : ''}`,
    };
  }

  if (submitted) {
    return (
      <div className="jdp-success">
        <div className="jdp-success__icon">{CHECK_ICN}</div>
        <p className="jdp-success__title">Application submitted successfully.</p>
        <p className="jdp-success__sub">
          Thank you for applying for <strong>{jobTitle}</strong>. We will be in touch shortly.
        </p>
        <Link to="/careers" className="btn btn--outline" style={{ marginTop: '8px' }}>
          Back to Careers
        </Link>
      </div>
    );
  }

  return (
    <div className="jdp-form-card">
      <h2 className="jdp-form-card__title">Apply for This Role</h2>
      <p className="jdp-form-card__sub">Fields marked <span style={{ color: '#dc2626' }}>*</span> are required.</p>

      {serverError && (
        <p style={{ color: '#dc2626', fontSize: 'var(--font-size-sm)', marginBottom: '1rem' }}>{serverError}</p>
      )}

      <form className="jdp-form" onSubmit={handleSubmit} noValidate>

        <div className="jdp-form-row">
          <div className="jdp-field">
            <label>Full Name <span className="jdp-required">*</span></label>
            <input type="text" placeholder="Jane Smith" {...field('fullName')} />
            {errors.fullName && <span className="jdp-field-error">{errors.fullName}</span>}
          </div>
          <div className="jdp-field">
            <label>Email Address <span className="jdp-required">*</span></label>
            <input type="email" placeholder="jane@example.com" {...field('email')} />
            {errors.email && <span className="jdp-field-error">{errors.email}</span>}
          </div>
        </div>

        <div className="jdp-form-row">
          <div className="jdp-field">
            <label>Phone Number <span className="jdp-required">*</span></label>
            <input type="tel" placeholder="+91 98765 43210" {...field('phone')} />
            {errors.phone && <span className="jdp-field-error">{errors.phone}</span>}
          </div>
          <div className="jdp-field">
            <label>Current Location <span className="jdp-required">*</span></label>
            <input type="text" placeholder="Chennai, India" {...field('location')} />
            {errors.location && <span className="jdp-field-error">{errors.location}</span>}
          </div>
        </div>

        <div className="jdp-form-row">
          <div className="jdp-field">
            <label>Years of Experience <span className="jdp-required">*</span></label>
            <input type="text" placeholder="e.g. 3 years" {...field('experience')} />
            {errors.experience && <span className="jdp-field-error">{errors.experience}</span>}
          </div>
          <div className="jdp-field">
            <label>LinkedIn URL</label>
            <input type="url" placeholder="https://linkedin.com/in/yourprofile" {...field('linkedinUrl')} />
          </div>
        </div>

        <div className="jdp-field">
          <label>Resume / CV <span className="jdp-required">*</span></label>
          <input
            ref={fileRef}
            type="file"
            accept=".pdf,.doc,.docx"
            className={`jdp-file-input${errors.resume ? ' jdp-error' : ''}`}
            onChange={(e) => setResume(e.target.files[0] || null)}
          />
          <span className="jdp-file-hint">PDF, DOC or DOCX — max 10 MB</span>
          {errors.resume && <span className="jdp-field-error">{errors.resume}</span>}
        </div>

        <div className="jdp-field">
          <label>Cover Letter</label>
          <textarea
            placeholder="Tell us why you're a great fit for this role…"
            rows={4}
            {...field('coverLetter')}
          />
        </div>

        <button type="submit" className="jdp-submit-btn" disabled={submitting}>
          {submitting ? 'Submitting…' : (<>Submit Application {ARROW_ICN}</>)}
        </button>

      </form>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function JobDetailsPage() {
  const { jobId } = useParams();
  const navigate  = useNavigate();
  const [job, setJob]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound]       = useState(false);
  const [globalStats, setGlobalStats] = useState([]);

  useEffect(() => {
    setLoading(true);
    api.get(`/careers/${jobId}`)
      .then((res) => setJob(res.data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));

    getStatsByContext('global')
      .then((res) => { if (res.data?.length) setGlobalStats(res.data); })
      .catch(() => {});
  }, [jobId]);

  if (loading) return <div className="jdp-loader-wrap"><Loader /></div>;
  if (notFound || !job) return <div className="jdp-loader-wrap"><NotFound /></div>;

  const details = getDetails(job.department);

  return (
    <div className="jdp">

      {/* ── Hero ── */}
      <section className="jdp-hero">
        <div className="jdp-hero__container">
          <nav className="jdp-hero__breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span>›</span>
            <Link to="/careers">Careers</Link>
            <span>›</span>
            <span>{job.title}</span>
          </nav>

          <span className="jdp-hero__dept">{job.department}</span>
          <h1 className="jdp-hero__title">{job.title}</h1>

          <div className="jdp-hero__meta">
            <span className="jdp-hero__meta-item">{BAG_ICN} {job.department}</span>
            <span className="jdp-hero__meta-item">{MAP_ICN} {job.location}</span>
            <span className="jdp-hero__meta-item">{CLOCK_ICN} {job.type}</span>
            {job.postedDate && (
              <span className="jdp-hero__meta-item">{CAL_ICN} Posted {formatDate(job.postedDate)}</span>
            )}
          </div>
        </div>
      </section>

      {/* ── Body ── */}
      <div className="jdp-body">

        {/* Left: details */}
        <div className="jdp-details">

          <div className="jdp-section">
            <h2 className="jdp-section__title">About the Role</h2>
            <p>{job.description}</p>
          </div>

          <div className="jdp-section">
            <h2 className="jdp-section__title">Key Responsibilities</h2>
            <ul className="jdp-list">
              {details.responsibilities.map((r, i) => <li key={i}>{r}</li>)}
            </ul>
          </div>

          <div className="jdp-section">
            <h2 className="jdp-section__title">Required Skills</h2>
            <div className="jdp-skills">
              {details.skills.map((s) => (
                <span key={s} className="jdp-skill">{s}</span>
              ))}
            </div>
          </div>

          <div className="jdp-section">
            <h2 className="jdp-section__title">Benefits</h2>
            <ul className="jdp-list">
              {details.benefits.map((b, i) => <li key={i}>{b}</li>)}
            </ul>
          </div>

          {/* Application form — full width below details on desktop */}
          <ApplicationForm jobId={job.id} jobTitle={job.title} />

        </div>

        {/* Right: sidebar */}
        <aside className="jdp-sidebar">
          <div className="jdp-info-card">
            <p className="jdp-info-card__title">Job Overview</p>
            <div className="jdp-info-row">
              <span className="jdp-info-row__label">Department</span>
              <span className="jdp-info-row__value">{job.department}</span>
            </div>
            <div className="jdp-info-row">
              <span className="jdp-info-row__label">Location</span>
              <span className="jdp-info-row__value">{job.location}</span>
            </div>
            <div className="jdp-info-row">
              <span className="jdp-info-row__label">Employment Type</span>
              <span className="jdp-info-row__value">{job.type}</span>
            </div>
            <div className="jdp-info-row">
              <span className="jdp-info-row__label">Experience</span>
              <span className="jdp-info-row__value">{details.experience}</span>
            </div>
            {job.postedDate && (
              <div className="jdp-info-row">
                <span className="jdp-info-row__label">Posted</span>
                <span className="jdp-info-row__value">{formatDate(job.postedDate)}</span>
              </div>
            )}
          </div>

          <div className="jdp-info-card">
            <p className="jdp-info-card__title">About Visionary Inspire</p>
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-body)', lineHeight: 'var(--line-height-loose)' }}>
              {(() => {
                const years = globalStats.find((s) => s.label === 'Years of Expertise')?.value ?? '4+';
                const clients = globalStats.find((s) => s.label === 'Global Clients')?.value ?? '20+';
                return `A global enterprise transformation partner with ${years} of experience and ${clients} enterprise clients.`;
              })()}
            </p>
            <Link
              to="/about"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '12px', fontSize: 'var(--font-size-sm)', fontWeight: '600', color: 'var(--color-primary)', textDecoration: 'none' }}
            >
              Learn more {ARROW_ICN}
            </Link>
          </div>

          <Link to="/careers" className="btn btn--outline" style={{ textAlign: 'center' }}>
            ← Back to All Jobs
          </Link>
        </aside>

      </div>
    </div>
  );
}
