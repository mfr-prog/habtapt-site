'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { MessageCircle, X } from './icons';
import { designSystem } from './design-system';

const BRAND_PRIMARY = designSystem.colors.brand.primary;
const BRAND_GRADIENT = designSystem.colors.gradients.primary;

export function WhatsAppButton() {
  const [isVisible, setIsVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showPulse, setShowPulse] = useState(true);

  const whatsappNumber = '351963290394';
  const message = 'Olá! Gostaria de saber mais sobre investimentos imobiliários com a HABTA.';

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
        setIsOpen(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isVisible || !showPulse) return;
    const timer = setTimeout(() => setShowPulse(false), 4500);
    return () => clearTimeout(timer);
  }, [isVisible, showPulse]);

  // Hide the native Atendeaqui button
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = '#atd-widget-btn { display: none !important; }';
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  const handleChat = useCallback(() => {
    setIsOpen(false);
    // Try to open Atendeaqui widget
    const btn = document.getElementById('atd-widget-btn') as HTMLButtonElement | null;
    if (btn) {
      btn.style.display = '';
      btn.click();
      setTimeout(() => { btn.style.display = 'none'; }, 100);
    }
  }, []);

  const handleWhatsApp = useCallback(() => {
    setIsOpen(false);
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
  }, []);

  return (
    <div
      className={`fixed ${isVisible ? 'float-btn-enter' : 'float-btn-hidden'}`}
      style={{
        bottom: designSystem.spacing[6],
        right: designSystem.spacing[6],
        zIndex: designSystem.zIndex.notification,
      }}
    >
      <div className="relative">
        {/* Options Menu */}
        <div
          style={{
            position: 'absolute',
            bottom: `calc(${designSystem.spacing[16]} + ${designSystem.spacing[3]})`,
            right: 0,
            width: '260px',
            borderRadius: designSystem.borderRadius['2xl'],
            background: designSystem.colors.neutral.white,
            boxShadow: '0 8px 32px rgba(26, 62, 92, 0.18)',
            border: '1px solid rgba(26, 62, 92, 0.08)',
            opacity: isOpen ? 1 : 0,
            transform: isOpen ? 'translateY(0) scale(1)' : 'translateY(10px) scale(0.9)',
            transition: 'opacity 0.2s, transform 0.2s',
            pointerEvents: isOpen ? 'auto' : 'none',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: `${designSystem.spacing[4]} ${designSystem.spacing[5]}`,
              background: BRAND_GRADIENT,
            }}
          >
            <p
              style={{
                fontSize: designSystem.typography.fontSize['15.2'],
                fontWeight: 700,
                color: designSystem.colors.neutral.white,
                margin: 0,
              }}
            >
              Como prefere falar connosco?
            </p>
          </div>

          {/* Chat option */}
          <button
            onClick={handleChat}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: designSystem.spacing[3],
              width: '100%',
              padding: `${designSystem.spacing[4]} ${designSystem.spacing[5]}`,
              background: 'none',
              border: 'none',
              borderBottom: `1px solid ${designSystem.colors.neutral[100]}`,
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'background 0.15s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = designSystem.colors.neutral[50]; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${BRAND_PRIMARY} 0%, #2a5a7e 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <MessageCircle size={20} style={{ color: '#fff' }} />
            </div>
            <div>
              <p style={{ fontSize: '0.9375rem', fontWeight: 600, color: designSystem.colors.neutral[900], margin: 0 }}>
                Chat online
              </p>
              <p style={{ fontSize: '0.8125rem', color: designSystem.colors.neutral[500], margin: 0 }}>
                Resposta imediata, 24h
              </p>
            </div>
          </button>

          {/* WhatsApp option */}
          <button
            onClick={handleWhatsApp}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: designSystem.spacing[3],
              width: '100%',
              padding: `${designSystem.spacing[4]} ${designSystem.spacing[5]}`,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'background 0.15s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = designSystem.colors.neutral[50]; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${designSystem.colors.external.whatsappPrimary} 0%, ${designSystem.colors.external.whatsappDark} 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="#fff">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </div>
            <div>
              <p style={{ fontSize: '0.9375rem', fontWeight: 600, color: designSystem.colors.neutral[900], margin: 0 }}>
                WhatsApp
              </p>
              <p style={{ fontSize: '0.8125rem', color: designSystem.colors.neutral[500], margin: 0 }}>
                Fale com a equipa HABTA
              </p>
            </div>
          </button>
        </div>

        {/* Main Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative group flex items-center justify-center rounded-full transition-transform duration-200 hover:scale-110 active:scale-90"
          style={{
            width: designSystem.spacing[16],
            height: designSystem.spacing[16],
            background: BRAND_GRADIENT,
            boxShadow: `0 8px 32px rgba(26, 62, 92, 0.35), 0 4px 16px rgba(0,0,0,0.1)`,
          }}
          aria-label={isOpen ? 'Fechar menu de contacto' : 'Falar connosco'}
        >
          {showPulse && !isOpen && (
            <div
              className="absolute inset-0 rounded-full anim-pulse-ring"
              style={{ background: BRAND_PRIMARY }}
            />
          )}
          <div
            style={{
              transition: 'transform 0.2s',
              transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
            }}
          >
            {isOpen ? (
              <X size={28} className="text-white relative z-10" />
            ) : (
              <MessageCircle size={28} className="text-white relative z-10" />
            )}
          </div>
          {!isOpen && (
            <div
              className="absolute rounded-full anim-dot-pulse"
              style={{
                top: designSystem.spacing[1],
                right: designSystem.spacing[1],
                width: designSystem.spacing[3],
                height: designSystem.spacing[3],
                border: `2px solid ${designSystem.colors.neutral.white}`,
                background: designSystem.colors.external.notificationRed,
              }}
            />
          )}
        </button>
      </div>
    </div>
  );
}
