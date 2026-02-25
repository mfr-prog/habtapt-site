/**
 * External Links Card Primitivo - Componente para links externos
 * Seguindo Guardião Universal de Front-End
 */

import React from 'react';
import { motion } from 'motion/react';
import { ExternalLink, Download } from 'lucide-react';
import { designSystem } from '../design-system';

interface ExternalLinksCardProps {
  portalLink?: string | null;
  brochureLink?: string | null;
  landingPage?: string | null;
  animated?: boolean;
  delay?: number;
  isMobile?: boolean;
}

export function ExternalLinksCard({
  portalLink,
  brochureLink,
  landingPage,
  animated = true,
  delay = 0.3,
  isMobile = false,
}: ExternalLinksCardProps) {
  if (!portalLink && !brochureLink && !landingPage) return null;

  const Wrapper = animated ? motion.div : 'div';
  const wrapperProps = animated
    ? {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.6, delay },
      }
    : {};

  return (
    <Wrapper
      {...wrapperProps}
      style={{
        marginTop: designSystem.spacing[10],
      }}
    >
      {/* Card Simples e Clean - Mesmo estilo do Financial Card */}
      <div
        style={{
          background: designSystem.colors.neutral.white,
          borderRadius: designSystem.borderRadius.xl,
          padding: isMobile ? designSystem.spacing[6] : designSystem.spacing[8],
          boxShadow: designSystem.shadows.md,
        }}
      >
        {/* Header Simples */}
        <div
          style={{
            textAlign: 'center',
            marginBottom: designSystem.spacing[6],
          }}
        >
          <h3
            style={{
              fontSize: isMobile ? designSystem.typography.fontSize.xl : designSystem.typography.fontSize['2xl'],
              fontWeight: designSystem.typography.fontWeight.bold,
              color: designSystem.colors.neutral[900],
              marginBottom: designSystem.spacing[2],
            }}
          >
            Mais Informações
          </h3>
          <p
            style={{
              color: designSystem.colors.neutral[600],
              fontSize: designSystem.typography.fontSize.sm,
            }}
          >
            Explore detalhes completos sobre este imóvel
          </p>
        </div>

        {/* Botões de ação */}
        <div
          style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: designSystem.spacing[4],
            maxWidth: '600px',
            margin: '0 auto',
          }}
        >
          {landingPage && (
            <motion.button
              onClick={() => window.open(landingPage, '_self')}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center justify-center rounded-full transition-all"
              style={{
                flex: 1,
                gap: designSystem.spacing[2],
                paddingLeft: designSystem.spacing[8],
                paddingRight: designSystem.spacing[8],
                paddingTop: designSystem.spacing[4],
                paddingBottom: designSystem.spacing[4],
                background: designSystem.colors.brand.primary,
                color: designSystem.colors.neutral.white,
                fontWeight: designSystem.typography.fontWeight.semibold,
                fontSize: designSystem.typography.fontSize.base,
                border: 'none',
                cursor: 'pointer',
                boxShadow: `0 4px 12px ${designSystem.helpers.hexToRgba(designSystem.colors.brand.primary, 0.3)}`,
              }}
            >
              <ExternalLink size={18} />
              <span>Ver Landing Page</span>
            </motion.button>
          )}

          {portalLink && (
            <motion.button
              onClick={() => window.open(portalLink, '_blank', 'noopener,noreferrer')}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center justify-center rounded-full transition-all"
              style={{
                flex: 1,
                gap: designSystem.spacing[2],
                paddingLeft: designSystem.spacing[8],
                paddingRight: designSystem.spacing[8],
                paddingTop: designSystem.spacing[4],
                paddingBottom: designSystem.spacing[4],
                background: designSystem.colors.brand.secondary,
                color: designSystem.colors.neutral.white,
                fontWeight: designSystem.typography.fontWeight.semibold,
                fontSize: designSystem.typography.fontSize.base,
                border: 'none',
                cursor: 'pointer',
                boxShadow: `0 4px 12px ${designSystem.helpers.hexToRgba(designSystem.colors.brand.secondary, 0.3)}`,
              }}
            >
              <ExternalLink size={18} />
              <span>Ver no Idealista</span>
            </motion.button>
          )}

          {brochureLink && (
            <motion.button
              onClick={() => window.open(brochureLink, '_blank', 'noopener,noreferrer')}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center justify-center rounded-full transition-all"
              style={{
                flex: 1,
                gap: designSystem.spacing[2],
                paddingLeft: designSystem.spacing[8],
                paddingRight: designSystem.spacing[8],
                paddingTop: designSystem.spacing[4],
                paddingBottom: designSystem.spacing[4],
                background: 'transparent',
                borderWidth: '2px',
                borderColor: designSystem.colors.brand.secondary,
                color: designSystem.colors.brand.secondary,
                fontWeight: designSystem.typography.fontWeight.semibold,
                fontSize: designSystem.typography.fontSize.base,
                cursor: 'pointer',
              }}
            >
              <Download size={18} />
              <span>Download Brochura</span>
            </motion.button>
          )}
        </div>
      </div>
    </Wrapper>
  );
}
