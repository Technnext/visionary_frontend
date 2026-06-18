import '../../css/components.css';

function TestimonialCard({ quote, authorName, authorTitle, company, photoUrl }) {
  return (
    <div className="testimonial-card">
      <p className="testimonial-card__quote">&ldquo;{quote}&rdquo;</p>
      <div className="testimonial-card__author">
        {photoUrl && (
          <img
            src={photoUrl}
            alt={authorName}
            className="testimonial-card__avatar"
          />
        )}
        <div>
          <div className="testimonial-card__name">{authorName}</div>
          <div className="testimonial-card__role">
            {authorTitle}{company ? `, ${company}` : ''}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TestimonialsSlider({ testimonials = [] }) {
  if (!testimonials.length) return null;

  return (
    <div className="testimonials__slider">
      {testimonials.map((item) => (
        <TestimonialCard
          key={item.id}
          quote={item.quote}
          authorName={item.authorName}
          authorTitle={item.authorTitle}
          company={item.company}
          photoUrl={item.photoUrl}
        />
      ))}
    </div>
  );
}
