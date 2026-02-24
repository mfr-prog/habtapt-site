import React from 'react';
import { Hero } from '../components/Hero';
import { Services } from '../components/Services';
import { Portfolio } from '../components/Portfolio';
import { Process } from '../components/Process';
import { Testimonials } from '../components/Testimonials';
import { Insights } from '../components/Insights';
import { Contact } from '../components/Contact';

export function HomePage() {
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
