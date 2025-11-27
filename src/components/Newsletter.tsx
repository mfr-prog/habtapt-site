'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Send, CheckCircle } from './icons';
import { designSystem } from './design-system';
import { toast } from 'sonner@2.0.3';
import { supabaseFetch } from '../utils/supabase/client';

interface NewsletterProps {
  variant?: 'inline' | 'card';
  theme?: 'light' | 'dark';
}

export function Newsletter({ variant = 'card', theme = 'light' }: NewsletterProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação de email simples
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
        console.error('Newsletter subscription error:', data);
        toast.error(data.error || 'Erro ao processar subscrição. Tente novamente.');
        setIsSubmitting(false);
        return;
      }

      console.log('Newsletter subscription successful:', data);
      setIsSuccess(true);
      toast.success(data.message || 'Subscrição confirmada! Verifique seu email.');
      
      // Reset após 3 segundos
      setTimeout(() => {
        setEmail('');
        setIsSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Newsletter subscription network error:', error);
      toast.error('Erro de conexão. Verifique sua internet e tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDark = theme === 'dark';
  const isCard = variant === 'card';

  if (isCard) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="rounded-2xl p-8 relative overflow-hidden"
        style={{
          background: isDark 
            ? designSystem.helpers.hexToRgba(designSystem.colors.neutral.white, 0.1)
            : designSystem.colors.neutral.white,
          border: `1px solid ${isDark 
            ? designSystem.helpers.hexToRgba(designSystem.colors.neutral.white, 0.2)
            : designSystem.colors.neutral[200]
          }`,
          backdropFilter: isDark ? 'blur(10px)' : 'none',
        }}
      >
        {/* Decorative Gradient */}
        <div
          className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20"
          style={{
            background: designSystem.colors.brand.secondary,
          }}
        />

        <div className="relative z-10">
          {/* Icon */}
          <div
            className="inline-flex p-3 rounded-xl mb-4"
            style={{
              background: isDark
                ? designSystem.helpers.hexToRgba(designSystem.colors.brand.secondary, 0.2)
                : designSystem.helpers.hexToRgba(designSystem.colors.brand.secondary, 0.12),
            }}
          >
            <Mail 
              size={24} 
              style={{ 
                color: isDark 
                  ? designSystem.colors.neutral.white 
                  : designSystem.colors.brand.secondary 
              }} 
            />
          </div>

          {/* Title */}
          <h3
            id="newsletter-title"
            style={{
              fontSize: designSystem.typography.fontSize.xl,
              fontWeight: designSystem.typography.fontWeight.bold,
              color: isDark ? designSystem.colors.neutral.white : designSystem.colors.brand.primary,
              marginBottom: designSystem.spacing[2],
            }}
          >
            Newsletter HABTA
          </h3>

          {/* Description */}
          <p
            style={{
              fontSize: designSystem.typography.fontSize['15'],
              color: isDark 
                ? designSystem.helpers.hexToRgba(designSystem.colors.neutral.white, 0.8)
                : designSystem.colors.neutral[600],
              lineHeight: designSystem.typography.lineHeight.relaxed,
              marginBottom: designSystem.spacing[5],
            }}
          >
            Receba insights exclusivos sobre investimento imobiliário e oportunidades premium.
          </p>

          {/* Form */}
          {!isSuccess ? (
            <form 
              onSubmit={handleSubmit}
              aria-labelledby="newsletter-title"
              role="form"
            >
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <input
                    type="email"
                    name="newsletter-email"
                    id="newsletter-email-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    disabled={isSubmitting}
                    aria-label="Email para subscrição da newsletter"
                    aria-required="true"
                    style={{
                      width: '100%',
                      padding: `${designSystem.spacing[3]} ${designSystem.spacing[4]}`,
                      borderRadius: designSystem.borderRadius.lg,
                      border: `1px solid ${isDark 
                        ? designSystem.helpers.hexToRgba(designSystem.colors.neutral.white, 0.2)
                        : designSystem.colors.neutral[300]
                      }`,
                      background: isDark 
                        ? designSystem.helpers.hexToRgba(designSystem.colors.neutral.white, 0.05)
                        : designSystem.colors.neutral.white,
                      color: isDark 
                        ? designSystem.colors.neutral.white 
                        : designSystem.colors.neutral[900],
                      fontSize: designSystem.typography.fontSize['15'],
                      outline: 'none',
                      transition: designSystem.animations.transition.base,
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = designSystem.colors.brand.secondary;
                      e.target.style.boxShadow = `0 0 0 3px ${designSystem.helpers.hexToRgba(designSystem.colors.brand.secondary, 0.1)}`;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = isDark 
                        ? designSystem.helpers.hexToRgba(designSystem.colors.neutral.white, 0.2)
                        : designSystem.colors.neutral[300];
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={isSubmitting ? {} : { scale: 1.05 }}
                  whileTap={isSubmitting ? {} : { scale: 0.95 }}
                  aria-label={isSubmitting ? "A processar subscrição" : "Subscrever newsletter"}
                  style={{
                    padding: `${designSystem.spacing[3]} ${designSystem.spacing[5]}`,
                    borderRadius: designSystem.borderRadius.lg,
                    background: designSystem.colors.gradients.secondary,
                    color: designSystem.colors.neutral.white,
                    border: 'none',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    fontWeight: designSystem.typography.fontWeight.semibold,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: designSystem.shadows.md,
                    opacity: isSubmitting ? 0.6 : 1,
                    transition: designSystem.animations.transition.base,
                  }}
                >
                  {isSubmitting ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      <Send size={18} />
                    </motion.div>
                  ) : (
                    <Send size={18} />
                  )}
                </motion.button>
              </div>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-3 p-4 rounded-lg"
              style={{
                background: designSystem.helpers.hexToRgba(designSystem.colors.semantic.success, 0.1),
                border: `1px solid ${designSystem.colors.semantic.success}`,
              }}
            >
              <CheckCircle size={20} style={{ color: designSystem.colors.semantic.success }} />
              <span
                style={{
                  color: isDark 
                    ? designSystem.colors.neutral.white 
                    : designSystem.colors.semantic.success,
                  fontWeight: designSystem.typography.fontWeight.semibold,
                  fontSize: designSystem.typography.fontSize['15'],
                }}
              >
                Subscrição confirmada!
              </span>
            </motion.div>
          )}

          {/* Privacy Note */}
          <p
            style={{
              fontSize: designSystem.typography.fontSize.xs,
              color: isDark 
                ? designSystem.helpers.hexToRgba(designSystem.colors.neutral.white, 0.6)
                : designSystem.colors.neutral[500],
              marginTop: designSystem.spacing[3],
              lineHeight: designSystem.typography.lineHeight.relaxed,
            }}
          >
            Ao subscrever, concorda em receber emails da HABTA. Pode cancelar a qualquer momento.
          </p>
        </div>
      </motion.div>
    );
  }

  // Inline variant
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <h4
        style={{
          fontSize: designSystem.typography.fontSize.base,
          fontWeight: designSystem.typography.fontWeight.bold,
          color: isDark ? designSystem.colors.neutral.white : designSystem.colors.brand.primary,
          marginBottom: designSystem.spacing[3],
        }}
      >
        Newsletter
      </h4>
      
      <p
        style={{
          fontSize: designSystem.typography.fontSize.sm,
          color: isDark 
            ? designSystem.helpers.hexToRgba(designSystem.colors.neutral.white, 0.7)
            : designSystem.colors.neutral[600],
          marginBottom: designSystem.spacing[4],
          lineHeight: designSystem.typography.lineHeight.relaxed,
        }}
      >
        Insights e oportunidades exclusivas
      </p>

      {!isSuccess ? (
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <input
              type="email"
              name="newsletter-email-inline"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              disabled={isSubmitting}
              style={{
                width: '100%',
                padding: `${designSystem.spacing[2]} ${designSystem.spacing[3]}`,
                borderRadius: designSystem.borderRadius.md,
                border: `1px solid ${isDark 
                  ? designSystem.helpers.hexToRgba(designSystem.colors.neutral.white, 0.2)
                  : designSystem.colors.neutral[300]
                }`,
                background: isDark 
                  ? designSystem.helpers.hexToRgba(designSystem.colors.neutral.white, 0.05)
                  : designSystem.colors.neutral.white,
                color: isDark 
                  ? designSystem.colors.neutral.white 
                  : designSystem.colors.neutral[900],
                fontSize: designSystem.typography.fontSize.sm,
                outline: 'none',
                transition: designSystem.animations.transition.base,
              }}
              onFocus={(e) => {
                e.target.style.borderColor = designSystem.colors.brand.secondary;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = isDark 
                  ? designSystem.helpers.hexToRgba(designSystem.colors.neutral.white, 0.2)
                  : designSystem.colors.neutral[300];
              }}
            />
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={isSubmitting ? {} : { scale: 1.02 }}
              whileTap={isSubmitting ? {} : { scale: 0.98 }}
              style={{
                width: '100%',
                padding: `${designSystem.spacing[2]} ${designSystem.spacing[3]}`,
                borderRadius: designSystem.borderRadius.md,
                background: designSystem.colors.gradients.secondary,
                color: designSystem.colors.neutral.white,
                border: 'none',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                fontWeight: designSystem.typography.fontWeight.semibold,
                fontSize: designSystem.typography.fontSize.sm,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                opacity: isSubmitting ? 0.6 : 1,
                transition: designSystem.animations.transition.base,
              }}
            >
              {isSubmitting ? 'Enviando...' : 'Subscrever'}
              <Send size={16} />
            </motion.button>
          </div>
        </form>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-2 p-3 rounded-lg"
          style={{
            background: designSystem.helpers.hexToRgba(designSystem.colors.semantic.success, 0.15),
            border: `1px solid ${designSystem.colors.semantic.success}`,
          }}
        >
          <CheckCircle size={16} style={{ color: designSystem.colors.semantic.success }} />
          <span
            style={{
              color: isDark 
                ? designSystem.colors.neutral.white 
                : designSystem.colors.semantic.success,
              fontWeight: designSystem.typography.fontWeight.semibold,
              fontSize: '0.875rem',
            }}
          >
            Subscrito!
          </span>
        </motion.div>
      )}
    </motion.div>
  );
}
