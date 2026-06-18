import '../../css/components.css';

export default function LogoMarquee({ logos = [] }) {
  const doubled = [...logos, ...logos];

  return (
    <div className="logo-marquee">
      <div className="logo-marquee__track">
        {doubled.map((logo, index) => (
          <div className="logo-marquee__item" key={index}>
            <img
              src={logo.imageUrl}
              alt={logo.name}
              className="logo-marquee__img"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
