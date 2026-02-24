import React from 'react';
import { Contact } from '../components/Contact';
import { Section } from '../components/Section';

export function ContactPage() {
  return (
    <Section
      background="white"
      style={{
        paddingTop: '7.5rem',
      }}
    >
      <Contact />
    </Section>
  );
}
