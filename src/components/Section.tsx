import React from 'react';
import { designSystem } from './design-system';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  background?: 'default' | 'muted' | 'primary' | 'white';
  style?: React.CSSProperties;
}

export function Section({ children, className = '', id, background = 'default', style }: SectionProps) {
  const bgClass = {
    default: 'bg-background',
    muted: 'bg-muted',
    primary: 'bg-primary',
    white: 'bg-white',
  }[background];

  return (
    <section 
      id={id} 
      className={`${bgClass} ${className}`} 
      style={{
        paddingTop: designSystem.spacing[16],
        paddingBottom: designSystem.spacing[16],
        ...style
      }}
    >
      {children}
    </section>
  );
}
