/**
 * Portfolio Card - Componente otimizado e memoizado
 * Suporta dual-mode: 'investir' (default) e 'morar'
 * Uses overlay <Link> pattern for SEO + keyboard accessibility
 */

import React, { memo } from 'react';
import Link from 'next/link';
import { MapPin, BedDouble, Bath, Maximize, ArrowRight, TrendingUp, ExternalLink, Calendar } from '../icons';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { designSystem } from '../design-system';
import { unsplashSrcSet, unsplashUrl, isUnsplashUrl } from '@/utils/unsplashUrl';
import type { ViewMode } from '@/utils/hooks/useViewMode';

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
  landingPage?: string | null;
  portalLink?: string | null;
  estimatedRent?: string;
  grossYield?: string;
  netYield?: string;
  appreciationEstimate?: string;
  propertyType?: 'moradia' | 'investimento' | 'ambos';
  neighborhood?: string;
  finishes?: string[];
  nearbyAmenities?: string[];
  lifestyle?: string;
  typology?: string;
  deliveryDate?: string;
}

interface PortfolioCardProps {
  project: Project;
  index: number;
  isMobile: boolean;
  onClick?: (id: string) => void;
  viewMode?: ViewMode;
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

function PortfolioCardComponent({ project, index, isMobile, viewMode = 'investir' }: PortfolioCardProps) {
  const statusColors = getStatusColor(project.status);
  const strategyConfig = getStrategyConfig(project.strategy);
  const isMorar = viewMode === 'morar';

  return (
    <div
      className="group relative bg-white overflow-hidden transition-[transform,box-shadow] duration-500 hover:-translate-y-1.5"
      role="article"
      aria-labelledby={`project-title-${project.id}`}
      style={{
        borderRadius: designSystem.borderRadius['3xl'],
        border: `1px solid ${designSystem.helpers.hexToRgba(designSystem.colors.brand.primary, 0.1)}`,
        boxShadow: designSystem.shadows.md,
      }}
    >
      {/* Overlay link — covers entire card, crawlable by search engines, keyboard-accessible */}
      <Link
        href={`/portfolio/${project.id}`}
        className="absolute inset-0 z-[1]"
        aria-label={`Ver detalhes de ${project.title}`}
        tabIndex={0}
      >
        <span className="sr-only">Ver detalhes de {project.title}</span>
      </Link>

      {/* Image */}
      <div
        className="relative overflow-hidden"
        style={{ height: isMorar ? designSystem.spacing[40] : designSystem.spacing[64] }}
      >
        <ImageWithFallback
          src={isUnsplashUrl(project.image) ? unsplashUrl(project.image, 480) : project.image}
          srcSet={unsplashSrcSet(project.image, [320, 480, 640])}
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          loading="lazy"
          style={{ width: '100%', height: '100%' }}
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
        {!isMorar && project.status === 'sold' && (
          <div
            className="absolute rounded-full backdrop-blur-md flex items-center"
            style={{
              top: designSystem.spacing[4],
              right: designSystem.spacing[4],
              paddingLeft: designSystem.spacing[4],
              paddingRight: designSystem.spacing[4],
              paddingTop: designSystem.spacing[2],
              paddingBottom: designSystem.spacing[2],
              gap: designSystem.spacing[1.5],
              background: designSystem.colors.brand.secondary,
              border: `2px solid ${designSystem.helpers.hexToRgba(designSystem.colors.neutral.white, 0.3)}`,
            }}
          >
            <TrendingUp size={18} className="text-white" />
            <span style={{ fontSize: '1rem', fontWeight: designSystem.typography.fontWeight.bold, color: designSystem.colors.neutral.white }}>
              {project.roi}
            </span>
          </div>
        )}

        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: designSystem.colors.gradients.overlay }}
        />
      </div>

      {/* Content */}
      <div style={{ padding: designSystem.spacing[6] }}>
        <div className="flex items-start justify-between" style={{ marginBottom: designSystem.spacing[3] }}>
          <h3 id={`project-title-${project.id}`} className="flex-1" style={{ color: designSystem.colors.neutral[900] }}>
            {project.title}
          </h3>
        </div>

        <div className="flex items-center" style={{ gap: designSystem.spacing[2], marginBottom: designSystem.spacing[3] }}>
          <MapPin size={16} style={{ color: designSystem.colors.neutral[500] }} />
          <span style={{ fontSize: designSystem.typography.fontSize.sm, color: designSystem.colors.neutral[600] }}>
            {project.location}
          </span>
        </div>

        {isMorar ? (
          <>
            {project.typology && (
              <div style={{ marginBottom: designSystem.spacing[3] }}>
                <div
                  className="inline-flex items-center rounded-full"
                  style={{
                    paddingLeft: designSystem.spacing[4],
                    paddingRight: designSystem.spacing[4],
                    paddingTop: designSystem.spacing[2],
                    paddingBottom: designSystem.spacing[2],
                    background: designSystem.helpers.hexToRgba(designSystem.colors.brand.primary, 0.08),
                    border: `1px solid ${designSystem.helpers.hexToRgba(designSystem.colors.brand.primary, 0.15)}`,
                  }}
                >
                  <span style={{ fontSize: designSystem.typography.fontSize.sm, fontWeight: designSystem.typography.fontWeight.semibold, color: designSystem.colors.brand.primary }}>
                    {project.typology}
                  </span>
                </div>
              </div>
            )}
            {project.neighborhood && (
              <p style={{ fontSize: designSystem.typography.fontSize.sm, color: designSystem.colors.neutral[600], lineHeight: designSystem.typography.lineHeight.relaxed, marginBottom: designSystem.spacing[3], display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {project.neighborhood}
              </p>
            )}
            {project.finishes && project.finishes.length > 0 && (
              <div className="flex flex-wrap" style={{ gap: designSystem.spacing[2], marginBottom: designSystem.spacing[4] }}>
                {project.finishes.slice(0, 3).map((finish) => (
                  <span key={finish} style={{ fontSize: designSystem.typography.fontSize.xs, color: designSystem.colors.brand.tertiary, background: designSystem.helpers.hexToRgba(designSystem.colors.brand.tertiary, 0.08), border: `1px solid ${designSystem.helpers.hexToRgba(designSystem.colors.brand.tertiary, 0.15)}`, borderRadius: designSystem.borderRadius.full, paddingLeft: designSystem.spacing[3], paddingRight: designSystem.spacing[3], paddingTop: designSystem.spacing[1], paddingBottom: designSystem.spacing[1], fontWeight: designSystem.typography.fontWeight.medium }}>
                    {finish}
                  </span>
                ))}
              </div>
            )}
            {project.deliveryDate && (
              <div className="flex items-center" style={{ gap: designSystem.spacing[2], marginBottom: designSystem.spacing[4], paddingBottom: designSystem.spacing[4], borderBottom: `1px solid ${designSystem.helpers.hexToRgba(designSystem.colors.brand.primary, 0.1)}` }}>
                <Calendar size={14} style={{ color: designSystem.colors.brand.secondary }} />
                <span style={{ fontSize: designSystem.typography.fontSize.sm, color: designSystem.colors.brand.secondary, fontWeight: designSystem.typography.fontWeight.semibold }}>
                  Entrega: {project.deliveryDate}
                </span>
              </div>
            )}
            {!project.deliveryDate && (
              <div className="grid grid-cols-3" style={{ gap: designSystem.spacing[3], paddingBottom: designSystem.spacing[4], marginBottom: designSystem.spacing[4], borderBottom: `1px solid ${designSystem.helpers.hexToRgba(designSystem.colors.brand.primary, 0.1)}` }}>
                <div className="flex items-center" style={{ gap: designSystem.spacing[2] }}>
                  <Maximize size={16} style={{ color: designSystem.colors.neutral[500] }} />
                  <span style={{ fontSize: designSystem.typography.fontSize.sm, color: designSystem.colors.neutral[600] }}>{project.area}</span>
                </div>
                <div className="flex items-center" style={{ gap: designSystem.spacing[2] }}>
                  <BedDouble size={16} style={{ color: designSystem.colors.neutral[500] }} />
                  <span style={{ fontSize: designSystem.typography.fontSize.sm, color: designSystem.colors.neutral[600] }}>{project.bedrooms}</span>
                </div>
                <div className="flex items-center" style={{ gap: designSystem.spacing[2] }}>
                  <Bath size={16} style={{ color: designSystem.colors.neutral[500] }} />
                  <span style={{ fontSize: designSystem.typography.fontSize.sm, color: designSystem.colors.neutral[600] }}>{project.bathrooms}</span>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <div style={{ marginBottom: designSystem.spacing[4] }}>
              <div className="inline-flex items-center rounded-full" style={{ paddingLeft: designSystem.spacing[4], paddingRight: designSystem.spacing[4], paddingTop: designSystem.spacing[2], paddingBottom: designSystem.spacing[2], background: strategyConfig.bg, border: `2px solid ${strategyConfig.border}` }}>
                <span style={{ fontSize: designSystem.typography.fontSize.sm, fontWeight: designSystem.typography.fontWeight.extrabold, color: strategyConfig.color, textTransform: 'uppercase', letterSpacing: '0.05em', textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>
                  {strategyConfig.label}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-3" style={{ gap: designSystem.spacing[3], paddingBottom: designSystem.spacing[5], marginBottom: designSystem.spacing[5], borderBottom: `1px solid ${designSystem.helpers.hexToRgba(designSystem.colors.brand.primary, 0.1)}` }}>
              <div className="flex items-center" style={{ gap: designSystem.spacing[2] }}>
                <Maximize size={16} style={{ color: designSystem.colors.neutral[500] }} />
                <span style={{ fontSize: designSystem.typography.fontSize.sm, color: designSystem.colors.neutral[600] }}>{project.area}</span>
              </div>
              <div className="flex items-center" style={{ gap: designSystem.spacing[2] }}>
                <BedDouble size={16} style={{ color: designSystem.colors.neutral[500] }} />
                <span style={{ fontSize: designSystem.typography.fontSize.sm, color: designSystem.colors.neutral[600] }}>{project.bedrooms}</span>
              </div>
              <div className="flex items-center" style={{ gap: designSystem.spacing[2] }}>
                <Bath size={16} style={{ color: designSystem.colors.neutral[500] }} />
                <span style={{ fontSize: designSystem.typography.fontSize.sm, color: designSystem.colors.neutral[600] }}>{project.bathrooms}</span>
              </div>
            </div>
            {project.status === 'sold' && (project.estimatedRent || project.grossYield) && (
              <div className="flex items-center justify-between" style={{ marginBottom: designSystem.spacing[4], fontSize: designSystem.typography.fontSize.sm }}>
                {project.estimatedRent && (
                  <span style={{ color: designSystem.colors.neutral[600] }}>
                    Renda est.: <strong style={{ color: designSystem.colors.brand.secondary }}>{project.estimatedRent}</strong>
                  </span>
                )}
                {project.grossYield && (
                  <span style={{ color: designSystem.colors.neutral[600] }}>
                    Yield: <strong style={{ color: designSystem.colors.brand.secondary }}>{project.grossYield}</strong>
                  </span>
                )}
              </div>
            )}
          </>
        )}

        {/* Price and CTA arrow */}
        <div className="flex items-center justify-between">
          <div>
            <span style={{ fontSize: designSystem.typography.fontSize.xs, color: designSystem.colors.neutral[500] }}>Valor</span>
            <div style={{ fontSize: designSystem.typography.fontSize.xl, fontWeight: designSystem.typography.fontWeight.extrabold, color: designSystem.colors.brand.secondary }}>
              {project.price}
            </div>
          </div>
          <span
            className="rounded-full"
            aria-hidden="true"
            style={{
              width: '48px',
              height: '48px',
              minWidth: '48px',
              minHeight: '48px',
              background: designSystem.colors.gradients.secondary,
              color: designSystem.colors.neutral.white,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: designSystem.shadows.secondaryHover,
            }}
          >
            <ArrowRight size={20} />
          </span>
        </div>

        {/* External links — above card overlay link */}
        {(project.landingPage || project.portalLink) && (
          <div
            className="relative z-[2] flex items-center"
            style={{
              gap: designSystem.spacing[4],
              marginTop: designSystem.spacing[3],
              paddingTop: designSystem.spacing[3],
              borderTop: `1px solid ${designSystem.helpers.hexToRgba(designSystem.colors.brand.primary, 0.08)}`,
            }}
          >
            {project.landingPage && (
              <a
                href={project.landingPage}
                className="inline-flex items-center transition-opacity duration-200 hover:opacity-100"
                style={{
                  gap: designSystem.spacing[1.5],
                  fontSize: designSystem.typography.fontSize.xs,
                  fontWeight: designSystem.typography.fontWeight.medium,
                  color: designSystem.colors.brand.primary,
                  textDecoration: 'none',
                  opacity: 0.7,
                  minHeight: '44px',
                  alignItems: 'center',
                }}
              >
                <ExternalLink size={13} />
                Página Exclusiva
              </a>
            )}
            {project.portalLink && (
              <a
                href={project.portalLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center transition-opacity duration-200 hover:opacity-100"
                style={{
                  gap: designSystem.spacing[1.5],
                  fontSize: designSystem.typography.fontSize.xs,
                  fontWeight: designSystem.typography.fontWeight.medium,
                  color: designSystem.colors.brand.primary,
                  textDecoration: 'none',
                  opacity: 0.7,
                  minHeight: '44px',
                  alignItems: 'center',
                }}
              >
                <ExternalLink size={13} />
                Ver no Portal
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export const PortfolioCard = memo(PortfolioCardComponent, (prevProps, nextProps) => {
  return (
    prevProps.project.id === nextProps.project.id &&
    prevProps.index === nextProps.index &&
    prevProps.isMobile === nextProps.isMobile &&
    prevProps.viewMode === nextProps.viewMode
  );
});

PortfolioCard.displayName = 'PortfolioCard';
