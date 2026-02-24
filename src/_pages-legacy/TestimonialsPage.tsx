import React from 'react';
import { Testimonials } from '../components/Testimonials';
import { Section } from '../components/Section';

export function TestimonialsPage() {
  return (
    <Section
      background="white"
      style={{
        paddingTop: '7.5rem',
      }}
    >
      <Testimonials />
    </Section>
  );
}
