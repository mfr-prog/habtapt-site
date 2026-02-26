'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, MessageCircle } from './icons';
import { Container } from './Container';
import { Logo } from './Logo';
import { motion, AnimatePresence } from 'motion/react';
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
    const checkScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
      setIsScrolled(scrollY > 20);
    };

    requestAnimationFrame(checkScroll);
    const timer = setTimeout(checkScroll, 100);
    return () => clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
          setIsScrolled(scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };

    handleScroll();

    const scrollEvents = ['scroll', 'touchmove', 'wheel'];
    scrollEvents.forEach(event => {
      window.addEventListener(event, handleScroll, { passive: true });
    });
    document.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      scrollEvents.forEach(event => {
        window.removeEventListener(event, handleScroll);
      });
      document.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const showSolid = isScrolled || !isHome;

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 transition-all duration-500"
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
            style={{
              textDecoration: 'none',
            }}
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-3"
            >
              <Logo
                variant={showSolid ? 'black' : 'white'}
                size={40}
              />
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
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Navegacao principal">
            {navItems.map((item, index) => {
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-label={`Navegar para ${item.label}`}
                  aria-current={isActive ? 'page' : undefined}
                  style={{ textDecoration: 'none' }}
                >
                  <motion.span
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 + index * 0.05 }}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative group block"
                    style={{
                      padding: `${designSystem.spacing[3]} ${designSystem.spacing[4]}`,
                      color: isActive
                        ? (showSolid ? designSystem.colors.brand.primary : designSystem.colors.neutral.white)
                        : (showSolid
                            ? designSystem.colors.neutral[700]
                            : designSystem.helpers.hexToRgba(designSystem.colors.neutral.white, 0.9)),
                      fontSize: designSystem.typography.fontSize['15'],
                      fontWeight: isActive ? designSystem.typography.fontWeight.semibold : designSystem.typography.fontWeight.medium,
                      transition: designSystem.animations.transition.base,
                      cursor: 'pointer',
                    }}
                  >
                    {item.label}
                    <motion.span
                      className="absolute bottom-0 left-0 right-0"
                      style={{
                        height: '2px',
                        background: showSolid
                          ? designSystem.colors.gradients.primary
                          : designSystem.colors.brand.secondaryLight,
                        borderRadius: designSystem.borderRadius.full,
                      }}
                      initial={{ scaleX: isActive ? 1 : 0 }}
                      animate={{ scaleX: isActive ? 1 : 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.span>
                </Link>
              );
            })}
            <motion.a
              href="https://wa.me/351963290394?text=Ol%C3%A1!%20Gostaria%20de%20saber%20mais%20sobre%20investimentos%20imobili%C3%A1rios%20com%20a%20HABTA."
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center justify-center"
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
                transition: designSystem.animations.transition.base,
                cursor: 'pointer',
                border: 'none',
                outline: 'none',
                lineHeight: '1',
                gap: designSystem.spacing[2],
                textDecoration: 'none',
              }}
            >
              <MessageCircle size={18} />
              WhatsApp
            </motion.a>
          </nav>

          {/* Mobile Menu Button */}
          <motion.button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            whileTap={{ scale: 0.9 }}
            className="lg:hidden"
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
              outline: 'none',
              cursor: 'pointer',
              transition: designSystem.animations.transition.base,
            }}
          >
            <AnimatePresence mode="wait">
              {isMobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X
                    size={24}
                    style={{
                      color: showSolid
                        ? designSystem.colors.brand.primary
                        : designSystem.colors.neutral.white,
                    }}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu
                    size={24}
                    style={{
                      color: showSolid
                        ? designSystem.colors.brand.primary
                        : designSystem.colors.neutral.white,
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </Container>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden"
            id="mobile-menu"
            style={{
              background: designSystem.helpers.hexToRgba(designSystem.colors.neutral.white, 0.95),
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              borderTop: `1px solid ${designSystem.helpers.hexToRgba(designSystem.colors.brand.primary, 0.1)}`,
              boxShadow: designSystem.shadows.xl,
              maxHeight: 'calc(100vh - 72px)',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <Container>
              <nav
                className="flex flex-col gap-1"
                style={{
                  paddingTop: designSystem.spacing[4],
                  paddingBottom: designSystem.spacing[4],
                  maxHeight: 'calc(100vh - 120px)',
                  overflowY: 'auto',
                  overflowX: 'hidden',
                }}
              >
                {navItems.map((item, index) => {
                  const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      style={{ textDecoration: 'none' }}
                    >
                      <motion.span
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        whileTap={{ scale: 0.98 }}
                        className="block"
                        style={{
                          padding: `${designSystem.spacing[3]} ${designSystem.spacing[4]}`,
                          color: isActive ? designSystem.colors.brand.primary : designSystem.colors.neutral[700],
                          fontSize: designSystem.typography.fontSize.base,
                          fontWeight: isActive ? designSystem.typography.fontWeight.semibold : designSystem.typography.fontWeight.medium,
                          borderRadius: designSystem.borderRadius.md,
                          transition: designSystem.animations.transition.base,
                          cursor: 'pointer',
                          background: isActive
                            ? designSystem.helpers.hexToRgba(designSystem.colors.brand.primary, 0.12)
                            : 'transparent',
                          width: '100%',
                          textAlign: 'left',
                          borderLeft: isActive
                            ? `3px solid ${designSystem.colors.brand.primary}`
                            : '3px solid transparent',
                        }}
                      >
                        {item.label}
                      </motion.span>
                    </Link>
                  );
                })}
                {/* Divider */}
                <div
                  style={{
                    marginTop: designSystem.spacing[3],
                    marginBottom: designSystem.spacing[3],
                    height: '1px',
                    background: `linear-gradient(to right, transparent, ${designSystem.colors.neutral[200]}, transparent)`,
                  }}
                />

                <motion.a
                  href="https://wa.me/351963290394?text=Ol%C3%A1!%20Gostaria%20de%20saber%20mais%20sobre%20investimentos%20imobili%C3%A1rios%20com%20a%20HABTA."
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3, delay: navItems.length * 0.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center justify-center"
                  title="Conversar via WhatsApp"
                  style={{
                    padding: `${designSystem.spacing[4]} ${designSystem.spacing[6]}`,
                    borderRadius: designSystem.borderRadius.full,
                    background: designSystem.colors.gradients.primary,
                    color: designSystem.colors.neutral.white,
                    fontSize: designSystem.typography.fontSize.base,
                    fontWeight: designSystem.typography.fontWeight.semibold,
                    transition: designSystem.animations.transition.base,
                    cursor: 'pointer',
                    boxShadow: designSystem.shadows.md,
                    border: 'none',
                    width: '100%',
                    gap: designSystem.spacing[2],
                    textDecoration: 'none',
                  }}
                >
                  <MessageCircle size={20} />
                  <span>WhatsApp</span>
                </motion.a>
              </nav>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
