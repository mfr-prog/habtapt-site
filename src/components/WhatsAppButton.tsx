'use client';

import React, { useState, useEffect } from 'react';
import { MessageSquare, X } from './icons';
import { motion, AnimatePresence } from 'motion/react';
import { designSystem } from './design-system';

// WhatsApp brand colors (standard, não customizáveis) - vindo do design system
const WHATSAPP_PRIMARY = designSystem.colors.external.whatsappPrimary;
const WHATSAPP_GRADIENT = `linear-gradient(135deg, ${designSystem.colors.external.whatsappPrimary} 0%, ${designSystem.colors.external.whatsappDark} 100%)`;
const NOTIFICATION_RED = designSystem.colors.external.notificationRed;

export function WhatsAppButton() {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // WhatsApp number
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

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = () => {
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0, y: 20 }}
          transition={{ 
            duration: 0.4,
            type: 'spring',
            stiffness: 300,
            damping: 20
          }}
          className="fixed"
          style={{
            bottom: designSystem.spacing[6],
            right: designSystem.spacing[6],
            zIndex: designSystem.zIndex.notification
          }}
        >
          <div className="relative">
            {/* Expanded Tooltip */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, x: 20, scale: 0.8 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 20, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
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
                    Clique para abrir o WhatsApp e conversar diretamente com nossa equipe.
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
                </motion.div>
              )}
            </AnimatePresence>

            {/* Main Button */}
            <motion.button
              whileHover={{ scale: 1.15, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              onHoverStart={() => setIsExpanded(true)}
              onHoverEnd={() => setIsExpanded(false)}
              onClick={handleClick}
              className="relative group flex items-center justify-center rounded-full transition-all duration-300"
              style={{
                width: designSystem.spacing[16],
                height: designSystem.spacing[16],
                background: WHATSAPP_GRADIENT,
                boxShadow: '0 8px 32px rgba(37, 211, 102, 0.4), 0 4px 16px rgba(0,0,0,0.1)',
              }}
              aria-label="Falar conosco pelo WhatsApp"
            >
              {/* Pulse Animation */}
              <motion.div
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 0, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute inset-0 rounded-full"
                style={{
                  background: WHATSAPP_PRIMARY,
                }}
              />

              {/* Icon */}
              <MessageSquare size={30} className="text-white relative z-10" />

              {/* Notification Dot */}
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute rounded-full"
                style={{
                  top: designSystem.spacing[1],
                  right: designSystem.spacing[1],
                  width: designSystem.spacing[3],
                  height: designSystem.spacing[3],
                  border: `2px solid ${designSystem.colors.neutral.white}`,
                  background: NOTIFICATION_RED,
                }}
              />
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
