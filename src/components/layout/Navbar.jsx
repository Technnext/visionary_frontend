import { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { getAllServices } from '../../services/servicesService';
import { getMortgageServices } from '../../services/mortgageServicesService';
import { getCompanySettings } from '../../services/companySettingsService';
import { getNavLinks } from '../../services/navigationService';
import '../../css/navbar.css';

const FALLBACK_SETTINGS = {
  phone: '+91 82967 66781',
  email: 'info@visionaryinspire.com',
  tagline: 'Transforming businesses through people, process & technology',
};

// Split a flat array into N roughly-equal columns
function splitIntoColumns(arr, n) {
  const cols = Array.from({ length: n }, () => []);
  arr.forEach((item, i) => cols[i % n].push(item));
  return cols;
}

// ─── SVG constants ────────────────────────────────────────────────────────────
const CHEVRON  = <svg className="navbar__link-chevron" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>;
const ARROW    = <svg viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>;
const CLOSE    = <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const PHONE    = <svg viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.35 2 2 0 0 1 3.6 1.28h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.84a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;
const MAIL     = <svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>;
const LI_ICON  = <svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>;
const TW_ICON  = <svg viewBox="0 0 24 24" fill="currentColor"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>;

// ─── Industries simple dropdown ────────────────────────────────────────────────
function IndustriesDropdown({ links }) {
  return (
    <div className="navbar__dropdown">
      {links.length > 0 && (
        <>
          {links.map((item) => (
            <Link key={item.url} to={item.url} className="navbar__dropdown-item">
              <div className="navbar__dropdown-text">
                <span className="navbar__dropdown-label">{item.label}</span>
              </div>
            </Link>
          ))}
          <div className="navbar__dropdown-divider" />
        </>
      )}
      <Link to="/industries" className="navbar__dropdown-footer">
        View All Industries {ARROW}
      </Link>
    </div>
  );
}

// ─── Digital Operations title overrides ─────────────────────────────────────
const TITLE_OVERRIDES = {
  'Enterprise Agency Platform – Mphasis TRIA':   'Enterprise Agency Platform – Visionary Inspire TRIA',
  'Product Line – Mphasis Modernize':            'Product Line – Visionary Inspire Modernize',
  'Product Line – Mphasis Optimize':             'Product Line – Visionary Inspire Optimize',
};

// ─── Digital Operations Mega Menu (API-driven, 4 cols) ───────────────────────
function DigitalOpsMegaMenu({ services }) {
  const filtered = services
    .filter((svc) => svc.title !== 'Blockchain')
    .map((svc) => ({ ...svc, title: TITLE_OVERRIDES[svc.title] ?? svc.title }));
  const cols = splitIntoColumns(filtered, 4);
  return (
    <div className="navbar__mega">
      <div className="navbar__mega-inner">
        {cols.map((col, idx) => (
          <div key={idx} className="navbar__mega-col">
            <ul className="navbar__mega-col-list">
              {col.map((svc) => (
                <li key={svc.slug}>
                  <Link to={`/services/${svc.slug}`} className="navbar__mega-item">
                    <span className="navbar__mega-item-title">{svc.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="navbar__mega-footer">
        <Link to="/services" className="navbar__mega-footer-link">
          View All Digital Operations {ARROW}
        </Link>
      </div>
    </div>
  );
}

// ─── Services Mega Menu (API-driven, 3 cols) ─────────────────────────────────
function NewServicesMegaMenu({ mortgageServices }) {
  const cols = splitIntoColumns(mortgageServices, 3);
  return (
    <div className="navbar__mega navbar__mega--3col">
      <div className="navbar__mega-inner navbar__mega-inner--3col">
        {cols.map((col, idx) => (
          <div key={idx} className="navbar__mega-col">
            <ul className="navbar__mega-col-list">
              {col.map((svc) => (
                <li key={svc.slug}>
                  <Link to={`/mortgage-services/${svc.slug}`} className="navbar__mega-item">
                    <span className="navbar__mega-item-title">{svc.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="navbar__mega-footer">
        <Link to="/mortgage-services" className="navbar__mega-footer-link">
          Specialised Financial Services {ARROW}
        </Link>
      </div>
    </div>
  );
}

// ─── Mobile drawer accordion section ─────────────────────────────────────────
function DrawerSection({ label, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={`navbar__drawer-section${open ? ' navbar__drawer-section--open' : ''}`}>
      <button className="navbar__drawer-section-toggle" onClick={() => setOpen((p) => !p)}>
        {label}
        <svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
      </button>
      <div className="navbar__drawer-section-links">
        {children}
      </div>
    </div>
  );
}

// ─── Main Navbar ──────────────────────────────────────────────────────────────
export default function Navbar() {
  const [drawerOpen, setDrawerOpen]         = useState(false);
  const [services, setServices]             = useState([]);
  const [mortgageServices, setMortgageServices] = useState([]);
  const [settings, setSettings]             = useState(FALLBACK_SETTINGS);
  const [industryLinks, setIndustryLinks]   = useState([]);
  const [topbarSocial, setTopbarSocial]     = useState({ linkedin: '#', twitter: '#' });
  const location  = useLocation();
  const drawerRef = useRef(null);

  useEffect(() => {
    getAllServices()
      .then((res) => setServices(res.data || []))
      .catch(() => {});
    getMortgageServices()
      .then((res) => setMortgageServices(res.data || []))
      .catch(() => {});
    getCompanySettings()
      .then((res) => setSettings(res.data || FALLBACK_SETTINGS))
      .catch(() => {});
    getNavLinks('INDUSTRIES_DROPDOWN')
      .then((res) => {
        const links = res.data || [];
        if (links.length) setIndustryLinks(links.map((l) => ({ label: l.label, url: l.url })));
      })
      .catch(() => { setIndustryLinks([]); });
    getNavLinks('SOCIAL_LINKS')
      .then((res) => {
        const links = res.data || [];
        const find = (label) => links.find((l) => l.label === label)?.url ?? '#';
        setTopbarSocial({ linkedin: find('LinkedIn'), twitter: find('Twitter') });
      })
      .catch(() => {});
  }, []);

  // Close drawer on route change
  useEffect(() => { setDrawerOpen(false); }, [location]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  const isServicesActive   = location.pathname.startsWith('/services');
  const isIndustriesActive = location.pathname.startsWith('/industries');

  return (
    <>
      <header className="navbar">

        {/* ── Topbar ── */}
        <div className="navbar__topbar">
          <div className="navbar__topbar-inner">
            <div className="navbar__topbar-left">
              <a href={`tel:${settings.phone?.replace(/\s/g, '')}`} className="navbar__topbar-item">
                {PHONE} {settings.phone}
              </a>
              <div className="navbar__topbar-divider" />
              <a href={`mailto:${settings.email}`} className="navbar__topbar-item">
                {MAIL} {settings.email}
              </a>
            </div>
            <div className="navbar__topbar-right">
              <span className="navbar__topbar-tagline">
                {settings.tagline}
              </span>
              <div className="navbar__topbar-divider" />
              <div className="navbar__topbar-social">
                <a href={topbarSocial.linkedin} className="navbar__topbar-social-link" aria-label="LinkedIn">{LI_ICON}</a>
                <a href={topbarSocial.twitter} className="navbar__topbar-social-link" aria-label="Twitter">{TW_ICON}</a>
              </div>
            </div>
          </div>
        </div>

        {/* ── Main Bar ── */}
        <div className="navbar__main">
          <div className="navbar__main-inner">

            {/* Logo */}
            <Link to="/" className="navbar__logo">
              <img src="/images/logo.png" alt="Visionary Inspire" className="navbar__logo-img" />
            </Link>

            {/* Desktop Nav */}
            <nav className="navbar__nav" role="navigation">

              <div className="navbar__item">
                <NavLink to="/about" className={({ isActive }) => `navbar__link${isActive ? ' navbar__link--active' : ''}`}>
                  About
                </NavLink>
              </div>

              {/* Services — new mega menu */}
              <div className="navbar__item navbar__item--mega">
                <span className="navbar__link">
                  Services {CHEVRON}
                </span>
                <NewServicesMegaMenu mortgageServices={mortgageServices} />
              </div>

              {/* Digital Operations — mega menu trigger */}
              <div className="navbar__item navbar__item--mega">
                <Link
                  to="/services"
                  className={`navbar__link${isServicesActive ? ' navbar__link--active' : ''}`}
                >
                  Digital Operations {CHEVRON}
                </Link>
                <DigitalOpsMegaMenu services={services} />
              </div>

              <div className="navbar__item navbar__item--mega">
                <Link
                  to="/industries"
                  className={`navbar__link${isIndustriesActive ? ' navbar__link--active' : ''}`}
                >
                  Industries {CHEVRON}
                </Link>
                <IndustriesDropdown links={industryLinks} />
              </div>

              <div className="navbar__item">
                <NavLink to="/insights" className={({ isActive }) => `navbar__link${isActive ? ' navbar__link--active' : ''}`}>
                  Insights
                </NavLink>
              </div>

              <div className="navbar__item">
                <NavLink to="/careers" className={({ isActive }) => `navbar__link${isActive ? ' navbar__link--active' : ''}`}>
                  Careers
                </NavLink>
              </div>

            </nav>

            {/* Desktop CTA */}
            <div className="navbar__actions">
              <Link to="/contact" className="navbar__cta">
                Get in Touch
                <svg viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </Link>
            </div>

            {/* Mobile Toggle */}
            <button
              className={`navbar__toggle${drawerOpen ? ' navbar__toggle--open' : ''}`}
              onClick={() => setDrawerOpen((p) => !p)}
              aria-label="Toggle navigation"
              aria-expanded={drawerOpen}
            >
              <span className="navbar__toggle-bar" />
              <span className="navbar__toggle-bar" />
              <span className="navbar__toggle-bar" />
            </button>

          </div>
        </div>
      </header>

      {/* ── Mobile Overlay ── */}
      <div
        className={`navbar__overlay${drawerOpen ? ' navbar__overlay--visible' : ''}`}
        onClick={() => setDrawerOpen(false)}
        aria-hidden="true"
      />

      {/* ── Mobile Drawer ── */}
      <nav
        ref={drawerRef}
        className={`navbar__drawer${drawerOpen ? ' navbar__drawer--open' : ''}`}
        aria-label="Mobile navigation"
      >
        <div className="navbar__drawer-header">
          <Link to="/" className="navbar__drawer-logo" onClick={() => setDrawerOpen(false)}>
            <img src="/images/logo.png" alt="Visionary Inspire" className="navbar__logo-img navbar__logo-img--drawer" />
          </Link>
          <button className="navbar__drawer-close" onClick={() => setDrawerOpen(false)} aria-label="Close menu">
            {CLOSE}
          </button>
        </div>

        <div className="navbar__drawer-body">
          <Link to="/about" className="navbar__drawer-link">About Us</Link>

          <DrawerSection label="Services">
            {mortgageServices.map((svc) => (
              <Link key={svc.slug} to={`/mortgage-services/${svc.slug}`} className="navbar__drawer-sub-link">
                {svc.title}
              </Link>
            ))}
          </DrawerSection>

          <DrawerSection label="Digital Operations">
            {services.map((svc) => (
              <Link key={svc.slug} to={`/services/${svc.slug}`} className="navbar__drawer-sub-link">
                {svc.title}
              </Link>
            ))}
            <Link to="/services" className="navbar__drawer-sub-link navbar__drawer-sub-link--all">
              View All Digital Operations →
            </Link>
          </DrawerSection>

          <DrawerSection label="Industries">
            {industryLinks.map((i) => (
              <Link key={i.url} to={i.url} className="navbar__drawer-sub-link">{i.label}</Link>
            ))}
            <Link to="/industries" className="navbar__drawer-sub-link navbar__drawer-sub-link--all">View All Industries →</Link>
          </DrawerSection>

          <Link to="/insights" className="navbar__drawer-link">Insights</Link>
          <Link to="/careers"  className="navbar__drawer-link">Careers</Link>
          <Link to="/contact"  className="navbar__drawer-link">Contact Us</Link>
        </div>

        <div className="navbar__drawer-footer">
          <Link to="/contact" className="navbar__drawer-cta" onClick={() => setDrawerOpen(false)}>
            Get in Touch
          </Link>
        </div>
      </nav>
    </>
  );
}
