import { Link } from 'react-router-dom';
import '../../css/components.css';

export default function CTABanner({ title, subtitle, primaryLabel, primaryTo, secondaryLabel, secondaryTo }) {
  return (
    <section className="cta-banner">
      <div className="cta-banner__container">
        <div className="cta-banner__content">
          {title && <h2 className="cta-banner__title">{title}</h2>}
          {subtitle && <p className="cta-banner__subtitle">{subtitle}</p>}
        </div>
        <div className="cta-banner__actions">
          {primaryLabel && primaryTo && (
            <Link to={primaryTo} className="btn btn--primary">
              {primaryLabel}
            </Link>
          )}
          {secondaryLabel && secondaryTo && (
            <Link to={secondaryTo} className="btn btn--outline-white">
              {secondaryLabel}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
