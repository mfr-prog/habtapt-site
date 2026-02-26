'use client';

import React from 'react';
import { motion } from 'motion/react';
import { useInView } from './useInView';
import { Container } from './Container';
import { designSystem } from './design-system';
import { Shield, TrendingUp, Eye } from './icons';

const stats = [
  { value: '10+', label: 'Projetos concluidos', icon: Shield },
  { value: '30%', label: 'ROI medio por projeto', icon: TrendingUp },
  { value: '100%', label: 'Transparencia financeira', icon: Eye },
];

export function CredibilityBar() {
  const { ref, isInView } = useInView({ threshold: 0.1 });

  return (
    <section
      ref={ref}
      style={{
        background: designSystem.colors.gradients.heroLuxury,
        paddingTop: designSystem.spacing[12],
        paddingBottom: designSystem.spacing[12],
      }}
    >
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-3"
          style={{
            gap: designSystem.spacing[6],
            maxWidth: '56rem',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
                style={{
                  padding: designSystem.spacing[6],
                }}
              >
                <div
                  className="inline-flex items-center justify-center"
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: designSystem.borderRadius.full,
                    background: 'rgba(255, 255, 255, 0.15)',
                    marginBottom: designSystem.spacing[4],
                  }}
                >
                  <Icon size={24} style={{ color: designSystem.colors.neutral.white }} />
                </div>
                <div
                  style={{
                    fontSize: 'clamp(2rem, 5vw, 3rem)',
                    fontWeight: designSystem.typography.fontWeight.black,
                    color: designSystem.colors.neutral.white,
                    lineHeight: 1,
                    marginBottom: designSystem.spacing[2],
                  }}
                >
                  {stat.value}
                </div>
                <div
                  style={{
                    fontSize: designSystem.typography.fontSize.base,
                    color: 'rgba(255, 255, 255, 0.85)',
                    fontWeight: designSystem.typography.fontWeight.medium,
                  }}
                >
                  {stat.label}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </Container>
    </section>
  );
}
