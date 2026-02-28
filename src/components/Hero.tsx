import React from 'react';
import { Container } from './Container';
import { ArrowRight } from './icons';
import { designSystem } from './design-system';
import { LogoPattern } from './LogoPatterns';
import Link from 'next/link';

export function Hero() {
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
      {/* Background Image — static, no JS needed */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?crop=entropy&cs=tinysrgb&fit=crop&fm=avif&ixlib=rb-4.1.0&q=40&w=1080"
          srcSet={[
            'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?crop=entropy&cs=tinysrgb&fit=crop&fm=avif&ixlib=rb-4.1.0&q=35&w=480 480w',
            'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?crop=entropy&cs=tinysrgb&fit=crop&fm=avif&ixlib=rb-4.1.0&q=40&w=768 768w',
            'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?crop=entropy&cs=tinysrgb&fit=crop&fm=avif&ixlib=rb-4.1.0&q=40&w=1080 1080w',
            'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?crop=entropy&cs=tinysrgb&fit=crop&fm=avif&ixlib=rb-4.1.0&q=45&w=1600 1600w',
          ].join(', ')}
          sizes="100vw"
          alt=""
          aria-hidden="true"
          width={1920}
          height={1280}
          fetchPriority="high"
          className="w-full h-full object-cover"
          style={{ minHeight: '110%' }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, rgba(26, 62, 92, 0.82) 0%, rgba(26, 62, 92, 0.55) 40%, rgba(26, 62, 92, 0.88) 100%)',
          }}
        />
      </div>

      {/* Logo Pattern overlay */}
      <div
        className="absolute inset-0 anim-fade-in"
        style={{ zIndex: 1 }}
      >
        <LogoPattern
          pattern="arrows-tiny"
          opacity={0.06}
          color={designSystem.colors.neutral.white}
        />
      </div>

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
            <div
              className="inline-flex items-center rounded-full anim-fade-in-up anim-delay-1"
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
            </div>

            {/* Title */}
            <h1
              id="hero-title"
              className="text-center w-full anim-fade-in-up anim-delay-2"
              style={{
                fontSize: 'clamp(2.5rem, 7vw, 4.5rem)',
                lineHeight: 1.1,
                fontWeight: designSystem.typography.fontWeight.black,
                letterSpacing: designSystem.typography.letterSpacing.tight,
                color: designSystem.colors.neutral.white,
                marginBottom: designSystem.spacing[4],
              }}
            >
              <span
                className="anim-fade-in anim-delay-4"
                style={{
                  background: designSystem.colors.gradients.accentReverse,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  display: 'inline-block',
                }}
              >
                VELASK
              </span>
              {' '}Residence
            </h1>

            {/* Location */}
            <p
              className="text-center anim-fade-in-up anim-delay-3"
              style={{
                fontSize: designSystem.typography.fontSize.xl,
                color: 'rgba(255, 255, 255, 0.85)',
                fontWeight: designSystem.typography.fontWeight.medium,
                marginBottom: designSystem.spacing[6],
              }}
            >
              Campanhã, Porto
            </p>

            {/* Specs */}
            <div
              className="flex flex-wrap justify-center items-center anim-fade-in-up anim-delay-4"
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
                      color: 'rgba(255, 255, 255, 0.9)',
                      fontWeight: designSystem.typography.fontWeight.medium,
                    }}
                  >
                    {spec}
                  </span>
                </React.Fragment>
              ))}
            </div>

            {/* CTA Buttons */}
            <div
              className="flex flex-col sm:flex-row justify-center items-center w-full anim-fade-in-up anim-delay-5"
              style={{
                gap: designSystem.spacing[4],
              }}
            >
              <Link href="/velask" style={{ textDecoration: 'none', width: 'auto' }} className="w-full sm:w-auto">
                <span
                  className="group inline-flex items-center justify-center rounded-full w-full sm:w-auto hover-lift"
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
                </span>
              </Link>

              <Link href="/imoveis" style={{ textDecoration: 'none', width: 'auto' }} className="w-full sm:w-auto">
                <span
                  className="inline-flex items-center justify-center rounded-full backdrop-blur-md w-full sm:w-auto hover-lift"
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
                </span>
              </Link>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
