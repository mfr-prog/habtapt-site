/**
 * Portfolio Card - Componente otimizado e memoizado
 * Seguindo Guardião Universal de Front-End
 */

import React, { memo } from 'react';
import { motion } from 'motion/react';
import { MapPin, BedDouble, Bath, Maximize, ArrowRight, TrendingUp } from '../icons';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { designSystem } from '../design-system';

type ProjectStatus = 'in-progress' | 'available' | 'sold';
type InvestmentStrategy = 'buy-hold' | 'fix-flip' | 'alojamento-local' | 'rent-to-rent' | 'desenvolvimento' | 'co-investimento';

interface Project {
  id: string;
  title: string;
  location: string;
  status: ProjectStatus;
  statusLabel: string;
  strategy: InvestmentStrategy;
  image: string;
  roi: string;
  area: string;
  bedrooms: number;
  bathrooms: number;
  price: string;
}

interface PortfolioCardProps {
  project: Project;
  index: number;
  isMobile: boolean;
  onClick: (id: string) => void;
}

const getStatusColor = (status: ProjectStatus) => {
  const colors: Record<ProjectStatus, { bg: string; text: string; border: string }> = {
    available: {
      bg: designSystem.helpers.hexToRgba(designSystem.colors.brand.secondary, 0.15),
      text: designSystem.colors.brand.secondary,
      border: designSystem.colors.brand.secondary,
    },
    'in-progress': {
      bg: designSystem.helpers.hexToRgba(designSystem.colors.brand.accent, 0.15),
      text: designSystem.colors.brand.accent,
      border: designSystem.colors.brand.accent,
    },
    sold: {
      bg: designSystem.helpers.hexToRgba(designSystem.colors.semantic.success, 0.15),
      text: designSystem.colors.semantic.success,
      border: designSystem.colors.semantic.success,
    },
  };
  return colors[status] || colors['in-progress'];
};

const getStrategyConfig = (strategy: InvestmentStrategy) => {
  const configs = {
    'buy-hold': {
      label: 'Buy & Hold',
      color: designSystem.colors.neutral.white,
      bg: designSystem.colors.brand.primary,
      border: designSystem.colors.brand.primary,
    },
    'fix-flip': {
      label: 'Fix & Flip',
      color: designSystem.colors.neutral.white,
      bg: designSystem.colors.brand.tertiary,
      border: designSystem.colors.brand.tertiary,
    },
    'alojamento-local': {
      label: 'Alojamento Local',
      color: designSystem.colors.neutral.white,
      bg: designSystem.colors.brand.accent,
      border: designSystem.colors.brand.accent,
    },
    'rent-to-rent': {
      label: 'Rent-to-Rent',
      color: designSystem.colors.neutral.white,
      bg: designSystem.colors.strategy.rentToRent,
      border: designSystem.colors.strategy.rentToRent,
    },
    'desenvolvimento': {
      label: 'Desenvolvimento',
      color: designSystem.colors.neutral.white,
      bg: designSystem.colors.strategy.development,
      border: designSystem.colors.strategy.development,
    },
    'co-investimento': {
      label: 'Co-Investimento',
      color: designSystem.colors.neutral.white,
      bg: designSystem.colors.strategy.coInvestment,
      border: designSystem.colors.strategy.coInvestment,
    },
  };
  return configs[strategy] || configs['fix-flip'];
};

function PortfolioCardComponent({ project, index, isMobile, onClick }: PortfolioCardProps) {
  const statusColors = getStatusColor(project.status);
  const strategyConfig = getStrategyConfig(project.strategy);

  const CardWrapper = isMobile ? 'div' : motion.div;
  const cardProps = isMobile
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4, delay: Math.min(index * 0.05, 0.3) }, // Limite de delay
        whileHover: { y: -6 },
      };

  return (
    <CardWrapper
      {...cardProps}
      className="group bg-white overflow-hidden transition-all duration-500 cursor-pointer"
      role="article"
      aria-labelledby={`project-title-${project.id}`}
      onClick={() => onClick(project.id)}
      style={{
        borderRadius: designSystem.borderRadius['3xl'],
        border: `1px solid ${designSystem.helpers.hexToRgba(designSystem.colors.brand.primary, 0.1)}`,
        boxShadow: designSystem.shadows.md,
      }}
    >
      {/* Image */}
      <div className="relative overflow-hidden" style={{ height: designSystem.spacing[64] }}>
        <ImageWithFallback
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
          }}
        />

        {/* Status Badge */}
        <div
          className="absolute backdrop-blur-md rounded-full"
          style={{
            top: designSystem.spacing[4],
            left: designSystem.spacing[4],
            paddingLeft: designSystem.spacing[5],
            paddingRight: designSystem.spacing[5],
            paddingTop: designSystem.spacing[3],
            paddingBottom: designSystem.spacing[3],
            background: designSystem.helpers.hexToRgba(statusColors.border, 0.95),
            border: `2px solid ${statusColors.border}`,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          <span
            style={{
              fontSize: '0.8125rem',
              fontWeight: designSystem.typography.fontWeight.extrabold,
              color: designSystem.colors.neutral.white,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              textShadow: '0 1px 2px rgba(0,0,0,0.2)',
            }}
          >
            {project.statusLabel}
          </span>
        </div>

        {/* ROI Badge */}
        <div
          className="absolute rounded-full backdrop-blur-md flex items-center"
          style={{
            top: designSystem.spacing[4],
            right: designSystem.spacing[4],
            paddingLeft: designSystem.spacing[3],
            paddingRight: designSystem.spacing[3],
            paddingTop: designSystem.spacing[2],
            paddingBottom: designSystem.spacing[2],
            gap: designSystem.spacing[1.5],
            background: designSystem.colors.brand.secondary,
            border: `2px solid ${designSystem.helpers.hexToRgba(designSystem.colors.neutral.white, 0.3)}`,
          }}
        >
          <TrendingUp size={16} className="text-white" />
          <span
            style={{
              fontSize: '0.9375rem',
              fontWeight: designSystem.typography.fontWeight.bold,
              color: designSystem.colors.neutral.white,
            }}
          >
            {project.roi}
          </span>
        </div>

        {/* Gradient Overlay */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: designSystem.colors.gradients.overlay,
          }}
        />
      </div>

      {/* Content */}
      <div style={{ padding: designSystem.spacing[6] }}>
        <div className="flex items-start justify-between" style={{ marginBottom: designSystem.spacing[3] }}>
          <h3
            id={`project-title-${project.id}`}
            className="flex-1"
            style={{
              color: designSystem.colors.neutral[900],
            }}
          >
            {project.title}
          </h3>
        </div>

        <div className="flex items-center" style={{ gap: designSystem.spacing[2], marginBottom: designSystem.spacing[4] }}>
          <MapPin size={16} style={{ color: designSystem.colors.neutral[500] }} />
          <span
            style={{
              fontSize: designSystem.typography.fontSize.sm,
              color: designSystem.colors.neutral[600],
            }}
          >
            {project.location}
          </span>
        </div>

        {/* Strategy Badge */}
        <div style={{ marginBottom: designSystem.spacing[4] }}>
          <div
            className="inline-flex items-center rounded-full"
            style={{
              paddingLeft: designSystem.spacing[4],
              paddingRight: designSystem.spacing[4],
              paddingTop: designSystem.spacing[2],
              paddingBottom: designSystem.spacing[2],
              background: strategyConfig.bg,
              border: `2px solid ${strategyConfig.border}`,
            }}
          >
            <span
              style={{
                fontSize: designSystem.typography.fontSize.sm,
                fontWeight: designSystem.typography.fontWeight.extrabold,
                color: strategyConfig.color,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                textShadow: '0 1px 2px rgba(0,0,0,0.2)',
              }}
            >
              {strategyConfig.label}
            </span>
          </div>
        </div>

        {/* Features Grid */}
        <div
          className="grid grid-cols-3"
          style={{
            gap: designSystem.spacing[3],
            paddingBottom: designSystem.spacing[5],
            marginBottom: designSystem.spacing[5],
            borderBottom: `1px solid ${designSystem.helpers.hexToRgba(designSystem.colors.brand.primary, 0.1)}`,
          }}
        >
          <div className="flex items-center" style={{ gap: designSystem.spacing[2] }}>
            <Maximize size={16} style={{ color: designSystem.colors.neutral[500] }} />
            <span style={{ fontSize: designSystem.typography.fontSize.sm, color: designSystem.colors.neutral[600] }}>
              {project.area}
            </span>
          </div>
          <div className="flex items-center" style={{ gap: designSystem.spacing[2] }}>
            <BedDouble size={16} style={{ color: designSystem.colors.neutral[500] }} />
            <span style={{ fontSize: designSystem.typography.fontSize.sm, color: designSystem.colors.neutral[600] }}>
              {project.bedrooms}
            </span>
          </div>
          <div className="flex items-center" style={{ gap: designSystem.spacing[2] }}>
            <Bath size={16} style={{ color: designSystem.colors.neutral[500] }} />
            <span style={{ fontSize: designSystem.typography.fontSize.sm, color: designSystem.colors.neutral[600] }}>
              {project.bathrooms}
            </span>
          </div>
        </div>

        {/* Price and CTA */}
        <div className="flex items-center justify-between">
          <div>
            <span style={{ fontSize: designSystem.typography.fontSize.xs, color: designSystem.colors.neutral[500] }}>
              Valor
            </span>
            <div
              style={{
                fontSize: designSystem.typography.fontSize.xl,
                fontWeight: designSystem.typography.fontWeight.extrabold,
                color: designSystem.colors.brand.secondary,
              }}
            >
              {project.price}
            </div>
          </div>

          <motion.button
            whileHover={isMobile ? {} : { scale: 1.1, rotate: -5 }}
            whileTap={{ scale: 0.9 }}
            className="rounded-full transition-all duration-300"
            aria-label={`Ver detalhes de ${project.title}`}
            style={{
              width: '48px',
              height: '48px',
              background: designSystem.colors.gradients.secondary,
              color: designSystem.colors.neutral.white,
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: designSystem.shadows.secondaryHover,
              cursor: 'pointer',
            }}
          >
            <ArrowRight size={20} />
          </motion.button>
        </div>
      </div>
    </CardWrapper>
  );
}

// Memoizar para evitar re-renders desnecessários
export const PortfolioCard = memo(PortfolioCardComponent, (prevProps, nextProps) => {
  // Re-renderizar apenas se o projeto ou index mudarem
  return (
    prevProps.project.id === nextProps.project.id &&
    prevProps.index === nextProps.index &&
    prevProps.isMobile === nextProps.isMobile
  );
});

PortfolioCard.displayName = 'PortfolioCard';
