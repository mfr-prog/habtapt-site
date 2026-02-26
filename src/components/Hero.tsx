'use client';

import React, { useState, useEffect } from 'react';
import { Container } from './Container';
import { ArrowRight, ChevronDown } from './icons';
import { motion, useScroll, useTransform } from 'motion/react';
import { designSystem } from './design-system';
import { LogoPattern } from './LogoPatterns';
import Link from 'next/link';

export function Hero() {
  const [isMobile, setIsMobile] = useState(false);
  const { scrollY } = useScroll();
  const yParallax = useTransform(scrollY, [0, 600], [0, isMobile ? 0 : 120]);

  useEffect(() => {
    const mdBreakpoint = parseInt(designSystem.breakpoints.md);
    const checkMobile = () => setIsMobile(window.innerWidth < mdBreakpoint);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const scrollToNext = () => {
    const nextSection = document.getElementById('portfolio');
    nextSection?.scrollIntoView({ behavior: 'smooth' });
  };

  const stats = [
    { value: '10+', label: 'Projetos' },
    { value: '30%', label: 'ROI médio' },
    { value: '100%', label: 'Transparência' },
  ];

  return (
    <section
      id="home"
      aria-labelledby="hero-title"
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{
        paddingTop: '4.5rem',
      }}
    >
      {/* Background Image with Gradient Overlay */}
      <motion.div
        className="absolute inset-0"
        style={{ y: yParallax }}
      >
        <img
          src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1920"
          alt=""
          className="w-full h-full object-cover"
          style={{ minHeight: '120%' }}
        />
        {/* Gradient overlays */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, rgba(26, 62, 92, 0.85) 0%, rgba(26, 62, 92, 0.6) 40%, rgba(26, 62, 92, 0.9) 100%)`,
          }}
        />
      </motion.div>

      {/* Logo Pattern overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0"
        style={{ zIndex: 1 }}
      >
        <LogoPattern
          pattern="arrows-tiny"
          opacity={0.06}
          color={designSystem.colors.neutral.white}
        />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 w-full">
        <Container>
          <div
            className="mx-auto flex flex-col items-center"
            style={{
              maxWidth: '72rem',
              paddingLeft: designSystem.spacing[4],
              paddingRight: designSystem.spacing[4],
              paddingTop: designSystem.spacing[16],
              paddingBottom: designSystem.spacing[12],
            }}
          >
            {/* Project badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex items-center rounded-full"
              style={{
                paddingLeft: designSystem.spacing[5],
                paddingRight: designSystem.spacing[5],
                paddingTop: designSystem.spacing[2],
                paddingBottom: designSystem.spacing[2],
                marginBottom: designSystem.spacing[6],
                background: 'rgba(255, 255, 255, 0.12)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <span
                style={{
                  fontSize: designSystem.typography.fontSize.sm,
                  fontWeight: designSystem.typography.fontWeight.bold,
                  color: designSystem.colors.neutral.white,
                  letterSpacing: designSystem.typography.letterSpacing.wider,
                  textTransform: 'uppercase',
                }}
              >
                Novo Projeto
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              id="hero-title"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-center w-full"
              style={{
                fontSize: 'clamp(2.5rem, 7vw, 4.5rem)',
                lineHeight: 1.1,
                fontWeight: designSystem.typography.fontWeight.black,
                letterSpacing: designSystem.typography.letterSpacing.tight,
                color: designSystem.colors.neutral.white,
                maxWidth: '900px',
                marginBottom: designSystem.spacing[4],
              }}
            >
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.4 }}
                style={{
                  background: designSystem.colors.gradients.accentReverse,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  display: 'inline-block',
                }}
              >
                VELASK
              </motion.span>
              {' '}Residence
            </motion.h1>

            {/* Location */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center"
              style={{
                fontSize: designSystem.typography.fontSize.xl,
                color: 'rgba(255, 255, 255, 0.85)',
                fontWeight: designSystem.typography.fontWeight.medium,
                marginBottom: designSystem.spacing[6],
              }}
            >
              Antas, Porto
            </motion.p>

            {/* Specs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap justify-center items-center"
              style={{
                gap: designSystem.spacing[4],
                marginBottom: designSystem.spacing[4],
              }}
            >
              {['T1 a T3 Duplex', '106–118 m²', 'Entrega Abril 2026'].map((spec, i) => (
                <React.Fragment key={spec}>
                  {i > 0 && (
                    <div
                      className="hidden sm:block"
                      style={{
                        width: '4px',
                        height: '4px',
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.4)',
                      }}
                    />
                  )}
                  <span
                    style={{
                      fontSize: designSystem.typography.fontSize.base,
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontWeight: designSystem.typography.fontWeight.medium,
                    }}
                  >
                    {spec}
                  </span>
                </React.Fragment>
              ))}
            </motion.div>

            {/* Price */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-center"
              style={{
                marginBottom: designSystem.spacing[10],
              }}
            >
              <span
                style={{
                  fontSize: designSystem.typography.fontSize.sm,
                  color: 'rgba(255, 255, 255, 0.6)',
                  textTransform: 'uppercase',
                  letterSpacing: designSystem.typography.letterSpacing.wider,
                  display: 'block',
                  marginBottom: designSystem.spacing[1],
                }}
              >
                Desde
              </span>
              <span
                style={{
                  fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                  fontWeight: designSystem.typography.fontWeight.black,
                  color: designSystem.colors.neutral.white,
                }}
              >
                Sob consulta
              </span>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="flex flex-col sm:flex-row justify-center items-center w-full"
              style={{
                gap: designSystem.spacing[4],
                marginBottom: designSystem.spacing[16],
              }}
            >
              <Link href="/velask" style={{ textDecoration: 'none', width: isMobile ? '100%' : 'auto' }}>
                <motion.span
                  whileHover={isMobile ? {} : { scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="group inline-flex items-center justify-center rounded-full transition-all w-full sm:w-auto"
                  aria-label="Ver unidades do VELASK Residence"
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
                    minWidth: '220px',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'inline-flex',
                  }}
                >
                  Ver Unidades
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </motion.span>
              </Link>

              <Link href="/imoveis" style={{ textDecoration: 'none', width: isMobile ? '100%' : 'auto' }}>
                <motion.span
                  whileHover={isMobile ? {} : { scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center justify-center rounded-full backdrop-blur-md transition-all w-full sm:w-auto"
                  aria-label="Ver todos os imóveis disponíveis"
                  style={{
                    gap: designSystem.spacing[3],
                    paddingLeft: designSystem.spacing[10],
                    paddingRight: designSystem.spacing[10],
                    paddingTop: designSystem.spacing[5],
                    paddingBottom: designSystem.spacing[5],
                    borderWidth: '2px',
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: designSystem.colors.neutral.white,
                    fontWeight: designSystem.typography.fontWeight.semibold,
                    fontSize: designSystem.typography.fontSize['17'],
                    minWidth: '220px',
                    cursor: 'pointer',
                    display: 'inline-flex',
                  }}
                >
                  Todos os Imóveis
                </motion.span>
              </Link>
            </motion.div>

            {/* Compact Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="flex flex-wrap justify-center"
              style={{
                gap: designSystem.spacing[8],
              }}
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={isMobile ? { opacity: 1 } : { opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                  className="text-center"
                >
                  <div
                    style={{
                      fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                      fontWeight: designSystem.typography.fontWeight.black,
                      color: designSystem.colors.neutral.white,
                      lineHeight: 1,
                      marginBottom: designSystem.spacing[1],
                    }}
                  >
                    {stat.value}
                  </div>
                  <div
                    style={{
                      fontSize: designSystem.typography.fontSize.sm,
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontWeight: designSystem.typography.fontWeight.medium,
                    }}
                  >
                    {stat.label}
                  </div>
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
              color: 'rgba(255, 255, 255, 0.7)',
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
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronDown
              size={28}
              style={{ color: 'rgba(255, 255, 255, 0.7)' }}
              className="group-hover:opacity-100 transition-opacity"
            />
          </motion.div>
        </motion.button>
      </div>
    </section>
  );
}
