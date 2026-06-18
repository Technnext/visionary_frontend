import { useState, useEffect } from 'react';
import PageHero from '../components/common/PageHero';
import SectionHeading from '../components/common/SectionHeading';
import CardGrid from '../components/common/CardGrid';
import CTABanner from '../components/common/CTABanner';
import Loader from '../components/common/Loader';
import { submitContactForm, getOfficeLocations } from '../services/contactService';
import { getCompanySettings } from '../services/companySettingsService';
import { getCtaSection } from '../services/ctaSectionService';
import { getHeroSection } from '../services/heroSectionService';
import '../css/contact-page.css';

const FALLBACK_SETTINGS = {
  phone: '+91 82967 66781',
  email: 'info@visionaryinspire.com',
  headquartersAddress: '18, Sy. No. 93/9, Noval MSR Park, Varthur Main Road, Munnekolala, Marathahalli, Bangalore \u2013 560037',
  businessDays: 'Monday \u2013 Friday',
  businessHours: '9:00 AM \u2013 6:00 PM IST',
  responseTime: 'Within 1 business day',
};

const FALLBACK_HERO = {
  eyebrow: 'Contact Us',
  title: "Let\u2019s Start a Conversation",
  subtitle: 'Whether you are exploring a new partnership, looking for a specific solution, or simply want to learn more \u2014 our team is ready to help.',
};

const FALLBACK_CTA = {
  title: 'Ready to Transform Your Business?',
  description: 'Our experts are standing by to help you design the right solution for your challenges.',
  primaryButtonText: 'Send a Message',
  primaryButtonUrl: '/contact',
  secondaryButtonText: 'Explore Services',
  secondaryButtonUrl: '/services',
};

/* ─── Icons ─────────────────────────────────────────────────────────────── */
const MAP_ICN    = <svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;
const PHONE_ICN  = <svg viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.35 2 2 0 0 1 3.6 1.28h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.84a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;
const MAIL_ICN   = <svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>;
const CHECK_ICN  = <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>;
const ALERT_ICN  = <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>;

/* ─── Validation ─────────────────────────────────────────────────────────── */
const INITIAL_FORM = {
  name: '', email: '', phone: '', company: '', subject: '', message: '',
};

function validate(fields) {
  const errors = {};
  if (!fields.name.trim())
    errors.name = 'Name is required.';
  if (!fields.email.trim())
    errors.email = 'Email is required.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email))
    errors.email = 'Please enter a valid email address.';
  if (!fields.message.trim())
    errors.message = 'Message is required.';
  else if (fields.message.trim().length < 10)
    errors.message = 'Message must be at least 10 characters.';
  return errors;
}

/* ─── Office Card ────────────────────────────────────────────────────────── */
function OfficeCard({ city, country, address, phone, email }) {
  return (
    <div className="office-card">
      <div className="office-card__header">
        <div className="office-card__icon">{MAP_ICN}</div>
        <div>
          <div className="office-card__city">{city}</div>
          <div className="office-card__country">{country}</div>
        </div>
      </div>
      <div className="office-card__details">
        {address && (
          <div className="office-card__detail">
            {MAP_ICN} {address}
          </div>
        )}
        {phone && (
          <div className="office-card__detail">
            {PHONE_ICN} {phone}
          </div>
        )}
        {email && (
          <div className="office-card__detail">
            {MAIL_ICN} {email}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────── */
export default function ContactPage() {
  const [form, setForm]         = useState(INITIAL_FORM);
  const [errors, setErrors]     = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const [offices, setOffices]             = useState([]);
  const [officesLoading, setOfficesLoading] = useState(true);
  const [settings, setSettings]           = useState(FALLBACK_SETTINGS);
  const [cta, setCta]                     = useState(FALLBACK_CTA);
  const [hero, setHero]                   = useState(FALLBACK_HERO);

  useEffect(() => {
    getOfficeLocations()
      .then((res) => setOffices(res.data || []))
      .catch(() => setOffices([]))
      .finally(() => setOfficesLoading(false));
    getCompanySettings()
      .then((res) => setSettings(res.data || FALLBACK_SETTINGS))
      .catch(() => {});
    getCtaSection('contact')
      .then((res) => { if (res.data) setCta(res.data); })
      .catch(() => {});
    getHeroSection('contact')
      .then((res) => { if (res.data) setHero(res.data); })
      .catch(() => {});
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }
    setSubmitting(true);
    setFeedback(null);
    try {
      await submitContactForm(form);
      setFeedback('success');
      setForm(INITIAL_FORM);
      setErrors({});
    } catch {
      setFeedback('error');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="contact-page">
      <PageHero
        eyebrow={hero.eyebrow}
        title={hero.title}
        description={hero.subtitle}
      />

      {/* ── Form + Info ── */}
      <section className="contact-main">
        <div className="contact-main__container">

          {/* Form */}
          <div>
            <h2 className="contact-form__title">Send Us a Message</h2>
            <form onSubmit={handleSubmit} noValidate>
              <div className="contact-form__grid">

                <div className="contact-form__group">
                  <label className="contact-form__label" htmlFor="name">
                    Full Name <span>*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    className={`contact-form__input${errors.name ? ' contact-form__input--error' : ''}`}
                    placeholder="Your full name"
                    value={form.name}
                    onChange={handleChange}
                    autoComplete="name"
                  />
                  {errors.name && <span className="contact-form__error">{errors.name}</span>}
                </div>

                <div className="contact-form__group">
                  <label className="contact-form__label" htmlFor="email">
                    Email Address <span>*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className={`contact-form__input${errors.email ? ' contact-form__input--error' : ''}`}
                    placeholder="your@company.com"
                    value={form.email}
                    onChange={handleChange}
                    autoComplete="email"
                  />
                  {errors.email && <span className="contact-form__error">{errors.email}</span>}
                </div>

                <div className="contact-form__group">
                  <label className="contact-form__label" htmlFor="phone">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    className="contact-form__input"
                    placeholder="+1 (555) 000-0000"
                    value={form.phone}
                    onChange={handleChange}
                    autoComplete="tel"
                  />
                </div>

                <div className="contact-form__group">
                  <label className="contact-form__label" htmlFor="company">
                    Company
                  </label>
                  <input
                    id="company"
                    name="company"
                    type="text"
                    className="contact-form__input"
                    placeholder="Your company name"
                    value={form.company}
                    onChange={handleChange}
                    autoComplete="organization"
                  />
                </div>

                <div className="contact-form__group contact-form__group--full">
                  <label className="contact-form__label" htmlFor="subject">
                    Subject
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    className="contact-form__select"
                    value={form.subject}
                    onChange={handleChange}
                  >
                    <option value="">Select a topic&hellip;</option>
                    <option value="Customer Experience">Customer Experience</option>
                    <option value="Digital Transformation">Digital Transformation</option>
                    <option value="Data & Analytics">Data &amp; Analytics</option>
                    <option value="Intelligent Automation">Intelligent Automation</option>
                    <option value="Trust & Safety">Trust &amp; Safety</option>
                    <option value="Partnership">Partnership Enquiry</option>
                    <option value="General">General Enquiry</option>
                  </select>
                </div>

                <div className="contact-form__group contact-form__group--full">
                  <label className="contact-form__label" htmlFor="message">
                    Message <span>*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    className={`contact-form__textarea${errors.message ? ' contact-form__textarea--error' : ''}`}
                    placeholder="Tell us about your project, challenge, or question&hellip;"
                    value={form.message}
                    onChange={handleChange}
                  />
                  {errors.message && <span className="contact-form__error">{errors.message}</span>}
                </div>

              </div>

              {feedback === 'success' && (
                <div className="contact-form__feedback contact-form__feedback--success">
                  <div className="contact-form__feedback-icon">{CHECK_ICN}</div>
                  <p className="contact-form__feedback-text">
                    Thank you for getting in touch. Your message has been received and a member of our team will respond within one business day.
                  </p>
                </div>
              )}
              {feedback === 'error' && (
                <div className="contact-form__feedback contact-form__feedback--error">
                  <div className="contact-form__feedback-icon">{ALERT_ICN}</div>
                  <p className="contact-form__feedback-text">
                    Something went wrong. Please try again or email us directly at {settings.email}.
                  </p>
                </div>
              )}

              <div className="contact-form__submit">
                <button
                  type="submit"
                  className="btn btn--primary"
                  disabled={submitting}
                >
                  {submitting ? 'Sending\u2026' : 'Send Message'}
                </button>
              </div>
            </form>
          </div>

          {/* Info Panel */}
          <aside className="contact-info">
            <div className="contact-info__card">
              <h3 className="contact-info__card-title">Get in Touch</h3>
              <div className="contact-info__list">
                <div className="contact-info__item">
                  <div className="contact-info__item-icon">{PHONE_ICN}</div>
                  <div>
                    <div className="contact-info__item-label">Phone</div>
                    <div className="contact-info__item-value">{settings.phone}</div>
                  </div>
                </div>
                <div className="contact-info__item">
                  <div className="contact-info__item-icon">{MAIL_ICN}</div>
                  <div>
                    <div className="contact-info__item-label">Email</div>
                    <div className="contact-info__item-value">{settings.email}</div>
                  </div>
                </div>
                <div className="contact-info__item">
                  <div className="contact-info__item-icon">{MAP_ICN}</div>
                  <div>
                    <div className="contact-info__item-label">Headquarters</div>
                    <div className="contact-info__item-value">
                      {settings.headquartersAddress}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="contact-info__card">
              <h3 className="contact-info__card-title">Business Hours</h3>
              <div className="contact-info__list">
                <div className="contact-info__item">
                  <div className="contact-info__item-icon">{PHONE_ICN}</div>
                  <div>
                    <div className="contact-info__item-label">{settings.businessDays}</div>
                    <div className="contact-info__item-value">{settings.businessHours}</div>
                  </div>
                </div>
                <div className="contact-info__item">
                  <div className="contact-info__item-icon">{MAIL_ICN}</div>
                  <div>
                    <div className="contact-info__item-label">Response Time</div>
                    <div className="contact-info__item-value">{settings.responseTime}</div>
                  </div>
                </div>
              </div>
            </div>
          </aside>

        </div>
      </section>

      {/* ── Office Locations ── */}
      <section className="contact-offices">
        <div className="contact-offices__container">
          <SectionHeading
            eyebrow="Our Offices"
            title="Find Us Across India"
            subtitle="With offices in Chennai, Hyderabad, and Bangalore, we are always close to the clients and markets we serve."
          />
          {officesLoading ? (
            <Loader />
          ) : (
            <CardGrid columns={3}>
              {offices.map((office) => (
                <OfficeCard
                  key={office.id}
                  city={office.city}
                  country={office.country}
                  address={office.address}
                  phone={office.phone}
                  email={office.email}
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
