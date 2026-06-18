import '../../css/components.css';

export default function StatsBanner({ stats = [] }) {
  return (
    <section className="stats-banner">
      <div className="stats-banner__container">
        {stats.map((stat, index) => (
          <div className="stats-banner__item" key={index}>
            <div className="stats-banner__value">
              {stat.value}
              {stat.suffix && (
                <span className="stats-banner__suffix">{stat.suffix}</span>
              )}
            </div>
            <div className="stats-banner__label">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
