'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Send, CheckCircle } from './icons';
import { designSystem } from './design-system';
import { toast } from 'sonner';
import { supabaseFetch } from '../utils/supabase/client';

interface NewsletterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NewsletterModal({ isOpen, onClose }: NewsletterModalProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Reset quando abre/fecha
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setEmail('');
        setIsSuccess(false);
      }, 300);
    }
  }, [isOpen]);

  // Fechar com ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      toast.error('Por favor, insira um email válido.');
      return;
    }
    
    setIsSubmitting(true);

    try {
      // Send to Supabase backend
      const response = await supabaseFetch('newsletter', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Newsletter subscription error (modal):', data);
        toast.error(data.error || 'Erro ao processar subscrição. Tente novamente.');
        setIsSubmitting(false);
        return;
      }

      setIsSuccess(true);
      toast.success(data.message || 'Subscrição confirmada! Verifique seu email.');
      
      // Fechar modal após 2 segundos
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Newsletter subscription network error (modal):', error);
      toast.error('Erro de conexão. Verifique sua internet e tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(26, 62, 92, 0.8)',
              backdropFilter: 'blur(8px)',
              zIndex: 9998,
            }}
          />

          {/* Modal */}
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
              padding: designSystem.spacing[4],
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: '500px',
                position: 'relative',
                paddingTop: designSystem.spacing[8], // Space for icon
              }}
            >
              {/* Icon - Outside to prevent clipping */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: designSystem.colors.neutral.white,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: designSystem.shadows.lg,
                  zIndex: 10,
                }}
              >
                <Mail size={28} style={{ color: designSystem.colors.brand.primary }} />
              </div>

              {/* Modal Content Wrapper */}
              <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="newsletter-modal-title"
                style={{
                  background: designSystem.colors.neutral.white,
                  borderRadius: designSystem.borderRadius['2xl'],
                  boxShadow: '0 24px 48px rgba(0, 0, 0, 0.2)',
                  overflow: 'hidden',
                }}
              >
                {/* Close Button */}
                <button
                  onClick={onClose}
                  aria-label="Fechar modal de newsletter"
                  type="button"
                  style={{
                    position: 'absolute',
                    top: `calc(${designSystem.spacing[8]} + ${designSystem.spacing[4]})`,
                    right: designSystem.spacing[4],
                    width: designSystem.sizes?.icon?.md || '2.25rem',
                    height: designSystem.sizes?.icon?.md || '2.25rem',
                    borderRadius: '50%',
                    background: designSystem.colors.neutral[100],
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: designSystem.animations.transition.base,
                    zIndex: 10,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = designSystem.colors.neutral[200];
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = designSystem.colors.neutral[100];
                  }}
                >
                  <X size={20} style={{ color: designSystem.colors.neutral[700] }} />
                </button>

                {/* Decorative Header Background */}
                <div
                  style={{
                    height: '90px',
                    background: designSystem.colors.gradients.primary,
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {/* Decorative Circles */}
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.2, 0.3, 0.2],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    style={{
                      position: 'absolute',
                      top: '-20px',
                      right: '-20px',
                      width: '100px',
                      height: '100px',
                      borderRadius: '50%',
                      background: designSystem.colors.neutral.white,
                    }}
                  />
                  <motion.div
                    animate={{
                      scale: [1.2, 1, 1.2],
                      opacity: [0.15, 0.25, 0.15],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: 1,
                    }}
                    style={{
                      position: 'absolute',
                      bottom: '-30px',
                      left: '-30px',
                      width: '120px',
                      height: '120px',
                      borderRadius: '50%',
                      background: designSystem.colors.neutral.white,
                    }}
                  />
                </div>

                {/* Content */}
                <div style={{ padding: `${designSystem.spacing[8]} ${designSystem.spacing[6]} ${designSystem.spacing[6]}` }}>
                {!isSuccess ? (
                  <>
                    {/* Title */}
                    <h2
                      id="newsletter-modal-title"
                      style={{
                        fontSize: designSystem.typography.fontSize['3xl'],
                        fontWeight: designSystem.typography.fontWeight.black,
                        color: designSystem.colors.brand.primary,
                        textAlign: 'center',
                        marginBottom: designSystem.spacing[2],
                      }}
                    >
                      Newsletter HABTA
                    </h2>

                    {/* Description */}
                    <p
                      style={{
                        fontSize: designSystem.typography.fontSize.base,
                        color: designSystem.colors.neutral[600],
                        textAlign: 'center',
                        lineHeight: designSystem.typography.lineHeight.relaxed,
                        marginBottom: designSystem.spacing[6],
                      }}
                    >
                      Receba insights exclusivos sobre investimento imobiliário, tendências de mercado e oportunidades premium diretamente no seu email.
                    </p>

                    {/* Benefits */}
                    <div
                      style={{
                        marginBottom: designSystem.spacing[6],
                        padding: designSystem.spacing[4],
                        background: designSystem.colors.neutral[50],
                        borderRadius: designSystem.borderRadius.lg,
                      }}
                    >
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {[
                          'Análises de mercado semanais',
                          'Oportunidades de investimento exclusivas',
                          'Dicas de reabilitação urbana',
                          'Novidades e projetos HABTA',
                        ].map((benefit, index) => (
                          <li
                            key={index}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: designSystem.spacing[2],
                              marginBottom: index < 3 ? designSystem.spacing[2] : 0,
                            }}
                          >
                            <CheckCircle size={18} style={{ color: designSystem.colors.brand.primary, flexShrink: 0 }} />
                            <span style={{ 
                              fontSize: designSystem.typography.fontSize['15'], 
                              color: designSystem.colors.neutral[700],
                            }}>
                              {benefit}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit}>
                      <div style={{ marginBottom: designSystem.spacing[4] }}>
                        <input
                          type="email"
                          name="modal-newsletter-email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Digite seu melhor email"
                          disabled={isSubmitting}
                          autoFocus
                          aria-required="true"
                          aria-label="Email para newsletter"
                          style={{
                            width: '100%',
                            padding: `${designSystem.spacing[3]} ${designSystem.spacing[4]}`,
                            borderRadius: designSystem.borderRadius.lg,
                            border: `2px solid ${designSystem.colors.neutral[200]}`,
                            background: designSystem.colors.neutral.white,
                            color: designSystem.colors.neutral[900],
                            fontSize: designSystem.typography.fontSize.base,
                            outline: 'none',
                            transition: designSystem.animations.transition.base,
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = designSystem.colors.brand.primary;
                            e.target.style.boxShadow = designSystem.shadows.focusPrimary;
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = designSystem.colors.neutral[200];
                            e.target.style.boxShadow = 'none';
                          }}
                        />
                      </div>

                      <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        aria-disabled={isSubmitting}
                        whileHover={isSubmitting ? {} : { scale: 1.02 }}
                        whileTap={isSubmitting ? {} : { scale: 0.98 }}
                        style={{
                          width: '100%',
                          padding: `${designSystem.spacing[3]} ${designSystem.spacing[6]}`,
                          borderRadius: designSystem.borderRadius.lg,
                          background: designSystem.colors.gradients.primary,
                          color: designSystem.colors.neutral.white,
                          border: 'none',
                          cursor: isSubmitting ? 'not-allowed' : 'pointer',
                          fontWeight: designSystem.typography.fontWeight.bold,
                          fontSize: designSystem.typography.fontSize.lg,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: designSystem.spacing[2],
                          boxShadow: designSystem.shadows.lg,
                          opacity: isSubmitting ? 0.7 : 1,
                          transition: designSystem.animations.transition.base,
                        }}
                      >
                        {isSubmitting ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            >
                              <Send size={20} />
                            </motion.div>
                            Enviando...
                          </>
                        ) : (
                          <>
                            Subscrever Agora
                            <Send size={20} />
                          </>
                        )}
                      </motion.button>
                    </form>

                    {/* Privacy Note */}
                    <p
                      style={{
                        fontSize: designSystem.typography.fontSize.xs,
                        color: designSystem.colors.neutral[500],
                        textAlign: 'center',
                        marginTop: designSystem.spacing[4],
                        lineHeight: designSystem.typography.lineHeight.relaxed,
                      }}
                    >
                      Ao subscrever, concorda em receber emails da HABTA. Pode cancelar a subscrição a qualquer momento.
                    </p>
                  </>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{
                      textAlign: 'center',
                      padding: designSystem.spacing[6],
                    }}
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', damping: 10, stiffness: 200 }}
                      style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        background: designSystem.helpers.hexToRgba(designSystem.colors.semantic.success, 0.15),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: `0 auto ${designSystem.spacing[4]}`,
                      }}
                    >
                      <CheckCircle size={40} style={{ color: designSystem.colors.semantic.success }} />
                    </motion.div>
                    <h3
                      style={{
                        fontSize: designSystem.typography.fontSize['2xl'],
                        fontWeight: designSystem.typography.fontWeight.bold,
                        color: designSystem.colors.brand.primary,
                        marginBottom: designSystem.spacing[2],
                      }}
                    >
                      Subscrição Confirmada!
                    </h3>
                    <p
                      style={{
                        fontSize: designSystem.typography.fontSize.base,
                        color: designSystem.colors.neutral[600],
                        lineHeight: designSystem.typography.lineHeight.relaxed,
                      }}
                    >
                      Enviámos um email de confirmação para <strong>{email}</strong>. Bem-vindo à comunidade HABTA!
                    </p>
                  </motion.div>
                )}
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
