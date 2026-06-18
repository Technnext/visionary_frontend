import HeroSection from '../components/home/HeroSection';
import StatsSection from '../components/home/StatsSection';
import ServicesSection from '../components/home/ServicesSection';
import IndustriesSection from '../components/home/IndustriesSection';
import TestimonialsSection from '../components/home/TestimonialsSection';
import AwardsSection from '../components/home/AwardsSection';
import CTASection from '../components/home/CTASection';
export default function HomePage() {
  return (
    <div className="home-page">
      <HeroSection />
      <StatsSection />
      <ServicesSection />
      <IndustriesSection />
      <TestimonialsSection />
      <AwardsSection />
      <CTASection />
    </div>
  );
}
