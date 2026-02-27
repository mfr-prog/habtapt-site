'use client';

import React, { useState, useEffect } from 'react';
import { Container } from './Container';
import { Section } from './Section';
import { FileSearch, ClipboardCheck, Hammer, Sparkles, Camera, TrendingUp, DollarSign, Workflow } from './icons';
import { motion } from 'motion/react';
import { useInView } from './useInView';
import { designSystem } from './design-system';

export function Process() {
  const { ref, isInView } = useInView({ threshold: 0.05 });
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
      title: 'Prospecção',
      description: 'Identificação de imóveis com potencial através de análise de mercado e inteligência de dados.',
      icon: FileSearch,
      color: designSystem.colors.brand.primary,
    },
    {
      number: '02',
      title: 'Avaliação',
      description: 'Due diligence completa: técnica, jurídica e financeira com projeção de ROI validada.',
      icon: ClipboardCheck,
      color: designSystem.colors.brand.primaryLight,
    },
    {
      number: '03',
      title: 'Negociação',
      description: 'Estratégia de aquisição otimizada com negociação assertiva e garantias jurídicas completas.',
      icon: DollarSign,
      color: designSystem.colors.brand.tertiary,
    },
    {
      number: '04',
      title: 'Reforma',
      description: 'Execução de projeto arquitetónico com materiais premium e gestão controlada de prazos e custos.',
      icon: Hammer,
      color: designSystem.colors.brand.tertiaryLight,
    },
    {
      number: '05',
      title: 'Marketing',
      description: 'Campanha 360° com home staging, fotografia profissional e estratégia multicanal de divulgação.',
      icon: Camera,
      color: designSystem.colors.brand.secondaryLight,
    },
    {
      number: '06',
      title: 'Venda',
      description: 'Negociação qualificada e gestão do processo comercial até concretização ao melhor valor de mercado.',
      icon: TrendingUp,
      color: designSystem.colors.brand.secondary,
    },
    {
      number: '07',
      title: 'Distribuição de Lucros',
      description: 'Liquidação financeira transparente com distribuição de retornos aos investidores conforme acordado.',
      icon: Workflow,
      color: designSystem.colors.brand.accent,
    },
  ];

  return (
    <Section id="process" background={designSystem.colors.neutral[50]}>
      <Container>
        <section aria-labelledby="process-title">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 max-w-4xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center rounded-full"
            style={{
              gap: designSystem.spacing[2],
              paddingLeft: designSystem.spacing[5],
              paddingRight: designSystem.spacing[5],
              paddingTop: designSystem.spacing[3],
              paddingBottom: designSystem.spacing[3],
              marginBottom: designSystem.spacing[6],
              background: designSystem.helpers.hexToRgba(designSystem.colors.brand.secondary, 0.1),
              border: `1px solid ${designSystem.helpers.hexToRgba(designSystem.colors.brand.secondary, 0.3)}`,
            }}
          >
            <Workflow size={18} style={{ color: designSystem.colors.brand.secondary }} />
            <span
              style={{
                color: designSystem.colors.brand.secondary,
                fontSize: designSystem.typography.fontSize.sm,
                fontWeight: designSystem.typography.fontWeight.semibold,
                letterSpacing: designSystem.typography.letterSpacing.wider,
                textTransform: 'uppercase',
              }}
            >
              Processo
            </span>
          </motion.div>

          <h2
            id="process-title"
            style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: designSystem.typography.fontWeight.black,
              color: designSystem.colors.brand.primary,
              marginBottom: designSystem.spacing[6],
              letterSpacing: designSystem.typography.letterSpacing.tight,
            }}
          >
            Do início ao retorno
          </h2>

          <p
            className="max-w-2xl mx-auto"
            style={{
              fontSize: designSystem.typography.fontSize.lg,
              color: designSystem.colors.neutral[600],
              lineHeight: designSystem.typography.lineHeight.relaxed,
            }}
          >
            Seguimos um processo estruturado, técnico e transparente que garante previsibilidade em cada fase do projeto.
          </p>
        </motion.div>

        {/* Timeline Layout */}
        <div className="relative max-w-6xl mx-auto">
          {/* Vertical Line (Desktop) */}
          <div 
            className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent to-transparent"
            style={{
              background: `linear-gradient(to bottom, transparent, ${designSystem.helpers.hexToRgba(designSystem.colors.brand.tertiary, 0.2)}, transparent)`,
            }}
          />

          <div className="space-y-8 lg:space-y-16">
            {steps.map((step, index) => {
              const isEven = index % 2 === 0;
              
              const StepWrapper = isMobile ? 'div' : motion.div;
              const stepProps = isMobile ? {} : {
                initial: { opacity: 0, x: isEven ? -30 : 30 },
                animate: isInView ? { opacity: 1, x: 0 } : {},
                transition: { duration: 0.6, delay: 0.2 + index * 0.1 }
              };
              
              return (
                <StepWrapper
                  key={step.number}
                  {...stepProps}
                  className={`relative lg:grid lg:grid-cols-2 lg:gap-12 ${
                    isEven ? '' : 'lg:grid-flow-dense'
                  }`}
                  role="article"
                  aria-labelledby={`step-title-${step.number}`}
                >
                  {/* Content */}
                  {isMobile ? (
                    <div
                      className={`${
                        isEven ? '' : 'lg:col-start-2'
                      }`}
                    >
                      <div
                        className="bg-white rounded-3xl p-8 border transition-[transform,box-shadow] duration-500 group hover:shadow-2xl"
                        style={{
                          borderColor: designSystem.helpers.hexToRgba(step.color, 0.2),
                          boxShadow: `0 4px 20px ${designSystem.helpers.hexToRgba(step.color, 0.08)}`,
                        }}
                      >
                        {/* Header: Number Only */}
                        <div className="flex items-center gap-4 mb-6">
                          <div
                            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl flex-shrink-0"
                            style={{
                              background: `linear-gradient(135deg, ${step.color} 0%, ${step.color}dd 100%)`,
                            }}
                            aria-label={`Etapa ${step.number}`}
                          >
                            <span
                              style={{
                                fontSize: designSystem.typography.fontSize['2xl'],
                                fontWeight: designSystem.typography.fontWeight.black,
                                color: designSystem.colors.neutral.white,
                              }}
                              aria-hidden="true"
                            >
                              {step.number}
                            </span>
                          </div>
                        </div>

                        {/* Title */}
                        <h3
                          id={`step-title-${step.number}`}
                          className="mb-4"
                          style={{
                            fontSize: designSystem.typography.fontSize['2xl'],
                            fontWeight: designSystem.typography.fontWeight.bold,
                            color: designSystem.colors.brand.primary,
                          }}
                        >
                          {step.title}
                        </h3>

                        {/* Description */}
                        <p
                          style={{
                            fontSize: designSystem.typography.fontSize.base,
                            color: designSystem.colors.neutral[600],
                            lineHeight: designSystem.typography.lineHeight.relaxed,
                          }}
                        >
                          {step.description}
                        </p>

                        {/* Decorative Gradient */}
                        <div
                          className="absolute -bottom-2 -right-2 w-32 h-32 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"
                          style={{
                            background: `radial-gradient(circle, ${designSystem.helpers.hexToRgba(step.color, 0.2)} 0%, transparent 70%)`,
                            filter: 'blur(30px)',
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    <motion.div
                      whileHover={{ scale: 1.02, y: -4 }}
                      className={`${
                        isEven ? '' : 'lg:col-start-2'
                      }`}
                    >
                      <div
                        className="bg-white rounded-3xl p-8 border transition-[transform,box-shadow] duration-500 group hover:shadow-2xl"
                        style={{
                          borderColor: designSystem.helpers.hexToRgba(step.color, 0.2),
                          boxShadow: `0 4px 20px ${designSystem.helpers.hexToRgba(step.color, 0.08)}`,
                        }}
                      >
                        {/* Header: Number Only */}
                        <div className="flex items-center gap-4 mb-6">
                          <div
                            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl flex-shrink-0"
                            style={{
                              background: `linear-gradient(135deg, ${step.color} 0%, ${step.color}dd 100%)`,
                            }}
                            aria-label={`Etapa ${step.number}`}
                          >
                            <span
                              style={{
                                fontSize: designSystem.typography.fontSize['2xl'],
                                fontWeight: designSystem.typography.fontWeight.black,
                                color: designSystem.colors.neutral.white,
                              }}
                              aria-hidden="true"
                            >
                              {step.number}
                            </span>
                          </div>
                        </div>

                        {/* Title */}
                        <h3
                          id={`step-title-${step.number}`}
                          className="mb-4"
                          style={{
                            fontSize: designSystem.typography.fontSize['2xl'],
                            fontWeight: designSystem.typography.fontWeight.bold,
                            color: designSystem.colors.brand.primary,
                          }}
                        >
                          {step.title}
                        </h3>

                        {/* Description */}
                        <p
                          style={{
                            fontSize: designSystem.typography.fontSize.base,
                            color: designSystem.colors.neutral[600],
                            lineHeight: designSystem.typography.lineHeight.relaxed,
                          }}
                        >
                          {step.description}
                        </p>

                        {/* Decorative Gradient */}
                        <div
                          className="absolute -bottom-2 -right-2 w-32 h-32 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"
                          style={{
                            background: `radial-gradient(circle, ${designSystem.helpers.hexToRgba(step.color, 0.2)} 0%, transparent 70%)`,
                            filter: 'blur(30px)',
                          }}
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* Center Node (Desktop) */}
                  <div 
                    className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center justify-center w-16 h-16 rounded-full bg-white z-10"
                    style={{
                      border: `3px solid ${step.color}`,
                      boxShadow: `0 0 20px ${designSystem.helpers.hexToRgba(step.color, 0.4)}`,
                    }}
                  >
                    <step.icon size={24} style={{ color: step.color }} />
                  </div>
                </StepWrapper>
              );
            })}
          </div>
        </div>

        {/* Bottom Stats */}
        <motion.div
          initial={isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          animate={isMobile ? { opacity: 1, y: 0 } : (isInView ? { opacity: 1, y: 0 } : {})}
          transition={{ duration: isMobile ? 0 : 0.6, delay: isMobile ? 0 : 1 }}
          className="mt-20 p-10 rounded-3xl text-center"
          style={{
            background: designSystem.colors.gradients.heroLuxury,
            boxShadow: designSystem.shadows.luxuryGlow,
          }}
        >
          <h3
            className="mb-6"
            style={{
              fontSize: designSystem.typography.fontSize['3xl'],
              fontWeight: designSystem.typography.fontWeight.bold,
              color: designSystem.colors.neutral.white,
            }}
          >
            Resultados consistentes em cada projeto
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div
                style={{
                  fontSize: designSystem.typography.fontSize['5xl'],
                  fontWeight: designSystem.typography.fontWeight.black,
                  color: designSystem.colors.neutral.white,
                  marginBottom: designSystem.spacing[2],
                }}
              >
                3-6
              </div>
              <div
                style={{
                  fontSize: designSystem.typography.fontSize.lg,
                  color: designSystem.helpers.hexToRgba(designSystem.colors.neutral.white, 0.9),
                }}
              >
                Meses do investimento ao retorno
              </div>
            </div>
            
            <div>
              <div
                style={{
                  fontSize: designSystem.typography.fontSize['5xl'],
                  fontWeight: designSystem.typography.fontWeight.black,
                  color: designSystem.colors.neutral.white,
                  marginBottom: designSystem.spacing[2],
                }}
              >
                24/7
              </div>
              <div
                style={{
                  fontSize: designSystem.typography.fontSize.lg,
                  color: designSystem.helpers.hexToRgba(designSystem.colors.neutral.white, 0.9),
                }}
              >
                Acompanhamento online da obra
              </div>
            </div>
            
            <div>
              <div
                style={{
                  fontSize: designSystem.typography.fontSize['5xl'],
                  fontWeight: designSystem.typography.fontWeight.black,
                  color: designSystem.colors.neutral.white,
                  marginBottom: designSystem.spacing[2],
                }}
              >
                100%
              </div>
              <div
                style={{
                  fontSize: designSystem.typography.fontSize.lg,
                  color: designSystem.helpers.hexToRgba(designSystem.colors.neutral.white, 0.9),
                }}
              >
                Documentação transparente
              </div>
            </div>
          </div>
        </motion.div>
        </section>
      </Container>
    </Section>
  );
}