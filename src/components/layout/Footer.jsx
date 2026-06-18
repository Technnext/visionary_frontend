import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { subscribe } from '../../services/newsletterService';
import { getCompanySettings } from '../../services/companySettingsService';
import { getNavLinks } from '../../services/navigationService';
import '../../css/footer.css';

const FALLBACK_SETTINGS = {
  phone: '+91 82967 66781',
  email: 'info@visionaryinspire.com',
};

const FALLBACK_COMPANY = [
  { label: 'About Us',   url: '/about' },
  { label: 'Leadership', url: '/about' },
  { label: 'Insights',   url: '/insights' },
  { label: 'Careers',    url: '/careers' },
  { label: 'Contact Us', url: '/contact' },
];

const FALLBACK_SERVICES = [
  { label: 'Application Services',  url: '/services/application-services' },
  { label: 'AI',                    url: '/services/ai' },
  { label: 'Enterprise Automation', url: '/services/enterprise-automation' },
  { label: 'Cyber Security',        url: '/services/cyber-security' },
  { label: 'Next-Gen Data',         url: '/services/next-gen-data' },
];

const FALLBACK_INDUSTRIES = [
  { label: 'Banking & Financial Services', url: '/industries/banking-financial-services' },
  { label: 'Healthcare',                   url: '/industries/healthcare' },
  { label: 'Telecommunications',           url: '/industries/telecommunications' },
  { label: 'Retail & E-commerce',          url: '/industries/retail-ecommerce' },
  { label: 'Media & Entertainment',        url: '/industries/media-entertainment' },
];

const FALLBACK_INSIGHTS = [
  { label: 'Blog & Articles',   url: '/insights' },
  { label: 'Case Studies',      url: '/insights' },
  { label: 'White Papers',      url: '/insights' },
  { label: 'Industry Reports',  url: '/insights' },
  { label: 'Webinars & Events', url: '/insights' },
];

const FALLBACK_SOCIAL = [
  { label: 'LinkedIn', url: '#' },
  { label: 'Twitter',  url: '#' },
];

const FALLBACK_LEGAL = [
  { label: 'Privacy Policy', url: '#' },
  { label: 'Terms of Use',   url: '#' },
  { label: 'Cookie Policy',  url: '#' },
  { label: 'Accessibility',  url: '#' },
  { label: 'Sitemap',        url: '#' },
];

const PHONE_ICON = (
  <svg viewBox="0 0 24 24">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.35 2 2 0 0 1 3.6 1.28h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.84a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);
const MAIL_ICON = (
  <svg viewBox="0 0 24 24">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);
const MAP_ICON = (
  <svg viewBox="0 0 24 24">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

const LI_ICON = <svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>;
const TW_ICON = <svg viewBox="0 0 24 24" fill="currentColor"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>;
const FB_ICON = <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>;
const YT_ICON = <svg viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white"/></svg>;

const SOCIAL_ICONS = { LinkedIn: LI_ICON, Twitter: TW_ICON, Facebook: FB_ICON, YouTube: YT_ICON };

function toLinks(apiData) {
  return apiData.map((l) => ({ label: l.label, url: l.url }));
}

function FooterCol({ heading, links }) {
  return (
    <div className="footer__col">
      <h4 className="footer__col-heading">{heading}</h4>
      <ul className="footer__col-list">
        {links.map((link) => (
          <li key={link.url + link.label}>
            <Link to={link.url} className="footer__col-link">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  const [email, setEmail]   = useState('');
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState('');

  const [settings, setSettings]         = useState(FALLBACK_SETTINGS);
  const [companyLinks, setCompanyLinks]   = useState(FALLBACK_COMPANY);
  const [serviceLinks, setServiceLinks]   = useState(FALLBACK_SERVICES);
  const [industryLinks, setIndustryLinks] = useState(FALLBACK_INDUSTRIES);
  const [insightLinks, setInsightLinks]   = useState(FALLBACK_INSIGHTS);
  const [socialLinks, setSocialLinks]     = useState(FALLBACK_SOCIAL);
  const [legalLinks, setLegalLinks]       = useState(FALLBACK_LEGAL);

  useEffect(() => {
    getCompanySettings()
      .then((res) => setSettings(res.data || FALLBACK_SETTINGS))
      .catch(() => {});

    const load = (section, setter) =>
      getNavLinks(section)
        .then((res) => { if (res.data?.length) setter(toLinks(res.data)); })
        .catch(() => {});

    load('FOOTER_COMPANY',    setCompanyLinks);
    load('FOOTER_SERVICES',   setServiceLinks);
    load('FOOTER_INDUSTRIES', setIndustryLinks);
    load('FOOTER_INSIGHTS',   setInsightLinks);
    load('SOCIAL_LINKS', (links) => setSocialLinks(links.filter((s) => s.label === 'LinkedIn' || s.label === 'Twitter')));
    load('FOOTER_LEGAL',      setLegalLinks);
  }, []);

  const handleNewsletter = async (e) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }
    setStatus('loading');
    setMessage('');
    try {
      const res = await subscribe(trimmed);
      if (res.data.success) {
        setStatus('success');
        setMessage(res.data.message);
        setEmail('');
      } else {
        setStatus('duplicate');
        setMessage(res.data.message);
      }
    } catch {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <footer className="footer">

      {/* ── Newsletter Strip ── */}
      <div className="footer__newsletter">
        <div className="footer__newsletter-inner">
          <div className="footer__newsletter-text">
            <span className="footer__newsletter-title">Stay Ahead of the Curve</span>
            <span className="footer__newsletter-sub">
              Get the latest insights, research, and industry news delivered to your inbox.
            </span>
          </div>
          <div className="footer__newsletter-form-wrap">
            <form className="footer__newsletter-form" onSubmit={handleNewsletter}>
              <input
                type="email"
                className="footer__newsletter-input"
                placeholder="Enter your email address"
                aria-label="Email address for newsletter"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === 'loading'}
              />
              <button
                type="submit"
                className="footer__newsletter-btn"
                disabled={status === 'loading'}
              >
                {status === 'loading' ? 'Subscribing…' : 'Subscribe'}
              </button>
            </form>
            {status === 'success' && (
              <p className="footer__newsletter-feedback footer__newsletter-feedback--success">
                {message}
              </p>
            )}
            {(status === 'duplicate' || status === 'error') && (
              <p className="footer__newsletter-feedback footer__newsletter-feedback--error">
                {message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── Main Body ── */}
      <div className="footer__body">
        <div className="footer__body-inner">

          {/* Brand + Contact */}
          <div className="footer__brand">
            <Link to="/" className="footer__logo">
              <img src="/images/logo.png" alt="Visionary Inspire" className="footer__logo-img" />
            </Link>

            <p className="footer__tagline">
              Partnering with global enterprises to deliver customer experience,
              intelligent automation, and data-driven transformation that creates
              lasting competitive advantage.
            </p>

            <div className="footer__contact">
              <a href={`tel:${settings.phone?.replace(/\s/g, '')}`} className="footer__contact-item">
                {PHONE_ICON}
                {settings.phone}
              </a>
              <a href={`mailto:${settings.email}`} className="footer__contact-item">
                {MAIL_ICON}
                {settings.email}
              </a>
              <div className="footer__contact-item">
                {MAP_ICON}
                Chennai · Hyderabad · Bangalore
              </div>
            </div>

            <div className="footer__social">
              {socialLinks.map((s) => (
                <a key={s.label} href={s.url} className="footer__social-link" aria-label={s.label}>
                  {SOCIAL_ICONS[s.label]}
                </a>
              ))}
            </div>
          </div>

          <FooterCol heading="Company"    links={companyLinks}  />
          <FooterCol heading="Services"   links={serviceLinks}  />
          <FooterCol heading="Industries" links={industryLinks} />
          <FooterCol heading="Insights"   links={insightLinks}  />

        </div>
      </div>

      {/* ── Certifications ── */}
      <div className="footer__certs">
        <div className="footer__certs-inner">
          <span className="footer__cert-label">Certifications &amp; Standards</span>
          <div className="footer__cert-badges">
            {['ISO 9001:2015', 'ISO 27001', 'SOC 2 Type II', 'GDPR Compliant', 'HIPAA Compliant'].map((badge) => (
              <span key={badge} className="footer__cert-badge">{badge}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom Bar ── */}
      <div className="footer__bottom">
        <div className="footer__bottom-inner">
          <p className="footer__copyright">
            &copy; {year} Visionary Inspire. All rights reserved.
          </p>
          <div className="footer__legal-links">
            {legalLinks.map((l) => (
              <a key={l.label} href={l.url} className="footer__legal-link">{l.label}</a>
            ))}
          </div>
        </div>
      </div>

    </footer>
  );
}
