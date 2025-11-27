/**
 * Financial Card Primitivo - Componente de análise financeira
 * Seguindo Guardião Universal de Front-End
 */

import React from 'react';
import { motion } from 'motion/react';
import { designSystem } from '../design-system';

export interface FinancialData {
  acquisition?: string;
  renovation?: string;
  total?: string;
  sale?: string;
  profit?: string;
  roi?: string;
}

interface FinancialCardProps {
  data: FinancialData;
  title?: string;
  animated?: boolean;
  delay?: number;
  className?: string;
}

interface FinancialRowProps {
  label: string;
  value: string;
  variant?: 'default' | 'success' | 'highlight';
  isLast?: boolean;
}

function FinancialRow({ label, value, variant = 'default', isLast = false }: FinancialRowProps) {
  const valueColors = {
    default: designSystem.colors.neutral[900],
    success: designSystem.colors.semantic.success,
    highlight: designSystem.colors.brand.secondary,
  };

  const isHighlightBox = variant === 'highlight';

  if (isHighlightBox) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: designSystem.spacing[4],
          background: designSystem.helpers.hexToRgba(designSystem.colors.brand.secondary, 0.1),
          borderRadius: designSystem.borderRadius.lg,
        }}
      >
        <span
          style={{
            color: designSystem.colors.neutral[700],
            fontWeight: designSystem.typography.fontWeight.semibold,
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontSize: designSystem.typography.fontSize['2xl'],
            color: valueColors[variant],
            fontWeight: designSystem.typography.fontWeight.bold,
          }}
        >
          {value}
        </span>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: isLast ? 0 : designSystem.spacing[4],
        borderBottom: isLast ? 'none' : `1px solid ${designSystem.colors.neutral[200]}`,
      }}
    >
      <span style={{ color: designSystem.colors.neutral[600] }}>{label}</span>
      <span
        style={{
          color: valueColors[variant],
          fontWeight: variant === 'success' ? designSystem.typography.fontWeight.bold : designSystem.typography.fontWeight.semibold,
        }}
      >
        {value}
      </span>
    </div>
  );
}

export function FinancialCard({
  data,
  title,
  animated = true,
  delay = 0.2,
  className = '',
}: FinancialCardProps) {
  const Wrapper = animated ? motion.div : 'div';
  const wrapperProps = animated
    ? {
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, delay },
      }
    : {};

  const rows: Array<{ key: keyof FinancialData; label: string; variant?: 'default' | 'success' | 'highlight' }> = [
    { key: 'acquisition', label: 'Aquisição' },
    { key: 'renovation', label: 'Renovação' },
    { key: 'total', label: 'Investimento Total' },
    { key: 'sale', label: 'Venda' },
    { key: 'profit', label: 'Lucro', variant: 'success' },
  ];

  const visibleRows = rows.filter(row => data[row.key]);
  const hasRoi = data.roi;

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
      <div style={{ display: 'flex', flexDirection: 'column', gap: designSystem.spacing[4] }}>
        {visibleRows.map((row, index) => {
          const value = data[row.key];
          if (!value) return null;

          return (
            <FinancialRow
              key={row.key}
              label={row.label}
              value={value}
              variant={row.variant}
              isLast={index === visibleRows.length - 1 && !hasRoi}
            />
          );
        })}

        {hasRoi && <FinancialRow label="ROI" value={data.roi!} variant="highlight" isLast />}
      </div>
    </Wrapper>
  );
}
