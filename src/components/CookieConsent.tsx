'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { designSystem } from './design-system';

const COOKIE_KEY = 'habta_cookie_consent';

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem(COOKIE_KEY);
      if (!consent) {
        // Small delay so it doesn't flash on load
        const timer = setTimeout(() => setVisible(true), 1500);
        return () => clearTimeout(timer);
      }
    } catch {
      // localStorage unavailable
    }
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem(COOKIE_KEY, JSON.stringify({ accepted: true, date: new Date().toISOString() }));
    } catch {}
    setVisible(false);
  };

  const handleReject = () => {
    try {
      localStorage.setItem(COOKIE_KEY, JSON.stringify({ accepted: false, date: new Date().toISOString() }));
    } catch {}
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 9998,
            padding: designSystem.spacing[4],
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              maxWidth: '48rem',
              margin: '0 auto',
              background: designSystem.colors.neutral.white,
              border: `1px solid ${designSystem.helpers.hexToRgba(designSystem.colors.brand.primary, 0.15)}`,
              borderRadius: designSystem.borderRadius['2xl'],
              boxShadow: '0 -4px 30px rgba(0,0,0,0.12)',
              padding: `${designSystem.spacing[5]} ${designSystem.spacing[6]}`,
              display: 'flex',
              flexDirection: 'column',
              gap: designSystem.spacing[4],
              pointerEvents: 'auto',
            }}
          >
            <div>
              <p
                style={{
                  fontSize: designSystem.typography.fontSize.sm,
                  color: designSystem.colors.neutral.gray700,
                  lineHeight: designSystem.typography.lineHeight.relaxed,
                  margin: 0,
                }}
              >
                Utilizamos cookies essenciais para o funcionamento do site.
                Ao continuar a navegar, concorda com a nossa{' '}
                <Link
                  href="/cookies"
                  style={{
                    color: designSystem.colors.brand.primary,
                    textDecoration: 'underline',
                    fontWeight: designSystem.typography.fontWeight.semibold,
                  }}
                >
                  Politica de Cookies
                </Link>{' '}
                e{' '}
                <Link
                  href="/privacidade"
                  style={{
                    color: designSystem.colors.brand.primary,
                    textDecoration: 'underline',
                    fontWeight: designSystem.typography.fontWeight.semibold,
                  }}
                >
                  Politica de Privacidade
                </Link>.
              </p>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: designSystem.spacing[3],
                justifyContent: 'flex-end',
                flexWrap: 'wrap',
              }}
            >
              <button
                onClick={handleReject}
                style={{
                  padding: `${designSystem.spacing[2]} ${designSystem.spacing[4]}`,
                  border: `1px solid ${designSystem.colors.neutral.gray300}`,
                  background: designSystem.colors.neutral.white,
                  color: designSystem.colors.neutral.gray700,
                  borderRadius: designSystem.borderRadius.lg,
                  fontSize: designSystem.typography.fontSize.sm,
                  fontWeight: designSystem.typography.fontWeight.medium,
                  cursor: 'pointer',
                }}
              >
                Rejeitar
              </button>
              <button
                onClick={handleAccept}
                style={{
                  padding: `${designSystem.spacing[2]} ${designSystem.spacing[5]}`,
                  border: 'none',
                  background: designSystem.colors.brand.primary,
                  color: designSystem.colors.neutral.white,
                  borderRadius: designSystem.borderRadius.lg,
                  fontSize: designSystem.typography.fontSize.sm,
                  fontWeight: designSystem.typography.fontWeight.bold,
                  cursor: 'pointer',
                }}
              >
                Aceitar
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
