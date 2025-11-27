/**
 * Characteristics Grid Primitivo - Grade de características do imóvel
 * Seguindo Guardião Universal de Front-End
 */

import React from 'react';
import { motion } from 'motion/react';
import { designSystem } from '../design-system';
import { Bed, Bath, Ruler, Home, Calendar } from '../icons';

export interface Characteristic {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}

interface CharacteristicsGridProps {
  bedrooms?: number;
  bathrooms?: number;
  area?: string;
  type?: string;
  year?: string;
  title?: string;
  animated?: boolean;
  delay?: number;
  className?: string;
}

export function CharacteristicsGrid({
  bedrooms,
  bathrooms,
  area,
  type,
  year,
  title,
  animated = true,
  delay = 0.1,
  className = '',
}: CharacteristicsGridProps) {
  const Wrapper = animated ? motion.div : 'div';
  const wrapperProps = animated
    ? {
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, delay },
      }
    : {};

  const characteristics: Characteristic[] = [];

  if (bedrooms && bedrooms > 0) {
    characteristics.push({
      icon: <Bed size={16} />,
      label: 'Quartos',
      value: bedrooms,
    });
  }

  if (bathrooms && bathrooms > 0) {
    characteristics.push({
      icon: <Bath size={16} />,
      label: 'Casas de Banho',
      value: bathrooms,
    });
  }

  if (area) {
    characteristics.push({
      icon: <Ruler size={16} />,
      label: 'Área',
      value: area,
    });
  }

  if (type) {
    characteristics.push({
      icon: <Home size={16} />,
      label: 'Tipo',
      value: type,
    });
  }

  if (year) {
    characteristics.push({
      icon: <Calendar size={16} />,
      label: 'Ano',
      value: year,
    });
  }

  if (characteristics.length === 0) {
    return null;
  }

  return (
    <Wrapper
      {...wrapperProps}
      className={className}
      style={{
        background: designSystem.colors.neutral.white,
        padding: designSystem.spacing[5],
        borderRadius: designSystem.borderRadius.xl,
        boxShadow: designSystem.shadows.sm,
      }}
    >
      {title && (
        <h3
          style={{
            color: designSystem.colors.neutral[900],
            marginBottom: designSystem.spacing[5],
          }}
        >
          {title}
        </h3>
      )}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: designSystem.spacing[4],
        }}
      >
        {characteristics.map((char, index) => (
          <CharacteristicItem key={index} {...char} />
        ))}
      </div>
    </Wrapper>
  );
}

function CharacteristicItem({ icon, label, value }: Characteristic) {
  return (
    <div>
      <div
        className="inline-flex items-center gap-2"
        style={{
          color: designSystem.colors.neutral[600],
          fontSize: designSystem.typography.fontSize.sm,
          marginBottom: designSystem.spacing[1],
        }}
      >
        {icon}
        <span>{label}</span>
      </div>
      <div
        style={{
          color: designSystem.colors.neutral[900],
        }}
      >
        {value}
      </div>
    </div>
  );
}
