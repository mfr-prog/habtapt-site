/**
 * Insight Card - Componente otimizado e memoizado
 * Seguindo Guardião Universal de Front-End
 */

import React, { memo } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Clock } from '../icons';
import { designSystem } from '../design-system';

interface InsightCardProps {
  insight: {
    id: string;
    icon: React.ElementType;
    title: string;
    description: string;
    category: string;
    readTime: string;
    gradient?: string;
    iconColor?: string;
  };
  index: number;
  isMobile: boolean;
  onClick: (id: string) => void;
}

function InsightCardComponent({ insight, index, isMobile, onClick }: InsightCardProps) {
  const IconComponent = insight.icon;
  const cardGradient = insight.gradient || designSystem.colors.gradients.primary;
  const iconColor = insight.iconColor || designSystem.colors.brand.primary;

  const CardWrapper = isMobile ? 'div' : motion.div;
  const cardProps = isMobile
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4, delay: Math.min(index * 0.05, 0.3) },
        whileHover: { y: -8 },
      };

  return (
    <CardWrapper
      {...cardProps}
      className="group bg-white overflow-hidden transition-all duration-500 cursor-pointer"
      onClick={() => onClick(insight.id)}
      style={{
        borderRadius: designSystem.borderRadius['2xl'],
        border: `1px solid ${designSystem.colors.neutral[200]}`,
        padding: designSystem.spacing[6],
        boxShadow: designSystem.shadows.sm,
      }}
    >
      {/* Icon */}
      <div
        className="inline-flex items-center justify-center transition-all duration-300"
        style={{
          width: '56px',
          height: '56px',
          borderRadius: designSystem.borderRadius.xl,
          background: cardGradient,
          marginBottom: designSystem.spacing[4],
          boxShadow: `0 4px 12px ${designSystem.helpers.hexToRgba(iconColor, 0.2)}`,
        }}
      >
        <IconComponent size={28} style={{ color: designSystem.colors.neutral.white }} />
      </div>

      {/* Category + Read Time */}
      <div
        className="flex items-center"
        style={{
          gap: designSystem.spacing[3],
          marginBottom: designSystem.spacing[3],
        }}
      >
        <span
          className="inline-flex items-center rounded-full"
          style={{
            paddingLeft: designSystem.spacing[3],
            paddingRight: designSystem.spacing[3],
            paddingTop: designSystem.spacing[1],
            paddingBottom: designSystem.spacing[1],
            background: designSystem.helpers.hexToRgba(iconColor, 0.1),
            color: iconColor,
            fontSize: designSystem.typography.fontSize.xs,
            fontWeight: designSystem.typography.fontWeight.semibold,
            textTransform: 'uppercase',
            letterSpacing: designSystem.typography.letterSpacing.wide,
          }}
        >
          {insight.category}
        </span>
        <div
          className="flex items-center"
          style={{
            gap: designSystem.spacing[1],
            color: designSystem.colors.neutral[500],
            fontSize: designSystem.typography.fontSize.sm,
          }}
        >
          <Clock size={14} />
          <span>{insight.readTime}</span>
        </div>
      </div>

      {/* Title - Com line clamp para evitar truncamento */}
      <h3
        className="transition-colors duration-300"
        style={{
          color: designSystem.colors.neutral[900],
          marginBottom: designSystem.spacing[3],
          minHeight: '3.5rem',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          lineHeight: designSystem.typography.lineHeight.tight,
          wordBreak: 'break-word',
          hyphens: 'auto',
        }}
        title={insight.title}
      >
        {insight.title}
      </h3>

      {/* Description - Com line clamp para texto consistente e truncamento inteligente */}
      <p
        style={{
          color: designSystem.colors.neutral[600],
          fontSize: designSystem.typography.fontSize.sm,
          lineHeight: designSystem.typography.lineHeight.relaxed,
          marginBottom: designSystem.spacing[5],
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          overflowWrap: 'break-word',
          wordBreak: 'normal',
          hyphens: 'auto',
          textOverflow: 'ellipsis',
        }}
        title={insight.description}
      >
        {/* Garantir que o texto termina de forma mais natural */}
        {insight.description.length > 120 
          ? `${insight.description.substring(0, 117).trim()}...` 
          : insight.description}
      </p>

      {/* CTA */}
      <motion.div
        whileHover={isMobile ? {} : { x: 4 }}
        className="inline-flex items-center transition-all duration-300"
        style={{
          gap: designSystem.spacing[2],
          color: iconColor,
          fontSize: designSystem.typography.fontSize.sm,
          fontWeight: designSystem.typography.fontWeight.semibold,
        }}
      >
        <span>Ler artigo</span>
        <ArrowRight size={16} />
      </motion.div>
    </CardWrapper>
  );
}

export const InsightCard = memo(InsightCardComponent, (prev, next) => {
  return (
    prev.insight.id === next.insight.id &&
    prev.index === next.index &&
    prev.isMobile === next.isMobile
  );
});

InsightCard.displayName = 'InsightCard';
