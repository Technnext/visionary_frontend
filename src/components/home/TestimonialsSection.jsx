import { useState, useEffect } from 'react';
import SectionHeading from '../common/SectionHeading';
import TestimonialsSlider from '../common/TestimonialsSlider';
import Loader from '../common/Loader';
import { getTestimonials } from '../../services/homeService';
import '../../css/testimonials-section.css';

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTestimonials()
      .then((res) => setTestimonials(res.data || []))
      .catch(() => setTestimonials([]))
      .finally(() => setLoading(false));
  }, []);

  if (!loading && !testimonials.length) return null;

  return (
    <section className="testimonials-section">
      <div className="testimonials-section__container">
        <SectionHeading
          eyebrow="Client Stories"
          title="What Our Clients Say"
          subtitle="Hear directly from the enterprise leaders we partner with on their most critical transformation programmes."
          center
        />
        {loading ? <Loader /> : <TestimonialsSlider testimonials={testimonials} />}
      </div>
    </section>
  );
}
