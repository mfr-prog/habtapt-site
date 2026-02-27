'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, MessageCircle } from './icons';
import { Container } from './Container';
import { Logo } from './Logo';
import { designSystem } from './design-system';

const navItems = [
  { label: 'Início', href: '/' },
  { label: 'Imóveis', href: '/imoveis' },
  { label: 'VELASK', href: '/velask' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Insights', href: '/blog' },
  { label: 'Contacto', href: '/contacto' },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isHome = pathname === '/';

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const showSolid = isScrolled || !isHome;

  return (
    <header
      className="fixed top-0 left-0 right-0 transition-all duration-500 anim-slide-down"
      style={{
        zIndex: designSystem.zIndex.fixed,
        background: showSolid
          ? designSystem.helpers.hexToRgba(designSystem.colors.neutral.white, 0.85)
          : 'transparent',
        backdropFilter: showSolid ? 'blur(16px)' : 'none',
        WebkitBackdropFilter: showSolid ? 'blur(16px)' : 'none',
        boxShadow: showSolid ? designSystem.shadows.lg : 'none',
        borderBottom: showSolid
          ? `1px solid ${designSystem.helpers.hexToRgba(designSystem.colors.brand.primary, 0.1)}`
          : 'none',
      }}
    >
      <Container>
        <div
          className="flex items-center justify-between"
          style={{ height: '72px' }}
        >
          <Link
            href="/"
            className="flex items-center gap-3"
            aria-label="Ir para pagina inicial"
            style={{ textDecoration: 'none' }}
          >
            <div className="flex items-center gap-3 transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]">
              <Logo variant={showSolid ? 'black' : 'white'} size={40} />
              <span
                className="hidden sm:inline"
                style={{
                  color: showSolid ? designSystem.colors.brand.primary : designSystem.colors.neutral.white,
                  fontWeight: designSystem.typography.fontWeight.black,
                  letterSpacing: designSystem.typography.letterSpacing.tight,
                  fontSize: designSystem.typography.fontSize['2xl'],
                  transition: designSystem.animations.transition.base,
                }}
              >
                HABTA
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Navegacao principal">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-label={`Navegar para ${item.label}`}
                  aria-current={isActive ? 'page' : undefined}
                  style={{ textDecoration: 'none' }}
                >
                  <span
                    className="relative group block transition-all duration-200 hover:-translate-y-0.5"
                    style={{
                      padding: `${designSystem.spacing[3]} ${designSystem.spacing[4]}`,
                      color: isActive
                        ? (showSolid ? designSystem.colors.brand.primary : designSystem.colors.neutral.white)
                        : (showSolid
                            ? designSystem.colors.neutral[700]
                            : designSystem.helpers.hexToRgba(designSystem.colors.neutral.white, 0.9)),
                      fontSize: designSystem.typography.fontSize['15'],
                      fontWeight: isActive ? designSystem.typography.fontWeight.semibold : designSystem.typography.fontWeight.medium,
                      cursor: 'pointer',
                    }}
                  >
                    {item.label}
                    <span
                      className="absolute bottom-0 left-0 right-0 transition-transform duration-300 origin-left group-hover:scale-x-100"
                      style={{
                        height: '2px',
                        background: showSolid
                          ? designSystem.colors.gradients.primary
                          : designSystem.colors.brand.secondaryLight,
                        borderRadius: designSystem.borderRadius.full,
                        transform: isActive ? 'scaleX(1)' : 'scaleX(0)',
                      }}
                    />
                  </span>
                </Link>
              );
            })}
            <a
              href="https://wa.me/351963290394?text=Ol%C3%A1!%20Gostaria%20de%20saber%20mais%20sobre%20investimentos%20imobili%C3%A1rios%20com%20a%20HABTA."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center transition-transform duration-200 hover:scale-105 active:scale-95"
              title="Conversar via WhatsApp"
              style={{
                marginLeft: designSystem.spacing[4],
                paddingTop: designSystem.spacing[4],
                paddingBottom: designSystem.spacing[4],
                paddingLeft: designSystem.spacing[8],
                paddingRight: designSystem.spacing[8],
                borderRadius: designSystem.borderRadius.full,
                background: showSolid
                  ? designSystem.colors.gradients.primary
                  : 'rgba(255, 255, 255, 0.95)',
                color: showSolid
                  ? designSystem.colors.neutral.white
                  : designSystem.colors.brand.primary,
                boxShadow: showSolid
                  ? designSystem.shadows.md
                  : '0 4px 16px rgba(255, 255, 255, 0.3)',
                fontSize: designSystem.typography.fontSize['15'],
                fontWeight: designSystem.typography.fontWeight.bold,
                lineHeight: '1',
                gap: designSystem.spacing[2],
                textDecoration: 'none',
              }}
            >
              <MessageCircle size={18} />
              WhatsApp
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden active:scale-90 transition-transform"
            aria-label={isMobileMenuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            style={{
              padding: designSystem.spacing[2],
              borderRadius: designSystem.borderRadius.md,
              background: showSolid
                ? designSystem.helpers.hexToRgba(designSystem.colors.brand.primary, 0.1)
                : designSystem.helpers.hexToRgba(designSystem.colors.neutral.white, 0.15),
              border: 'none',
              cursor: 'pointer',
            }}
          >
            {isMobileMenuOpen ? (
              <X size={24} style={{ color: showSolid ? designSystem.colors.brand.primary : designSystem.colors.neutral.white }} />
            ) : (
              <Menu size={24} style={{ color: showSolid ? designSystem.colors.brand.primary : designSystem.colors.neutral.white }} />
            )}
          </button>
        </div>
      </Container>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden anim-fade-in"
          id="mobile-menu"
          style={{
            background: designSystem.helpers.hexToRgba(designSystem.colors.neutral.white, 0.95),
            backdropFilter: 'blur(16px)',
            borderTop: `1px solid ${designSystem.helpers.hexToRgba(designSystem.colors.brand.primary, 0.1)}`,
            boxShadow: designSystem.shadows.xl,
            maxHeight: 'calc(100vh - 72px)',
            overflow: 'hidden',
          }}
        >
          <Container>
            <nav className="flex flex-col gap-1" style={{ paddingTop: designSystem.spacing[4], paddingBottom: designSystem.spacing[4] }}>
              {navItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                return (
                  <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
                    <span
                      className="block active:scale-[0.98] transition-transform"
                      style={{
                        padding: `${designSystem.spacing[3]} ${designSystem.spacing[4]}`,
                        minHeight: '48px',
                        display: 'flex',
                        alignItems: 'center',
                        color: isActive ? designSystem.colors.brand.primary : designSystem.colors.neutral[700],
                        fontSize: designSystem.typography.fontSize.base,
                        fontWeight: isActive ? designSystem.typography.fontWeight.semibold : designSystem.typography.fontWeight.medium,
                        borderRadius: designSystem.borderRadius.md,
                        background: isActive ? designSystem.helpers.hexToRgba(designSystem.colors.brand.primary, 0.12) : 'transparent',
                        borderLeft: isActive ? `3px solid ${designSystem.colors.brand.primary}` : '3px solid transparent',
                      }}
                    >
                      {item.label}
                    </span>
                  </Link>
                );
              })}
              <div style={{ marginTop: designSystem.spacing[3], marginBottom: designSystem.spacing[3], height: '1px', background: `linear-gradient(to right, transparent, ${designSystem.colors.neutral[200]}, transparent)` }} />
              <a
                href="https://wa.me/351963290394?text=Ol%C3%A1!%20Gostaria%20de%20saber%20mais%20sobre%20investimentos%20imobili%C3%A1rios%20com%20a%20HABTA."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center"
                style={{
                  padding: `${designSystem.spacing[4]} ${designSystem.spacing[6]}`,
                  borderRadius: designSystem.borderRadius.full,
                  background: designSystem.colors.gradients.primary,
                  color: designSystem.colors.neutral.white,
                  fontSize: designSystem.typography.fontSize.base,
                  fontWeight: designSystem.typography.fontWeight.semibold,
                  boxShadow: designSystem.shadows.md,
                  width: '100%',
                  gap: designSystem.spacing[2],
                  textDecoration: 'none',
                }}
              >
                <MessageCircle size={20} />
                <span>WhatsApp</span>
              </a>
            </nav>
          </Container>
        </div>
      )}
    </header>
  );
}
