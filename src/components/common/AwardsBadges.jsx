import '../../css/components.css';

export default function AwardsBadges({ awards = [] }) {
  if (!awards.length) return null;

  return (
    <div className="awards">
      <div className="awards__grid">
        {awards.map((award) => (
          <div className="awards__item" key={award.id}>
            {award.logoUrl && (
              <img
                src={award.logoUrl}
                alt={award.title}
                className="awards__logo"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = '/images/awards/default-award.png';
                }}
              />
            )}
            <div className="awards__info">
              <span className="awards__title">{award.title}</span>
              {award.year && (
                <span className="awards__year">{award.year}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
