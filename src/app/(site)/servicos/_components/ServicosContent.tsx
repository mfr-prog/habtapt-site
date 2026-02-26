'use client';

import React, { useState, useEffect } from 'react';
import { Container } from '@/components/Container';
import { Section } from '@/components/Section';
import { Search, Hammer, TrendingUp, ArrowRight, CheckCircle, Target, Phone, MessageCircle } from '@/components/icons';
import { motion } from 'motion/react';
import { useInView } from '@/components/useInView';
import { designSystem } from '@/components/design-system';
import { useRouter } from 'next/navigation';

export default function ServicosContent() {
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

  const services = [
    {
      icon: Search,
      title: 'Compra Estratégica',
      description: 'Identificamos e adquirimos imóveis com alto potencial de valorização através de análise criteriosa de mercado e negociação técnica especializada.',
      benefits: [
        'Seleção em zonas de alta valorização',
        'Análise aprofundada de potencial de mercado',
        'Negociação técnica especializada',
        'Due diligence completa (jurídica e técnica)',
        'Avaliação de comparáveis de mercado',
      ],
      roi: {
        label: 'Diferencial',
        value: 'Negociação',
        description: 'Aquisição abaixo do valor de mercado com análise técnica'
      },
      gradient: designSystem.colors.gradients.primary,
      color: designSystem.colors.brand.primary,
    },
    {
      icon: Hammer,
      title: 'Reforma Inteligente',
      description: 'Transformamos imóveis com design funcional, materiais premium e gestão rigorosa que garante qualidade, prazos e controlo total do orçamento.',
      benefits: [
        'Design contemporâneo e funcional',
        'Materiais de alta qualidade e durabilidade',
        'Gestão de obra com controlo de prazos',
        'Orçamento fechado e transparente',
        'Certificação energética classe A/A+',
      ],
      roi: {
        label: 'Diferencial',
        value: 'Qualidade',
        description: 'Acabamentos premium que valorizam o imóvel acima da média do mercado'
      },
      gradient: designSystem.colors.gradients.secondary,
      color: designSystem.colors.brand.secondary,
    },
    {
      icon: TrendingUp,
      title: 'Venda Otimizada',
      description: 'Maximizamos o retorno do investimento com precificação estratégica, home staging profissional e campanhas de marketing altamente direcionadas.',
      benefits: [
        'Precificação baseada em dados de mercado',
        'Home staging e fotografia de alto padrão',
        'Campanhas multicanal segmentadas',
        'Negociação especializada com compradores',
        'Distribuição transparente de resultados',
      ],
      roi: {
        label: 'Diferencial',
        value: 'Estratégia',
        description: 'Precificação baseada em dados e venda otimizada para máximo retorno'
      },
      gradient: designSystem.colors.gradients.accent,
      color: designSystem.colors.brand.accent,
    },
  ];

  const handleWhatsApp = () => {
    window.open('https://wa.me/351963290394?text=Olá! Gostaria de saber mais sobre os serviços da HABTA.', '_blank');
  };

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
                background: designSystem.helpers.hexToRgba(designSystem.colors.brand.primary, 0.08),
                border: `1px solid ${designSystem.helpers.hexToRgba(designSystem.colors.brand.primary, 0.15)}`,
              }}
            >
              <Target size={18} style={{ color: designSystem.colors.brand.primary }} />
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
              Do Potencial ao Lucro
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
              Um processo completo e eficiente que transforma imóveis com potencial em ativos de rentabilidade comprovada através de três fases integradas.
            </p>
          </motion.div>
        </Container>
      </Section>

      {/* Services Grid */}
      <Section background="muted">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
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
                  y: -12,
                  scale: 1.02,
                }
              };

              return (
                <CardWrapper
                  key={service.title}
                  {...cardProps}
                  className="group bg-white rounded-3xl overflow-hidden transition-all duration-500"
                  style={{
                    border: `1px solid ${designSystem.helpers.hexToRgba(designSystem.colors.brand.primary, 0.12)}`,
                    boxShadow: designSystem.shadows.lg,
                  }}
                >
                  {/* Icon Header */}
                  <div
                    className="p-8 pb-6"
                    style={{
                      background: designSystem.helpers.hexToRgba(service.color, 0.05),
                    }}
                  >
                    <div
                      className="inline-flex p-6 rounded-2xl mb-6"
                      style={{
                        background: service.gradient,
                        boxShadow: `0 12px 28px ${designSystem.helpers.hexToRgba(service.color, 0.35)}`,
                      }}
                    >
                      <service.icon
                        size={36}
                        style={{ color: designSystem.colors.neutral.white }}
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8 pt-4">
                    <h3
                      className="mb-4"
                      style={{
                        fontSize: designSystem.typography.fontSize['2xl'],
                        fontWeight: designSystem.typography.fontWeight.bold,
                        color: designSystem.colors.brand.primary,
                        lineHeight: designSystem.typography.lineHeight.snug,
                      }}
                    >
                      {service.title}
                    </h3>

                    <p
                      className="mb-6"
                      style={{
                        fontSize: designSystem.typography.fontSize.base,
                        color: designSystem.colors.neutral[600],
                        lineHeight: designSystem.typography.lineHeight.relaxed,
                      }}
                    >
                      {service.description}
                    </p>

                    {/* Benefits List */}
                    <div className="mb-6">
                      <h4
                        className="mb-4"
                        style={{
                          fontSize: designSystem.typography.fontSize.sm,
                          fontWeight: designSystem.typography.fontWeight.bold,
                          color: designSystem.colors.brand.primary,
                          textTransform: 'uppercase',
                          letterSpacing: designSystem.typography.letterSpacing.wide,
                        }}
                      >
                        Vantagens
                      </h4>
                      <ul className="space-y-3">
                        {service.benefits.map((benefit, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <CheckCircle
                              size={20}
                              style={{
                                color: service.color,
                                flexShrink: 0,
                                marginTop: '2px',
                              }}
                            />
                            <span
                              style={{
                                fontSize: designSystem.typography.fontSize.sm,
                                color: designSystem.colors.neutral[700],
                                lineHeight: designSystem.typography.lineHeight.relaxed,
                              }}
                            >
                              {benefit}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* ROI Card */}
                    <div
                      className="mb-6 p-5 rounded-2xl"
                      style={{
                        background: designSystem.helpers.hexToRgba(service.color, 0.08),
                        border: `1px solid ${designSystem.helpers.hexToRgba(service.color, 0.2)}`,
                      }}
                    >
                      <div className="flex items-baseline gap-2 mb-2">
                        <span
                          style={{
                            fontSize: designSystem.typography.fontSize.xs,
                            fontWeight: designSystem.typography.fontWeight.semibold,
                            color: service.color,
                            textTransform: 'uppercase',
                            letterSpacing: designSystem.typography.letterSpacing.wider,
                          }}
                        >
                          {service.roi.label}
                        </span>
                        <span
                          style={{
                            fontSize: designSystem.typography.fontSize['2xl'],
                            fontWeight: designSystem.typography.fontWeight.black,
                            color: service.color,
                          }}
                        >
                          {service.roi.value}
                        </span>
                      </div>
                      <p
                        style={{
                          fontSize: designSystem.typography.fontSize.xs,
                          color: designSystem.colors.neutral[600],
                          lineHeight: designSystem.typography.lineHeight.relaxed,
                        }}
                      >
                        {service.roi.description}
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
            className="text-center mt-20"
          >
            <div
              className="max-w-3xl mx-auto p-10 rounded-3xl"
              style={{
                background: designSystem.colors.gradients.heroSubtle,
                border: `1px solid ${designSystem.helpers.hexToRgba(designSystem.colors.neutral.white, 0.1)}`,
              }}
            >
              <h3
                className="mb-4"
                style={{
                  fontSize: designSystem.typography.fontSize['2xl'],
                  fontWeight: designSystem.typography.fontWeight.bold,
                  color: designSystem.colors.neutral.white,
                }}
              >
                Pronto para Maximizar seu Investimento?
              </h3>
              <p
                className="mb-8"
                style={{
                  fontSize: designSystem.typography.fontSize.lg,
                  color: designSystem.helpers.hexToRgba(designSystem.colors.neutral.white, 0.9),
                  lineHeight: designSystem.typography.lineHeight.relaxed,
                }}
              >
                Conheça o nosso processo completo em 7 etapas e entenda como transformamos cada fase em resultado.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  onClick={() => router.push('/contacto')}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-3 px-10 py-5 rounded-full transition-all duration-300"
                  style={{
                    background: designSystem.colors.neutral.white,
                    color: designSystem.colors.brand.primary,
                    fontWeight: designSystem.typography.fontWeight.semibold,
                    fontSize: designSystem.typography.fontSize.base,
                    boxShadow: designSystem.shadows.xl,
                    cursor: 'pointer',
                    border: 'none',
                  }}
                >
                  <Phone size={20} />
                  Agendar Reunião
                </motion.button>

                <motion.button
                  onClick={handleWhatsApp}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-3 px-10 py-5 rounded-full transition-all duration-300"
                  style={{
                    background: 'transparent',
                    color: designSystem.colors.neutral.white,
                    fontWeight: designSystem.typography.fontWeight.semibold,
                    fontSize: designSystem.typography.fontSize.base,
                    border: `2px solid ${designSystem.colors.neutral.white}`,
                    cursor: 'pointer',
                  }}
                >
                  <MessageCircle size={20} />
                  Saiba Mais
                </motion.button>
              </div>

              <div className="mt-6 pt-6 border-t border-white/20">
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <motion.button
                    onClick={() => router.push('/processo')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center gap-2 text-white/90 hover:text-white transition-colors"
                    style={{
                      fontSize: designSystem.typography.fontSize.sm,
                      fontWeight: designSystem.typography.fontWeight.medium,
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    Ver o Nosso Processo
                    <ArrowRight size={16} />
                  </motion.button>

                  <span className="hidden sm:block text-white/40">&bull;</span>

                  <motion.button
                    onClick={() => router.push('/portfolio')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center gap-2 text-white/90 hover:text-white transition-colors"
                    style={{
                      fontSize: designSystem.typography.fontSize.sm,
                      fontWeight: designSystem.typography.fontWeight.medium,
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    Ver Projetos
                    <TrendingUp size={16} />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </Container>
      </Section>
    </>
  );
}
