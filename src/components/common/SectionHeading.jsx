import '../../css/components.css';

export default function SectionHeading({ eyebrow, title, subtitle, center = false, white = false }) {
  const baseClass = 'section-heading';
  const modifiers = [
    center ? `${baseClass}--center` : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={`${baseClass} ${modifiers}`}>
      {eyebrow && (
        <span className="section-heading__eyebrow">{eyebrow}</span>
      )}
      {title && (
        <h2 className={`section-heading__title${white ? ' section-heading__title--white' : ''}`}>
          {title}
        </h2>
      )}
      {subtitle && (
        <p className="section-heading__subtitle">{subtitle}</p>
      )}
    </div>
  );
}
