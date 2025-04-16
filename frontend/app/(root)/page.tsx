import Hero from '@/components/home/Hero';
import HowItWorks from '@/components/home/HowItWorks';
import Testimonials from '@/components/home/Testimonials';

export default function HomePage() {
  return (
    <div className="flex-1">
      <Hero />
      <HowItWorks />
      <Testimonials />
    </div>
  );
}
