'use client';

import React, { useState, useEffect } from 'react';
import { Container } from './Container';
import { Section } from './Section';
import { Search, Hammer, TrendingUp, Check, Target } from './icons';
import { motion } from 'motion/react';
import { useInView } from './useInView';
import { designSystem } from './design-system';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import Link from 'next/link';

export function Services() {
  const { ref, isInView } = useInView({ threshold: 0.1 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const lgBreakpoint = parseInt(designSystem.breakpoints.lg);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < lgBreakpoint);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const services = [
    {
      icon: Search,
      title: 'Compra Estratégica',
      description: 'Selecionamos imóveis com alto potencial de valorização através de análise de mercado detalhada, due diligence completa e negociação especializada.',
      features: [
        'Análise de mercado e comparáveis',
        'Due diligence técnica e jurídica',
        'Negociação e aquisição otimizada',
        'Projeção de ROI validada',
      ],
      gradient: designSystem.colors.gradients.primary,
      iconBg: designSystem.helpers.hexToRgba(designSystem.colors.brand.primary, 0.1),
      iconColor: designSystem.colors.brand.primary,
    },
    {
      icon: Hammer,
      title: 'Reforma Inteligente',
      description: 'Projetos de reabilitação com design contemporâneo, materiais de qualidade e gestão rigorosa de obra.',
      features: [
        'Design funcional e contemporâneo',
        'Materiais de qualidade e alta durabilidade',
        'Gestão rigorosa de obra e prazos',
        'Certificações de sustentabilidade',
      ],
      gradient: designSystem.colors.gradients.secondary,
      iconBg: designSystem.helpers.hexToRgba(designSystem.colors.brand.secondary, 0.1),
      iconColor: designSystem.colors.brand.secondary,
    },
    {
      icon: TrendingUp,
      title: 'Venda Otimizada',
      description: 'Maximizamos o retorno com estratégias de marketing, home staging e precificação baseada em dados.',
      features: [
        'Posicionamento de mercado estratégico',
        'Home staging e fotografia profissional',
        'Marketing multicanal baseado em dados',
        'Distribuição transparente de lucros',
      ],
      gradient: designSystem.colors.gradients.accent,
      iconBg: designSystem.helpers.hexToRgba(designSystem.colors.brand.accent, 0.1),
      iconColor: designSystem.colors.brand.accent,
    },
  ];

  return (
    <Section 
      id="services" 
      background="muted"
    >
      <Container>
        <section aria-labelledby="services-title">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mx-auto"
          style={{
            marginBottom: designSystem.spacing[20],
            maxWidth: '56rem'
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center rounded-full"
            style={{
              gap: designSystem.spacing[2],
              paddingLeft: designSystem.spacing[5],
              paddingRight: designSystem.spacing[5],
              paddingTop: designSystem.spacing[3],
              paddingBottom: designSystem.spacing[3],
              marginBottom: designSystem.spacing[6],
              background: designSystem.helpers.hexToRgba(designSystem.colors.brand.primary, 0.08),
              border: `1px solid ${designSystem.helpers.hexToRgba(designSystem.colors.brand.primary, 0.15)}`,
            }}
          >
            <Target 
              size={18} 
              style={{ color: designSystem.colors.brand.primary }} 
            />
            <span
              style={{
                fontSize: designSystem.typography.fontSize.sm,
                fontWeight: designSystem.typography.fontWeight.semibold,
                color: designSystem.colors.brand.primary,
                textTransform: 'uppercase',
                letterSpacing: designSystem.typography.letterSpacing.wider,
              }}
            >
              Os Nossos Serviços
            </span>
          </motion.div>

          <h2
            id="services-title"
            style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: designSystem.typography.fontWeight.black,
              color: designSystem.colors.brand.primary,
              marginBottom: designSystem.spacing[6],
              letterSpacing: designSystem.typography.letterSpacing.tight,
              lineHeight: designSystem.typography.lineHeight.tight,
            }}
          >
            Do Potencial ao Resultado
          </h2>

          <p
            className="max-w-2xl mx-auto"
            style={{
              fontSize: designSystem.typography.fontSize.lg,
              color: designSystem.colors.neutral[600],
              lineHeight: designSystem.typography.lineHeight.relaxed,
            }}
          >
            Um processo completo e otimizado para transformar cada imóvel em um produto de alto valor no mercado.
          </p>
        </motion.div>

        <div 
          className="grid grid-cols-1 lg:grid-cols-3"
          style={{ gap: designSystem.spacing[8] }}
        >
          {services.map((service, index) => {
            const CardWrapper = isMobile ? 'div' : motion.div;
            const cardProps = isMobile ? {} : {
              initial: { opacity: 0, y: 40 },
              animate: isInView ? { opacity: 1, y: 0 } : {},
              transition: { 
                duration: 0.6,
                delay: 0.2 + index * 0.15,
                type: 'spring',
                stiffness: 100
              },
              whileHover: { 
                y: -8,
                scale: 1.02,
                boxShadow: '0 20px 60px rgba(26, 62, 92, 0.15)'
              }
            };
            
            return (
            <CardWrapper
              key={service.title}
              {...cardProps}
              className="group relative bg-white transition-[transform,box-shadow] duration-500"
              role="article"
              aria-labelledby={`service-title-${index}`}
              style={{
                borderRadius: designSystem.borderRadius['3xl'],
                padding: designSystem.spacing[8],
                border: `1px solid ${designSystem.helpers.hexToRgba(designSystem.colors.brand.primary, 0.12)}`,
                boxShadow: designSystem.shadows.md,
              }}
            >
              {/* Gradient Border Effect on Hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  borderRadius: designSystem.borderRadius['3xl'],
                  background: service.gradient,
                  padding: designSystem.borderWidth[2],
                  zIndex: -1,
                  WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  WebkitMaskComposite: 'xor',
                  maskComposite: 'exclude',
                }}
              />

              {/* Icon */}
              {isMobile ? (
                <div
                  className="inline-flex"
                  style={{
                    marginBottom: designSystem.spacing[8],
                    padding: designSystem.spacing[6],
                    borderRadius: designSystem.borderRadius['2xl'],
                    background: service.iconBg,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  }}
                >
                  <service.icon size={40} style={{ color: service.iconColor }} />
                </div>
              ) : (
                <motion.div
                  whileHover={{ 
                    scale: 1.15,
                    rotate: [0, -5, 5, 0],
                  }}
                  transition={{ 
                    duration: 0.5,
                    rotate: {
                      duration: 0.6,
                      ease: "easeInOut"
                    }
                  }}
                  className="inline-flex"
                  style={{
                    marginBottom: designSystem.spacing[8],
                    padding: designSystem.spacing[6],
                    borderRadius: designSystem.borderRadius['2xl'],
                    background: service.iconBg,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  }}
                >
                  <service.icon size={40} style={{ color: service.iconColor }} />
                </motion.div>
              )}

              {/* Title */}
              <h3
                id={`service-title-${index}`}
                style={{
                  marginBottom: designSystem.spacing[5],
                  fontSize: designSystem.typography.fontSize['2xl'],
                  fontWeight: designSystem.typography.fontWeight.bold,
                  color: designSystem.colors.brand.primary,
                  lineHeight: designSystem.typography.lineHeight.snug,
                }}
              >
                {service.title}
              </h3>

              {/* Description */}
              <p
                style={{
                  marginBottom: designSystem.spacing[8],
                  fontSize: designSystem.typography.fontSize['15'],
                  color: designSystem.colors.neutral[600],
                  lineHeight: designSystem.typography.lineHeight.relaxed,
                }}
              >
                {service.description}
              </p>

              {/* Features List */}
              <ul style={{ display: 'flex', flexDirection: 'column', gap: designSystem.spacing[3] }}>
                {service.features.map((feature, idx) => (
                  <motion.li
                    key={idx}
                    initial={isMobile ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                    animate={isMobile ? { opacity: 1, x: 0 } : (isInView ? { opacity: 1, x: 0 } : {})}
                    transition={{ duration: isMobile ? 0 : 0.4, delay: isMobile ? 0 : 0.4 + index * 0.15 + idx * 0.1 }}
                    className="flex items-start"
                    style={{ gap: designSystem.spacing[3] }}
                  >
                    <div
                      className="flex-shrink-0 rounded-full"
                      style={{
                        marginTop: designSystem.spacing[1],
                        padding: designSystem.spacing[1],
                        background: service.gradient,
                      }}
                    >
                      <Check size={16} style={{ color: designSystem.colors.neutral.white }} />
                    </div>
                    <span
                      style={{
                        fontSize: designSystem.typography.fontSize['15'],
                        color: designSystem.colors.neutral[700],
                        lineHeight: designSystem.typography.lineHeight.relaxed,
                      }}
                    >
                      {feature}
                    </span>
                  </motion.li>
                ))}
              </ul>

              {/* Decorative Glow */}
              <div
                className="absolute rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  top: designSystem.spacing[6],
                  right: designSystem.spacing[6],
                  width: designSystem.spacing[32],
                  height: designSystem.spacing[32],
                  background: service.gradient,
                  filter: 'blur(50px)',
                }}
              />
            </CardWrapper>
          );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <p
            className="mb-8 max-w-2xl mx-auto"
            style={{
              fontSize: designSystem.typography.fontSize['17'],
              color: designSystem.colors.neutral[600],
              lineHeight: designSystem.typography.lineHeight.relaxed,
            }}
          >
            Cada etapa é executada com precisão para garantir o máximo retorno do seu investimento.
          </p>
          <Link href="/processo" style={{ textDecoration: 'none' }}>
            <motion.span
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-3 px-10 py-5 rounded-full transition-[transform,box-shadow] duration-300"
              style={{
                background: designSystem.colors.gradients.primary,
                color: designSystem.colors.neutral.white,
                fontWeight: designSystem.typography.fontWeight.semibold,
                fontSize: designSystem.typography.fontSize['17'],
                boxShadow: '0 8px 24px rgba(26, 62, 92, 0.2)',
                cursor: 'pointer',
                border: 'none',
              }}
            >
              Conheça o Nosso Processo
              <TrendingUp size={20} />
            </motion.span>
          </Link>
        </motion.div>
        </section>
      </Container>
    </Section>
  );
}
