'use client';

import React from 'react';
import { motion } from 'motion/react';
import { useInView } from './useInView';
import { Container } from './Container';
import { designSystem } from './design-system';
import { Star, Shield, TrendingUp } from './icons';

const stats = [
  { value: '10+', label: 'Projetos concluídos', icon: Shield },
  { value: '30%', label: 'ROI médio anualizado', icon: TrendingUp },
  { value: '100%', label: 'Transparência financeira', icon: Star },
];

const testimonials = [
  {
    text: 'A HABTA transformou o nosso investimento numa experiência segura e rentável. Acompanhamento impecável do início ao fim.',
    author: 'Ricardo M.',
    role: 'Investidor',
  },
  {
    text: 'Profissionalismo e transparência. Recebi relatórios semanais e o ROI superou as expectativas.',
    author: 'Ana S.',
    role: 'Investidora',
  },
];

export function CredibilityBar() {
  const { ref, isInView } = useInView({ threshold: 0.1 });

  return (
    <section
      ref={ref}
      style={{
        background: designSystem.colors.gradients.heroLuxury,
        paddingTop: designSystem.spacing[16],
        paddingBottom: designSystem.spacing[16],
      }}
    >
      <Container>
        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-3"
          style={{
            gap: designSystem.spacing[6],
            marginBottom: designSystem.spacing[12],
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

        {/* Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2"
          style={{
            gap: designSystem.spacing[6],
            maxWidth: '56rem',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          {testimonials.map((t, index) => (
            <motion.div
              key={t.author}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              style={{
                padding: designSystem.spacing[6],
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(8px)',
                borderRadius: designSystem.borderRadius['2xl'],
                border: '1px solid rgba(255, 255, 255, 0.15)',
              }}
            >
              <p
                style={{
                  fontSize: designSystem.typography.fontSize.base,
                  color: 'rgba(255, 255, 255, 0.9)',
                  lineHeight: designSystem.typography.lineHeight.relaxed,
                  marginBottom: designSystem.spacing[4],
                  fontStyle: 'italic',
                }}
              >
                &ldquo;{t.text}&rdquo;
              </p>
              <div>
                <div
                  style={{
                    fontSize: designSystem.typography.fontSize.sm,
                    fontWeight: designSystem.typography.fontWeight.bold,
                    color: designSystem.colors.neutral.white,
                  }}
                >
                  {t.author}
                </div>
                <div
                  style={{
                    fontSize: designSystem.typography.fontSize.xs,
                    color: 'rgba(255, 255, 255, 0.7)',
                  }}
                >
                  {t.role}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
