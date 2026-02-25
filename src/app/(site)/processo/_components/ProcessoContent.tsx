'use client';

import React, { useState, useEffect } from 'react';
import { Container } from '@/components/Container';
import { Section } from '@/components/Section';
import { Search, ClipboardCheck, Building2, Hammer, Camera, TrendingUp, DollarSign, ArrowRight, Workflow } from '@/components/icons';
import { motion } from 'motion/react';
import { useInView } from '@/components/useInView';
import { designSystem } from '@/components/design-system';
import { useRouter } from 'next/navigation';

export default function ProcessoContent() {
  const { ref, isInView } = useInView({ threshold: 0.1 });
  const router = useRouter();
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

  const steps = [
    {
      number: '01',
      icon: Search,
      title: 'Prospecção',
      description: 'Identificação de imóveis com potencial de valorização.',
      details: 'Análise de mercado, zonas em crescimento e oportunidades com alto ROI.',
      color: designSystem.colors.brand.primary,
    },
    {
      number: '02',
      icon: ClipboardCheck,
      title: 'Avaliação',
      description: 'Due diligence completa e estimativa de ROI.',
      details: 'Inspeção técnica, análise jurídica e projeção financeira detalhada.',
      color: designSystem.colors.brand.secondary,
    },
    {
      number: '03',
      icon: Building2,
      title: 'Aquisição',
      description: 'Negociação e compra com as melhores condições de mercado.',
      details: 'Negociação estratégica e formalização com segurança jurídica.',
      color: designSystem.colors.brand.accent,
    },
    {
      number: '04',
      icon: Hammer,
      title: 'Reforma',
      description: 'Execução controlada com foco em qualidade e prazo.',
      details: 'Gestão de obra, controlo de qualidade e relatórios semanais.',
      color: designSystem.colors.brand.primary,
    },
    {
      number: '05',
      icon: Camera,
      title: 'Marketing',
      description: 'Posicionamento e comunicação estratégica.',
      details: 'Home staging, fotografia profissional e campanhas digitais.',
      color: designSystem.colors.brand.secondary,
    },
    {
      number: '06',
      icon: TrendingUp,
      title: 'Venda',
      description: 'Comercialização e negociação final.',
      details: 'Precificação otimizada e fechamento com melhores condições.',
      color: designSystem.colors.brand.accent,
    },
    {
      number: '07',
      icon: DollarSign,
      title: 'Distribuição de Lucros',
      description: 'Reporting financeiro e partilha de resultados.',
      details: 'Transparência total com relatórios detalhados e transferência de valores.',
      color: designSystem.colors.brand.primary,
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <Section
        background="white"
        style={{
          paddingTop: '7.5rem',
          paddingBottom: '3.75rem',
        }}
      >
        <Container>
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
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
                background: designSystem.helpers.hexToRgba(designSystem.colors.brand.secondary, 0.08),
                border: `1px solid ${designSystem.helpers.hexToRgba(designSystem.colors.brand.secondary, 0.15)}`,
              }}
            >
              <Workflow size={18} style={{ color: designSystem.colors.brand.secondary }} />
              <span
                style={{
                  fontSize: designSystem.typography.fontSize.sm,
                  fontWeight: designSystem.typography.fontWeight.semibold,
                  color: designSystem.colors.brand.secondary,
                  textTransform: 'uppercase',
                  letterSpacing: designSystem.typography.letterSpacing.wider,
                }}
              >
                Nosso Processo
              </span>
            </motion.div>

            <h1
              style={{
                fontSize: 'clamp(2.5rem, 5vw, 3.75rem)',
                fontWeight: designSystem.typography.fontWeight.black,
                color: designSystem.colors.brand.primary,
                marginBottom: designSystem.spacing[6],
                letterSpacing: designSystem.typography.letterSpacing.tight,
                lineHeight: designSystem.typography.lineHeight.tight,
              }}
            >
              Nosso Processo
            </h1>

            <p
              className="max-w-3xl mx-auto"
              style={{
                fontSize: designSystem.typography.fontSize.xl,
                color: designSystem.colors.neutral[600],
                lineHeight: designSystem.typography.lineHeight.relaxed,
                marginBottom: designSystem.spacing[8],
              }}
            >
              Um método estruturado e transparente que garante previsibilidade e eficiência em cada projeto.
            </p>
          </motion.div>
        </Container>
      </Section>

      {/* Steps Section */}
      <Section background="muted">
        <Container>
          <div className="max-w-5xl mx-auto space-y-8">
            {steps.map((step, index) => {
              const CardWrapper = isMobile ? 'div' : motion.div;
              const cardProps = isMobile ? {} : {
                initial: { opacity: 0, x: index % 2 === 0 ? -40 : 40 },
                animate: isInView ? { opacity: 1, x: 0 } : {},
                transition: {
                  duration: 0.6,
                  delay: 0.1 + index * 0.1,
                },
                whileHover: {
                  x: index % 2 === 0 ? 8 : -8,
                  scale: 1.02,
                }
              };

              return (
                <CardWrapper
                  key={step.number}
                  {...cardProps}
                  className="group bg-white rounded-3xl overflow-hidden transition-all duration-500"
                  style={{
                    border: `1px solid ${designSystem.helpers.hexToRgba(designSystem.colors.brand.primary, 0.12)}`,
                    boxShadow: designSystem.shadows.md,
                  }}
                >
                  <div className="p-8 md:p-10 flex flex-col md:flex-row items-start gap-6">
                    {/* Number & Icon */}
                    <div className="flex items-center gap-4 md:gap-6">
                      <div
                        className="flex-shrink-0"
                        style={{
                          fontSize: designSystem.typography.fontSize['5xl'],
                          fontWeight: designSystem.typography.fontWeight.black,
                          color: designSystem.helpers.hexToRgba(step.color, 0.15),
                          lineHeight: 1,
                        }}
                      >
                        {step.number}
                      </div>

                      <div
                        className="flex-shrink-0 p-4 rounded-2xl"
                        style={{
                          background: designSystem.helpers.hexToRgba(step.color, 0.1),
                        }}
                      >
                        <step.icon
                          size={32}
                          style={{ color: step.color }}
                        />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <h3
                        className="mb-3"
                        style={{
                          fontSize: designSystem.typography.fontSize['2xl'],
                          fontWeight: designSystem.typography.fontWeight.bold,
                          color: designSystem.colors.brand.primary,
                          lineHeight: designSystem.typography.lineHeight.snug,
                        }}
                      >
                        {step.title}
                      </h3>

                      <p
                        className="mb-2"
                        style={{
                          fontSize: designSystem.typography.fontSize['17'],
                          color: designSystem.colors.neutral[700],
                          lineHeight: designSystem.typography.lineHeight.relaxed,
                        }}
                      >
                        {step.description}
                      </p>

                      <p
                        style={{
                          fontSize: designSystem.typography.fontSize['15'],
                          color: designSystem.colors.neutral[600],
                          lineHeight: designSystem.typography.lineHeight.relaxed,
                        }}
                      >
                        {step.details}
                      </p>
                    </div>
                  </div>
                </CardWrapper>
              );
            })}
          </div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center mt-16"
          >
            <motion.button
              onClick={() => router.push('/portfolio')}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-3 px-10 py-5 rounded-full transition-all duration-300"
              style={{
                background: designSystem.colors.gradients.secondary,
                color: designSystem.colors.neutral.white,
                fontWeight: designSystem.typography.fontWeight.semibold,
                fontSize: designSystem.typography.fontSize['17'],
                boxShadow: designSystem.shadows.secondaryHover,
                cursor: 'pointer',
                border: 'none',
              }}
            >
              Ver Projetos
              <ArrowRight size={20} />
            </motion.button>
          </motion.div>
        </Container>
      </Section>
    </>
  );
}
