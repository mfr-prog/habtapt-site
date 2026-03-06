'use client';

import React, { useState, useEffect } from 'react';
import { MessageSquare } from './icons';
import { designSystem } from './design-system';

// WhatsApp brand colors (standard, não customizáveis) - vindo do design system
const WHATSAPP_PRIMARY = designSystem.colors.external.whatsappPrimary;
const WHATSAPP_GRADIENT = `linear-gradient(135deg, ${designSystem.colors.external.whatsappPrimary} 0%, ${designSystem.colors.external.whatsappDark} 100%)`;
const NOTIFICATION_RED = designSystem.colors.external.notificationRed;

export function WhatsAppButton() {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showPulse, setShowPulse] = useState(true);

  const whatsappNumber = '351963290394';
  const message = 'Olá! Gostaria de saber mais sobre investimentos imobiliários com a HABTA.';

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
        setIsExpanded(false);
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

  const handleClick = () => {
    if (!isExpanded) {
      setIsExpanded(true);
      return;
    }
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

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
        {/* Expanded Tooltip */}
        <div
          className="absolute"
          style={{
            bottom: 0,
            right: '100%',
            marginRight: designSystem.spacing[4],
            paddingLeft: designSystem.spacing[4],
            paddingRight: designSystem.spacing[4],
            paddingTop: designSystem.spacing[3],
            paddingBottom: designSystem.spacing[3],
            borderRadius: designSystem.borderRadius['2xl'],
            background: designSystem.colors.neutral.white,
            boxShadow: '0 8px 24px rgba(26, 62, 92, 0.15)',
            border: '1px solid rgba(26, 62, 92, 0.1)',
            width: '280px',
            opacity: isExpanded ? 1 : 0,
            transform: isExpanded ? 'translateX(0) scale(1)' : 'translateX(20px) scale(0.8)',
            transition: 'opacity 0.2s, transform 0.2s',
            pointerEvents: isExpanded ? 'auto' : 'none',
          }}
        >
          <p
            style={{
              fontSize: designSystem.typography.fontSize['15.2'],
              fontWeight: 600,
              color: designSystem.colors.brand.primary,
              marginBottom: designSystem.spacing[2],
            }}
          >
            Fale conosco no WhatsApp
          </p>
          <p
            style={{
              fontSize: designSystem.typography.fontSize['12.8'],
              color: designSystem.colors.neutral[600],
              marginBottom: designSystem.spacing[2],
              lineHeight: '1.4',
            }}
          >
            Clique para abrir o WhatsApp e conversar diretamente com a nossa equipa.
          </p>
          <div
            style={{
              paddingTop: designSystem.spacing[2],
              borderTop: `1px solid ${designSystem.colors.neutral[200]}`,
              fontSize: designSystem.typography.fontSize['11.7'],
              color: designSystem.colors.neutral[500],
              lineHeight: '1.3',
            }}
          >
            Prefere email? <span style={{ fontWeight: 600 }}>contato@habta.eu</span>
          </div>
        </div>

        {/* Main Button */}
        <button
          onMouseEnter={() => setIsExpanded(true)}
          onMouseLeave={() => setIsExpanded(false)}
          onClick={handleClick}
          className="relative group flex items-center justify-center rounded-full transition-transform duration-200 hover:scale-110 active:scale-90"
          style={{
            width: designSystem.spacing[16],
            height: designSystem.spacing[16],
            background: WHATSAPP_GRADIENT,
            boxShadow: '0 8px 32px rgba(37, 211, 102, 0.4), 0 4px 16px rgba(0,0,0,0.1)',
          }}
          aria-label="Falar conosco pelo WhatsApp"
        >
          {showPulse && (
            <div
              className="absolute inset-0 rounded-full anim-pulse-ring"
              style={{
                background: WHATSAPP_PRIMARY,
              }}
            />
          )}

          {/* Icon */}
          <MessageSquare size={30} className="text-white relative z-10" />

          {/* Notification Dot */}
          <div
            className="absolute rounded-full anim-dot-pulse"
            style={{
              top: designSystem.spacing[1],
              right: designSystem.spacing[1],
              width: designSystem.spacing[3],
              height: designSystem.spacing[3],
              border: `2px solid ${designSystem.colors.neutral.white}`,
              background: NOTIFICATION_RED,
            }}
          />
        </button>
      </div>
    </div>
  );
}
