'use client';

import React, { useState, useEffect } from 'react';
import { Container } from './Container';
import { ArrowRight, TrendingUp, Shield, BarChart3, ChevronDown } from './icons';
import { motion, useScroll, useTransform } from 'motion/react';
import { designSystem } from './design-system';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { LogoPattern } from './LogoPatterns';
import Link from 'next/link';

export function Hero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const { scrollY } = useScroll();
  
  // Parallax effects - disabled on mobile
  const yPosOrb1 = useTransform(scrollY, [0, 500], [0, isMobile ? 0 : 150]);
  const yPosOrb2 = useTransform(scrollY, [0, 500], [0, isMobile ? 0 : -100]);
  
  useEffect(() => {
    // Detect mobile
    const mdBreakpoint = parseInt(designSystem.breakpoints.md);
    const checkMobile = () => {
      const mobile = window.innerWidth < mdBreakpoint;
      setIsMobile(mobile);
      
      // Disable smooth animations on mobile for better performance
      if (mobile) {
        document.documentElement.style.setProperty('--motion-reduce', '1');
      } else {
        document.documentElement.style.setProperty('--motion-reduce', '0');
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Only enable mouse tracking on desktop
    const handleMouseMove = (e: MouseEvent) => {
      if (window.innerWidth >= mdBreakpoint) {
        setMousePosition({
          x: (e.clientX / window.innerWidth - 0.5) * 20,
          y: (e.clientY / window.innerHeight - 0.5) * 20,
        });
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);
  
  const scrollToNext = () => {
    const servicesSection = document.getElementById('services');
    servicesSection?.scrollIntoView({ behavior: 'smooth' });
  };

  const stats = [
    { value: '10+', label: 'Projetos em execução' },
    { value: '30%', label: 'ROI médio anualizado' },
    { value: '100%', label: 'Transparência financeira' },
  ];

  const features = [
    {
      icon: Shield,
      title: 'Metodologia Validada',
      description: 'Processo testado e comprovado em dezenas de projetos bem-sucedidos',
    },
    {
      icon: BarChart3,
      title: 'Análise Técnica + Design',
      description: 'Decisões baseadas em dados combinadas com design funcional e contemporâneo',
    },
    {
      icon: TrendingUp,
      title: 'Gestão Completa',
      description: 'Do investimento inicial até a distribuição dos lucros',
    },
  ];

  return (
    <section 
      id="home"
      aria-labelledby="hero-title"
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{
        background: designSystem.colors.gradients.hero,
        paddingTop: '4.5rem', // Compensa o header fixo
      }}
    >
      {/* Animated Background Pattern - Padrão com Logo HABTA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        <LogoPattern 
          pattern="arrows-tiny" 
          opacity={0.09} 
          color={designSystem.colors.neutral.white}
        />
      </motion.div>

      {/* Floating Orbs - Verde Acinzentado com Parallax */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.15, 0.25, 0.15],
        }}
        style={{
          y: yPosOrb1,
          x: mousePosition.x * 0.5,
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-20 right-20 w-96 h-96 rounded-full pointer-events-none hidden md:block"
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            background: `radial-gradient(circle, ${designSystem.helpers.hexToRgba(designSystem.colors.brand.secondary, 0.4)} 0%, transparent 70%)`,
            filter: 'blur(60px)',
          }}
        />
      </motion.div>

      {/* Floating Orbs - Azul Petróleo com Parallax */}
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.3, 0.2],
        }}
        style={{
          y: yPosOrb2,
          x: mousePosition.x * -0.3,
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute bottom-20 left-20 w-80 h-80 rounded-full pointer-events-none hidden md:block"
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            background: `radial-gradient(circle, ${designSystem.helpers.hexToRgba(designSystem.colors.brand.primaryLight, 0.4)} 0%, transparent 70%)`,
            filter: 'blur(60px)',
          }}
        />
      </motion.div>

      <div className="relative z-10 w-full">
        <Container>
          <div 
            className="mx-auto flex flex-col items-center"
            style={{
              maxWidth: '72rem',
              paddingLeft: designSystem.spacing[4],
              paddingRight: designSystem.spacing[4],
              paddingTop: designSystem.spacing[24],
              paddingBottom: designSystem.spacing[24]
            }}
          >
            {/* Headline */}
            <motion.h1
              id="hero-title"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-center w-full"
              style={{
                fontSize: 'clamp(2rem, 6vw, 3.5rem)',
                lineHeight: 1.15,
                fontWeight: designSystem.typography.fontWeight.black,
                letterSpacing: designSystem.typography.letterSpacing.tight,
                color: designSystem.colors.neutral.white,
                maxWidth: '1100px',
                marginBottom: designSystem.spacing[8]
              }}
            >
              Transformamos património urbano em{' '}
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                style={{
                  background: designSystem.colors.gradients.accentReverse,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  display: 'inline-block',
                }}
              >
                oportunidades reais
              </motion.span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-center w-full"
              style={{
                fontSize: 'clamp(1.0625rem, 2.5vw, 1.25rem)',
                lineHeight: 1.6,
                color: designSystem.helpers.hexToRgba(designSystem.colors.neutral.white, 0.92),
                fontWeight: designSystem.typography.fontWeight.normal,
                maxWidth: '700px',
                marginBottom: designSystem.spacing[12]
              }}
            >
              Combinamos análise financeira, reabilitação inteligente e execução controlada para gerar rentabilidade sustentável.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-col sm:flex-row justify-center items-center w-full"
              style={{
                gap: designSystem.spacing[4],
                marginBottom: designSystem.spacing[16]
              }}
            >
              <Link href="/portfolio" style={{ textDecoration: 'none', width: isMobile ? '100%' : 'auto' }}>
                <motion.span
                  whileHover={isMobile ? {} : { scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="group inline-flex items-center justify-center rounded-full transition-all w-full sm:w-auto"
                  aria-label="Ver oportunidades de investimento disponíveis"
                  style={{
                    gap: designSystem.spacing[3],
                    paddingLeft: designSystem.spacing[10],
                    paddingRight: designSystem.spacing[10],
                    paddingTop: designSystem.spacing[5],
                    paddingBottom: designSystem.spacing[5],
                    background: designSystem.colors.gradients.secondary,
                    boxShadow: '0 10px 40px rgba(184, 149, 106, 0.3)',
                    color: designSystem.colors.brand.primary,
                    fontWeight: designSystem.typography.fontWeight.semibold,
                    fontSize: designSystem.typography.fontSize['17'],
                    minWidth: designSystem.sizes?.button?.minWidth?.md || '220px',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'inline-flex',
                  }}
                >
                  Ver Oportunidades
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </motion.span>
              </Link>

              <Link href="/contacto" style={{ textDecoration: 'none', width: isMobile ? '100%' : 'auto' }}>
                <motion.span
                  whileHover={isMobile ? {} : { scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center justify-center rounded-full backdrop-blur-md transition-all w-full sm:w-auto"
                  aria-label="Agendar consultoria gratuita"
                  style={{
                    gap: designSystem.spacing[3],
                    paddingLeft: designSystem.spacing[10],
                    paddingRight: designSystem.spacing[10],
                    paddingTop: designSystem.spacing[5],
                    paddingBottom: designSystem.spacing[5],
                    borderWidth: '2px',
                    borderColor: designSystem.helpers.hexToRgba(designSystem.colors.neutral.white, 0.3),
                    background: designSystem.helpers.hexToRgba(designSystem.colors.neutral.white, 0.1),
                    color: designSystem.colors.neutral.white,
                    fontWeight: designSystem.typography.fontWeight.semibold,
                    fontSize: designSystem.typography.fontSize['17'],
                    minWidth: designSystem.sizes?.button?.minWidth?.md || '220px',
                    cursor: 'pointer',
                    display: 'inline-flex',
                  }}
                >
                  Agendar Consultoria
                </motion.span>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="grid grid-cols-1 sm:grid-cols-3 w-full"
              role="region"
              aria-label="Indicadores de desempenho"
              style={{
                gap: designSystem.spacing[6],
                marginBottom: designSystem.spacing[20],
                maxWidth: '80rem'
              }}
            >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={isMobile ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                whileHover={isMobile ? {} : { scale: 1.02, y: -4 }}
                className="text-center backdrop-blur-xl"
                style={{
                  padding: designSystem.spacing[8],
                  borderRadius: designSystem.borderRadius['3xl'],
                  borderWidth: '2px',
                  background: `linear-gradient(135deg, ${designSystem.helpers.hexToRgba(designSystem.colors.brand.primary, 0.4)} 0%, ${designSystem.helpers.hexToRgba(designSystem.colors.brand.primaryDark, 0.5)} 100%)`,
                  borderColor: designSystem.helpers.hexToRgba(designSystem.colors.neutral.white, 0.3),
                  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                }}
              >
                <div
                  style={{
                    fontSize: 'clamp(2.5rem, 6vw, 3.5rem)',
                    fontWeight: designSystem.typography.fontWeight.black,
                    color: designSystem.colors.neutral.white,
                    marginBottom: designSystem.spacing[3],
                    lineHeight: 1,
                    textShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
                  }}
                >
                  {stat.value}
                </div>
                <div
                  style={{
                    fontSize: 'clamp(1rem, 2.5vw, 1.125rem)',
                    color: designSystem.colors.neutral.white,
                    fontWeight: designSystem.typography.fontWeight.bold,
                    lineHeight: 1.5,
                    textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)',
                  }}
                >
                  {stat.label}
                </div>
              </motion.div>
            ))}
            </motion.div>

            {/* Quick Features */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.7 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 w-full max-w-5xl mb-24"
            >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                whileHover={isMobile ? {} : { y: -4, scale: 1.01 }}
                className="flex flex-col items-center text-center p-6 sm:p-8 rounded-3xl backdrop-blur-xl border-2"
                style={{
                  background: `linear-gradient(135deg, ${designSystem.helpers.hexToRgba(designSystem.colors.brand.primary, 0.35)} 0%, ${designSystem.helpers.hexToRgba(designSystem.colors.brand.primaryDark, 0.45)} 100%)`,
                  borderColor: designSystem.helpers.hexToRgba(designSystem.colors.neutral.white, 0.25),
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
                  position: 'relative',
                  zIndex: 10,
                }}
              >
                {isMobile ? (
                  <div
                    className="mb-5 p-5 rounded-2xl"
                    style={{
                      background: `linear-gradient(135deg, ${designSystem.colors.brand.secondary} 0%, ${designSystem.colors.brand.secondaryDark} 100%)`,
                      boxShadow: '0 4px 20px rgba(184, 149, 106, 0.4)',
                    }}
                  >
                    <feature.icon 
                      size={44} 
                      style={{ 
                        color: designSystem.colors.neutral.white,
                        filter: 'drop-shadow(0 2px 6px rgba(0, 0, 0, 0.3))',
                      }} 
                    />
                  </div>
                ) : (
                  <motion.div
                    className="mb-5 p-5 rounded-2xl"
                    whileHover={{ rotate: 5, scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                    style={{
                      background: `linear-gradient(135deg, ${designSystem.colors.brand.secondary} 0%, ${designSystem.colors.brand.secondaryDark} 100%)`,
                      boxShadow: '0 4px 20px rgba(184, 149, 106, 0.4)',
                    }}
                  >
                    <feature.icon 
                      size={44} 
                      style={{ 
                        color: designSystem.colors.neutral.white,
                        filter: 'drop-shadow(0 2px 6px rgba(0, 0, 0, 0.3))',
                      }} 
                    />
                  </motion.div>
                )}
                <h3
                  style={{
                    fontSize: 'clamp(1.0625rem, 2.5vw, 1.1875rem)',
                    fontWeight: designSystem.typography.fontWeight.bold,
                    color: designSystem.colors.neutral.white,
                    marginBottom: '12px',
                    textShadow: '0 3px 10px rgba(0, 0, 0, 0.5)',
                  }}
                >
                  {feature.title}
                </h3>
                <p
                  style={{
                    fontSize: 'clamp(0.9375rem, 2vw, 1rem)',
                    color: designSystem.colors.neutral.white,
                    lineHeight: 1.6,
                    textShadow: '0 2px 8px rgba(0, 0, 0, 0.4)',
                  }}
                >
                  {feature.description}
                </p>
              </motion.div>
            ))}
            </motion.div>
          </div>
        </Container>

      {/* Scroll Indicator */}
      <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          onClick={scrollToNext}
          whileHover={isMobile ? {} : { scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer group"
          aria-label="Scroll to next section"
          style={{
            background: 'none',
            border: 'none',
            outline: 'none',
            zIndex: 1,
            pointerEvents: 'auto',
          }}
        >
          <span
            style={{
              color: designSystem.helpers.hexToRgba(designSystem.colors.neutral.white, 0.7),
              fontSize: designSystem.typography.fontSize.sm,
              fontWeight: designSystem.typography.fontWeight.medium,
              letterSpacing: designSystem.typography.letterSpacing.wide,
              textTransform: 'uppercase',
            }}
          >
            Explorar
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown 
              size={28} 
              style={{
                color: designSystem.helpers.hexToRgba(designSystem.colors.neutral.white, 0.7),
              }}
              className="group-hover:opacity-100 transition-opacity"
            />
          </motion.div>
      </motion.button>
      </div>
    </section>
  );
}
