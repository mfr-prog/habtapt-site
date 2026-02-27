'use client';

import React, { useState, useEffect } from 'react';
import { Container } from './Container';
import { ArrowRight } from './icons';
import { motion, useScroll, useTransform } from 'motion/react';
import { designSystem } from './design-system';
import { LogoPattern } from './LogoPatterns';
import Link from 'next/link';

export function Hero() {
  const [isMobile, setIsMobile] = useState(false);
  const { scrollY } = useScroll();
  const yParallax = useTransform(scrollY, [0, 600], [0, isMobile ? 0 : 80]);

  useEffect(() => {
    const mdBreakpoint = parseInt(designSystem.breakpoints.md);
    const checkMobile = () => setIsMobile(window.innerWidth < mdBreakpoint);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <section
      id="home"
      aria-labelledby="hero-title"
      className="relative flex items-center overflow-hidden"
      style={{
        minHeight: '100vh',
        paddingTop: '72px',
      }}
    >
      {/* Background Image with Gradient Overlay */}
      <motion.div
        className="absolute inset-0"
        style={{ y: yParallax }}
      >
        <img
          src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?crop=entropy&cs=tinysrgb&fit=crop&fm=webp&ixlib=rb-4.1.0&q=70&w=1280"
          srcSet={[
            'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?crop=entropy&cs=tinysrgb&fit=crop&fm=webp&ixlib=rb-4.1.0&q=65&w=640 640w',
            'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?crop=entropy&cs=tinysrgb&fit=crop&fm=webp&ixlib=rb-4.1.0&q=70&w=1024 1024w',
            'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?crop=entropy&cs=tinysrgb&fit=crop&fm=webp&ixlib=rb-4.1.0&q=75&w=1920 1920w',
          ].join(', ')}
          sizes="100vw"
          alt=""
          aria-hidden="true"
          width={1920}
          height={1280}
          fetchPriority="high"
          decoding="async"
          className="w-full h-full object-cover"
          style={{ minHeight: '110%' }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, rgba(26, 62, 92, 0.82) 0%, rgba(26, 62, 92, 0.55) 40%, rgba(26, 62, 92, 0.88) 100%)',
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
              maxWidth: '56rem',
              paddingLeft: designSystem.spacing[4],
              paddingRight: designSystem.spacing[4],
              paddingTop: designSystem.spacing[8],
              paddingBottom: designSystem.spacing[8],
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
                Disponivel Agora
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
              Campanhã, Porto
            </motion.p>

            {/* Specs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap justify-center items-center"
              style={{
                gap: designSystem.spacing[4],
                marginBottom: designSystem.spacing[10],
              }}
            >
              {['T1 a T3 Duplex', '106-118 m²', 'Entrega Abril 2026'].map((spec, i) => (
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

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="flex flex-col sm:flex-row justify-center items-center w-full"
              style={{
                gap: designSystem.spacing[4],
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
                  aria-label="Ver todos os imoveis disponiveis"
                  style={{
                    gap: designSystem.spacing[3],
                    paddingLeft: designSystem.spacing[10],
                    paddingRight: designSystem.spacing[10],
                    paddingTop: designSystem.spacing[5],
                    paddingBottom: designSystem.spacing[5],
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: designSystem.colors.neutral.white,
                    fontWeight: designSystem.typography.fontWeight.semibold,
                    fontSize: designSystem.typography.fontSize['17'],
                    minWidth: '220px',
                    cursor: 'pointer',
                    display: 'inline-flex',
                  }}
                >
                  Todos os Imoveis
                </motion.span>
              </Link>
            </motion.div>
          </div>
        </Container>
      </div>
    </section>
  );
}
