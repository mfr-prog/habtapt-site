import React from 'react';
import { Portfolio } from '../components/Portfolio';
import { Section } from '../components/Section';

export function PortfolioPage() {
  return (
    <Section
      background="white"
      style={{
        paddingTop: '7.5rem',
      }}
    >
      <Portfolio />
    </Section>
  );
}
