import type { Metadata } from 'next';
import { Hero } from '@/components/Hero';
import { Services } from '@/components/Services';
import { Portfolio } from '@/components/Portfolio';
import { Process } from '@/components/Process';
import { Testimonials } from '@/components/Testimonials';
import { Insights } from '@/components/Insights';
import { Contact } from '@/components/Contact';

export const metadata: Metadata = {
  description: 'Homepage - reabilitacao urbana e investimento imobiliario em Portugal',
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <Services />
      <Portfolio />
      <Process />
      <Testimonials />
      <Insights />
      <Contact />
    </>
  );
}
