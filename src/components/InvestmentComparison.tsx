'use client';

import React from 'react';
import { motion } from 'motion/react';
import { useInView } from './useInView';
import { designSystem } from './design-system';
import { TrendingUp } from './icons';

interface InvestmentComparisonProps {
  investmentValue?: string;
}

const comparisons = [
  {
    label: 'Depósitos a Prazo (anual)',
    rate: 3,
    color: designSystem.colors.neutral[400],
    bgColor: designSystem.helpers.hexToRgba(designSystem.colors.neutral[400], 0.15),
  },
  {
    label: 'Bolsa / ETFs (anual)',
    rate: 7,
    color: designSystem.colors.brand.tertiary,
    bgColor: designSystem.helpers.hexToRgba(designSystem.colors.brand.tertiary, 0.15),
  },
  {
    label: 'HABTA Fix & Flip (por projeto)',
    rate: 30,
    color: designSystem.colors.brand.secondary,
    bgColor: designSystem.helpers.hexToRgba(designSystem.colors.brand.secondary, 0.15),
    highlight: true,
  },
];

const maxRate = Math.max(...comparisons.map((c) => c.rate));

export function InvestmentComparison({ investmentValue }: InvestmentComparisonProps) {
  const { ref, isInView } = useInView({ threshold: 0.2 });

  const parseValue = (str?: string) => {
    if (!str) return 0;
    return parseFloat(str.replace(/[€,.\s]/g, '').trim()) || 0;
  };

  const baseInvestment = parseValue(investmentValue) || 400000;

  return (
    <div ref={ref}>
      <h3
        style={{
          color: designSystem.colors.neutral[900],
          marginBottom: designSystem.spacing[2],
          fontSize: designSystem.typography.fontSize['2xl'],
          fontWeight: designSystem.typography.fontWeight.bold,
        }}
      >
        Comparação de Rendimento
      </h3>
      <p
        style={{
          color: designSystem.colors.neutral[600],
          fontSize: designSystem.typography.fontSize.sm,
          marginBottom: designSystem.spacing[8],
        }}
      >
        Retorno estimado com base num investimento de €{baseInvestment.toLocaleString('pt-PT')}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: designSystem.spacing[6] }}>
        {comparisons.map((item, index) => {
          const profit = Math.round(baseInvestment * (item.rate / 100));
          const barWidth = (item.rate / maxRate) * 100;

          return (
            <div key={item.label}>
              <div
                className="flex items-center justify-between"
                style={{ marginBottom: designSystem.spacing[2] }}
              >
                <div className="flex items-center" style={{ gap: designSystem.spacing[2] }}>
                  {item.highlight && <TrendingUp size={16} style={{ color: item.color }} />}
                  <span
                    style={{
                      fontSize: designSystem.typography.fontSize.sm,
                      fontWeight: item.highlight
                        ? designSystem.typography.fontWeight.bold
                        : designSystem.typography.fontWeight.medium,
                      color: item.highlight ? designSystem.colors.neutral[900] : designSystem.colors.neutral[700],
                    }}
                  >
                    {item.label}
                  </span>
                </div>
                <div className="flex items-center" style={{ gap: designSystem.spacing[3] }}>
                  <span
                    style={{
                      fontSize: designSystem.typography.fontSize.sm,
                      color: designSystem.colors.neutral[600],
                    }}
                  >
                    +€{profit.toLocaleString('pt-PT')}
                  </span>
                  <span
                    style={{
                      fontSize: designSystem.typography.fontSize.base,
                      fontWeight: designSystem.typography.fontWeight.bold,
                      color: item.color,
                    }}
                  >
                    {item.rate}%
                  </span>
                </div>
              </div>

              {/* Bar */}
              <div
                style={{
                  width: '100%',
                  height: item.highlight ? '12px' : '8px',
                  background: designSystem.colors.neutral[100],
                  borderRadius: designSystem.borderRadius.full,
                  overflow: 'hidden',
                }}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={isInView ? { width: `${barWidth}%` } : { width: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 + index * 0.15, ease: 'easeOut' }}
                  style={{
                    height: '100%',
                    background: item.highlight
                      ? designSystem.colors.gradients.secondary
                      : item.color,
                    borderRadius: designSystem.borderRadius.full,
                    boxShadow: item.highlight ? designSystem.shadows.secondaryHover : 'none',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
