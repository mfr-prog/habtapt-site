// Admin: Compact Metric Card - 100% Conformidade Guardião
import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { colors, shadows, radius, spacing, typography } from '../../utils/styles';
import { designSystem } from '../design-system';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'primary' | 'secondary' | 'success' | 'warning';
  delay?: number;
}

export function MetricCard({
  title,
  value,
  icon: Icon,
  trend,
  color = 'primary',
}: MetricCardProps) {
  const colorMap = {
    primary: colors.primary,
    secondary: colors.secondary,
    success: colors.success,
    warning: colors.warning,
  };

  const selectedColor = colorMap[color];
  const ariaLabel = `${title}: ${value}${trend ? `, tendência ${trend.isPositive ? 'positiva' : 'negativa'} de ${trend.value}%` : ''}`;

  return (
    <article
      aria-label={ariaLabel}
      style={{
        background: colors.white,
        borderRadius: radius.lg,
        padding: spacing[4],
        border: `1px solid ${colors.gray[200]}`,
        transition: 'all 0.2s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = shadows.base;
        e.currentTarget.style.borderColor = colors.gray[300];
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.borderColor = colors.gray[200];
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: spacing[3] }}>
        <div
          aria-hidden="true"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '36px',
            height: '36px',
            borderRadius: radius.md,
            background: designSystem.helpers.hexToRgba(selectedColor, 0.1),
          }}
        >
          <Icon size={18} style={{ color: selectedColor }} />
        </div>

        {trend && (
          <div
            aria-label={`Tendência ${trend.isPositive ? 'positiva' : 'negativa'} de ${trend.value} por cento`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing[1],
              padding: `${spacing[1]} ${spacing[2]}`,
              borderRadius: radius.md,
              background: designSystem.helpers.hexToRgba(
                trend.isPositive ? colors.success : colors.error,
                0.1
              ),
            }}
          >
            {trend.isPositive ? (
              <TrendingUp size={12} style={{ color: colors.success }} aria-hidden="true" />
            ) : (
              <TrendingDown size={12} style={{ color: colors.error }} aria-hidden="true" />
            )}
            <span
              style={{
                fontSize: typography.fontSize.xs,
                fontWeight: typography.fontWeight.bold,
                color: trend.isPositive ? colors.success : colors.error,
              }}
            >
              {trend.value}%
            </span>
          </div>
        )}
      </div>

      <h3
        style={{
          color: colors.gray[500],
          fontSize: typography.fontSize.xs,
          fontWeight: typography.fontWeight.semibold,
          marginBottom: spacing[1],
          textTransform: 'uppercase',
          letterSpacing: typography.letterSpacing.wide,
        }}
      >
        {title}
      </h3>

      <p
        style={{
          fontSize: typography.fontSize['3xl'],
          fontWeight: typography.fontWeight.extrabold,
          color: colors.gray[900],
          letterSpacing: typography.letterSpacing.tight,
          lineHeight: typography.lineHeight.tight,
        }}
      >
        {value}
      </p>
    </article>
  );
}
