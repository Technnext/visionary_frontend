import '../../css/components.css';

export default function PageHero({ eyebrow, title, description, children }) {
  return (
    <section className="page-hero">
      <div className="page-hero__container">
        {eyebrow && (
          <span className="page-hero__eyebrow">{eyebrow}</span>
        )}
        {title && (
          <h1 className="page-hero__title">{title}</h1>
        )}
        {description && (
          <p className="page-hero__description">{description}</p>
        )}
        {children}
      </div>
    </section>
  );
}
