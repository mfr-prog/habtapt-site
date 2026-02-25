'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Calendar } from '@/components/icons';
import { Logo } from '@/components/Logo';
import { c, t, sp, ds } from './velask-styles';

const NAV_LINKS = [
  { label: 'O Projecto', target: 'projecto' },
  { label: 'O Bairro', target: 'bairro' },
  { label: 'Plantas', target: 'plantas' },
  { label: 'Preços', target: 'precos' },
  { label: 'Contacto', target: 'contacto' },
];

export function VelaskNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    const onResize = () => setIsMobile(window.innerWidth < parseInt(ds.breakpoints.lg));
    onScroll();
    onResize();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        transition: 'background 0.3s, backdrop-filter 0.3s, box-shadow 0.3s',
        background: scrolled ? 'rgba(26,62,92,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(8px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(8px)' : 'none',
        boxShadow: scrolled ? '0 1px 0 rgba(255,255,255,0.06)' : 'none',
      }}
    >
      <div
        style={{
          maxWidth: '80rem',
          margin: '0 auto',
          padding: `${sp[3]} ${sp[6]}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Logo */}
        <a
          href="https://habta.eu"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: sp[3],
            fontSize: t.fontSize.xl,
            fontWeight: t.fontWeight.black,
            color: '#fff',
            textDecoration: 'none',
            letterSpacing: t.letterSpacing.wider,
          }}
        >
          <Logo variant="white" size={32} />
          HABTA
        </a>

        {/* Desktop links */}
        {!isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: sp[6] }}>
            {NAV_LINKS.map((link) => (
              <button
                key={link.target}
                onClick={() => scrollTo(link.target)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255,255,255,0.7)',
                  fontSize: t.fontSize.sm,
                  fontWeight: t.fontWeight.medium,
                  cursor: 'pointer',
                  padding: `${sp[2]} 0`,
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => scrollTo('velask-form')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: sp[2],
                padding: `${sp[2]} ${sp[5]}`,
                borderRadius: ds.borderRadius.full,
                background: c.gradients.secondary,
                color: c.brand.primary,
                fontWeight: t.fontWeight.semibold,
                fontSize: t.fontSize.sm,
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <Calendar style={{ width: 16, height: 16 }} /> Agendar Visita
            </button>
          </div>
        )}

        {/* Mobile hamburger */}
        {isMobile && (
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            style={{
              background: 'none',
              border: 'none',
              color: '#fff',
              cursor: 'pointer',
              padding: sp[2],
            }}
          >
            {menuOpen ? <X style={{ width: 24, height: 24 }} /> : <Menu style={{ width: 24, height: 24 }} />}
          </button>
        )}
      </div>

      {/* Mobile overlay menu */}
      <AnimatePresence>
        {menuOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              background: 'rgba(26,62,92,0.95)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              padding: `${sp[6]} ${sp[6]} ${sp[8]}`,
              display: 'flex',
              flexDirection: 'column',
              gap: sp[1],
              borderTop: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            {NAV_LINKS.map((link) => (
              <button
                key={link.target}
                onClick={() => scrollTo(link.target)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255,255,255,0.8)',
                  fontSize: t.fontSize.base,
                  fontWeight: t.fontWeight.medium,
                  cursor: 'pointer',
                  padding: `${sp[3]} 0`,
                  textAlign: 'left',
                }}
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => scrollTo('velask-form')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: sp[2],
                marginTop: sp[3],
                padding: `${sp[3]} ${sp[6]}`,
                borderRadius: ds.borderRadius.full,
                background: c.gradients.secondary,
                color: c.brand.primary,
                fontWeight: t.fontWeight.semibold,
                fontSize: t.fontSize.sm,
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <Calendar style={{ width: 16, height: 16 }} /> Agendar Visita
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
