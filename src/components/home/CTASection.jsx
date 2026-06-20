import { useState, useEffect } from 'react';
import CTABanner from '../common/CTABanner';
import { getCtaSection } from '../../services/ctaSectionService';
import '../../css/cta-section.css';

const FALLBACK = {
  title: 'Ready to Transform Your Business?',
  description: 'Talk to our experts and discover how Visionary Inspire can help you achieve your goals.',
  primaryButtonText: 'Get in Touch',
  primaryButtonUrl: '/contact',
  secondaryButtonText: 'Explore Services',
  secondaryButtonUrl: '/mortgage-services',
};

export default function CTASection() {
  const [cta, setCta] = useState(FALLBACK);

  useEffect(() => {
    getCtaSection('home_main')
      .then((res) => { if (res.data) setCta({ ...res.data, secondaryButtonUrl: '/mortgage-services' }); })
      .catch(() => {});
  }, []);

  return (
    <div className="cta-section">
      <CTABanner
        title={cta.title}
        subtitle={cta.description}
        primaryLabel={cta.primaryButtonText}
        primaryTo={cta.primaryButtonUrl}
        secondaryLabel={cta.secondaryButtonText}
        secondaryTo={cta.secondaryButtonUrl}
      />
    </div>
  );
}
