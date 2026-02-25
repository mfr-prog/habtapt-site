'use client';

import React, { useState, useEffect } from 'react';
import { Container } from './Container';
import { Section } from './Section';
import { Star, Quote, Users } from './icons';
import { motion } from 'motion/react';
import { useInView } from './useInView';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { designSystem } from './design-system';
import { supabaseFetch } from '../utils/supabase/client';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  image: string;
  content: string;
  rating: number;
  project: string;
}

const fallbackTestimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Ricardo Mendes',
    role: 'Investidor Imobiliário',
    company: 'RM Capital',
    image: '',
    content: 'A HABTA apresentou-me uma análise de mercado detalhada que me deu total confiança no investimento. O retorno superou as expectativas e o processo foi completamente transparente do início ao fim.',
    rating: 5,
    project: 'Projeto Velask',
  },
  {
    id: '2',
    name: 'Ana Sofia Correia',
    role: 'Proprietária',
    company: '',
    image: '',
    content: 'Procurava uma equipa que tratasse da reabilitação do meu imóvel com profissionalismo. A HABTA geriu tudo de forma impecável — prazos cumpridos, orçamento respeitado e valorização acima do previsto.',
    rating: 5,
    project: 'Reabilitação Cascais',
  },
  {
    id: '3',
    name: 'Miguel Ferreira',
    role: 'Consultor Financeiro',
    company: 'MF Advisory',
    image: '',
    content: 'Recomendo a HABTA aos meus clientes que procuram diversificar com imobiliário. A metodologia baseada em dados e a comunicação constante distinguem-nos claramente no mercado português.',
    rating: 5,
    project: 'Consultoria de Investimento',
  },
];

export function Testimonials() {
  const { ref, isInView } = useInView({ threshold: 0.1 });
  const [isMobile, setIsMobile] = useState(false);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch testimonials from backend
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await supabaseFetch('testimonials', {
          method: 'GET',
        });

        if (response.ok) {
          const data = await response.json();

          if (data.testimonials && Array.isArray(data.testimonials)) {
            setTestimonials(data.testimonials);
          }
        } else {
          console.warn('[Testimonials] ⚠️ Erro ao carregar depoimentos, usando fallback');
          setTestimonials(fallbackTestimonials);
        }
      } catch (error) {
        console.error('[Testimonials] ❌ Erro:', error);
        setTestimonials(fallbackTestimonials);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  useEffect(() => {
    const lgBreakpoint = parseInt(designSystem.breakpoints.lg);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < lgBreakpoint);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const partners = [
    { name: 'Millennium BCP', logo: '🏦' },
    { name: 'EDP', logo: '⚡' },
    { name: 'Certificação Energética', logo: '🌿' },
    { name: 'ARU Lisboa', logo: '🏛️' },
    { name: 'Ordem Arquitetos', logo: '📐' },
    { name: 'IMI Premium', logo: '⭐' },
  ];

  return (
    <Section id="testimonials" background="white">
      <Container>
        <section aria-labelledby="testimonials-title">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 max-w-4xl mx-auto"
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
            <Users size={18} style={{ color: designSystem.colors.brand.secondary }} />
            <span
              style={{
                fontSize: designSystem.typography.fontSize.sm,
                fontWeight: designSystem.typography.fontWeight.semibold,
                color: designSystem.colors.brand.secondary,
                textTransform: 'uppercase',
                letterSpacing: designSystem.typography.letterSpacing.wider,
              }}
            >
              Depoimentos
            </span>
          </motion.div>

          <h2
            id="testimonials-title"
            style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: designSystem.typography.fontWeight.black,
              color: designSystem.colors.brand.primary,
              marginBottom: designSystem.spacing[6],
              letterSpacing: designSystem.typography.letterSpacing.tight,
            }}
          >
            O Que Dizem Nossos Parceiros
          </h2>

          <p
            className="max-w-2xl mx-auto"
            style={{
              fontSize: designSystem.typography.fontSize.lg,
              color: designSystem.colors.neutral[600],
              lineHeight: designSystem.typography.lineHeight.relaxed,
            }}
          >
            Investidores e proprietários que confiaram na nossa metodologia técnica e transparente.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: designSystem.spacing[12] }}>
            <p style={{ color: designSystem.colors.neutral[600] }}>
              Carregando depoimentos...
            </p>
          </div>
        ) : testimonials.length === 0 ? (
          <div style={{ textAlign: 'center', padding: designSystem.spacing[12] }}>
            <p style={{ color: designSystem.colors.neutral[600] }}>
              Nenhum depoimento cadastrado ainda.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {testimonials.map((testimonial, index) => {
            const CardWrapper = isMobile ? 'div' : motion.div;
            const cardProps = isMobile ? {} : {
              initial: { opacity: 0, y: 30 },
              animate: isInView ? { opacity: 1, y: 0 } : {},
              transition: { duration: 0.5, delay: 0.2 + index * 0.1 },
              whileHover: { y: -8 }
            };
            
            return (
            <CardWrapper
              key={testimonial.name}
              {...cardProps}
              className="relative bg-white rounded-3xl p-8 border transition-all duration-500"
              role="article"
              aria-label={`Depoimento de ${testimonial.name}, ${testimonial.role}`}
              style={{
                border: `1px solid ${designSystem.helpers.hexToRgba(designSystem.colors.brand.primary, 0.1)}`,
                boxShadow: designSystem.shadows.md,
              }}
            >
              {/* Quote Icon */}
              <div
                className="absolute -top-4 left-8 w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{
                  background: designSystem.colors.gradients.secondary,
                  boxShadow: designSystem.shadows.secondaryHover,
                }}
              >
                <Quote size={24} className="text-white" />
              </div>

              {/* Rating */}
              <div 
                className="flex gap-1 mb-4 mt-4"
                role="img"
                aria-label={`Avaliação: ${testimonial.rating} de 5 estrelas`}
              >
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    fill={designSystem.colors.brand.secondary}
                    style={{ color: designSystem.colors.brand.secondary }}
                    aria-hidden="true"
                  />
                ))}
              </div>

              {/* Content */}
              <p
                className="mb-6"
                style={{
                  fontSize: designSystem.typography.fontSize.base,
                  color: designSystem.colors.neutral[600],
                  lineHeight: designSystem.typography.lineHeight.relaxed,
                }}
              >
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4 pt-6 border-t"
                style={{
                  borderColor: designSystem.helpers.hexToRgba(designSystem.colors.brand.primary, 0.1),
                }}
              >
                <div className="relative">
                  <ImageWithFallback
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                  <div
                    className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center"
                    style={{
                      background: designSystem.colors.brand.secondary,
                    }}
                  >
                    <svg
                      width="10"
                      height="8"
                      viewBox="0 0 10 8"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1 4L3.5 6.5L9 1"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <div
                    style={{
                      fontSize: designSystem.typography.fontSize.base,
                      fontWeight: designSystem.typography.fontWeight.semibold,
                      color: designSystem.colors.brand.primary,
                    }}
                  >
                    {testimonial.name}
                  </div>
                  <div
                    style={{
                      fontSize: designSystem.typography.fontSize.sm,
                      color: designSystem.colors.neutral[600],
                    }}
                  >
                    {testimonial.role}
                  </div>
                  <div
                    style={{
                      fontSize: designSystem.typography.fontSize.xs,
                      color: designSystem.colors.brand.secondary,
                      fontWeight: designSystem.typography.fontWeight.semibold,
                    }}
                  >
                    {testimonial.project}
                  </div>
                </div>
              </div>
            </CardWrapper>
          );
            })}
          </div>
        )}

        {/* Trust Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="rounded-3xl p-10 text-center mb-16"
          style={{
            background: designSystem.colors.gradients.heroLuxury,
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
            Resultados Validados
          </h3>
          <p
            className="max-w-2xl mx-auto mb-8"
            style={{
              fontSize: designSystem.typography.fontSize.base,
              color: 'rgba(255, 255, 255, 0.85)',
              lineHeight: designSystem.typography.lineHeight.relaxed,
            }}
          >
            Mais de 10 projetos executados com gestão transparente, retorno previsível e metodologia técnica comprovada.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {partners.map((partner) => (
              <div
                key={partner.name}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl backdrop-blur-sm"
                style={{
                  background: designSystem.helpers.hexToRgba(designSystem.colors.neutral.white, 0.1),
                  border: `1px solid ${designSystem.helpers.hexToRgba(designSystem.colors.neutral.white, 0.2)}`,
                }}
              >
                <div
                  style={{
                    fontSize: designSystem.typography.fontSize['3xl'],
                  }}
                >
                  {partner.logo}
                </div>
                <div
                  style={{
                    fontSize: designSystem.typography.fontSize.xs,
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontWeight: designSystem.typography.fontWeight.medium,
                    textAlign: 'center',
                  }}
                >
                  {partner.name}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
        </section>
      </Container>
    </Section>
  );
}
