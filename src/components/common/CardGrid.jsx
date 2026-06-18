import '../../css/components.css';

export default function CardGrid({ columns = 3, children }) {
  const validColumns = [2, 3, 4].includes(columns) ? columns : 3;

  return (
    <div className={`card-grid card-grid--${validColumns}`}>
      {children}
    </div>
  );
}
