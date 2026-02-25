// Primitive: Authentication Card Wrapper
import React, { ReactNode } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { colors, shadows, radius, spacing, gradients } from '../../utils/styles';
import { animations } from '../../utils/animations';
import { useRouter } from 'next/navigation';

interface AuthCardProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  backRoute?: string;
  maxWidth?: string;
}

export function AuthCard({
  children,
  title,
  subtitle,
  showBackButton = true,
  backRoute = 'home',
  maxWidth = '480px',
}: AuthCardProps) {
  const router = useRouter();

  return (
    <div
      style={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${colors.primary}08 0%, ${colors.gray[50]} 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing[6],
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative Background Orbs */}
      <motion.div
        variants={animations.orb}
        animate="animate"
        style={{
          position: 'absolute',
          top: '-10%',
          right: '-5%',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${colors.primary}10, transparent)`,
          pointerEvents: 'none',
        }}
      />

      <motion.div
        variants={animations.orb}
        animate="animate"
        transition={{ delay: 1 }}
        style={{
          position: 'absolute',
          bottom: '-10%',
          left: '-5%',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${colors.secondary}10, transparent)`,
          pointerEvents: 'none',
        }}
      />

      {/* Back Button */}
      {showBackButton && (
        <motion.button
          onClick={() => router.push(backRoute === 'home' ? '/' : `/${backRoute}`)}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ x: -5 }}
          style={{
            position: 'absolute',
            top: spacing[6],
            left: spacing[6],
            display: 'flex',
            alignItems: 'center',
            gap: spacing[2],
            padding: `${spacing[3]} ${spacing[5]}`,
            background: colors.white,
            border: `2px solid ${colors.gray[200]}`,
            borderRadius: radius.lg,
            color: colors.gray[700],
            fontWeight: 600,
            fontSize: '0.9375rem',
            cursor: 'pointer',
            transition: 'all 0.2s',
            boxShadow: shadows.sm,
            zIndex: 10,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = colors.gray[50];
            e.currentTarget.style.boxShadow = shadows.base;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = colors.white;
            e.currentTarget.style.boxShadow = shadows.sm;
          }}
        >
          <ArrowLeft size={18} />
          <span className="hidden sm:inline">
            Voltar
          </span>
        </motion.button>
      )}

      {/* Card */}
      <motion.div
        variants={animations.card}
        initial="initial"
        animate="animate"
        style={{
          background: colors.white,
          borderRadius: radius['3xl'],
          boxShadow: shadows['2xl'],
          padding: spacing[12],
          maxWidth,
          width: '100%',
          position: 'relative',
          zIndex: 1,
          border: `1px solid ${colors.gray[200]}`,
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: spacing[10] }}>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              color: colors.gray[900],
              fontWeight: 800,
              fontSize: '2rem',
              marginBottom: spacing[2],
              letterSpacing: '-0.02em',
            }}
          >
            {title}
          </motion.h1>

          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{
                color: colors.gray[500],
                fontSize: '0.9375rem',
                lineHeight: 1.6,
              }}
            >
              {subtitle}
            </motion.p>
          )}
        </div>

        {/* Content */}
        <motion.div
          variants={animations.staggerContainer}
          initial="initial"
          animate="animate"
        >
          {children}
        </motion.div>
      </motion.div>
    </div>
  );
}
