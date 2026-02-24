import React from 'react';
import { Insights } from '../components/Insights';
import { Section } from '../components/Section';

export function InsightsPage() {
  return (
    <Section
      background="white"
      style={{
        paddingTop: '7.5rem',
      }}
    >
      <Insights />
    </Section>
  );
}
