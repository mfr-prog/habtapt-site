'use client';

import { Container } from '@/components/Container';
import { Section } from '@/components/Section';
import { motion } from 'motion/react';
import { useInView } from '@/components/useInView';
import { Phone, Mail, MessageCircle } from '@/components/icons';
import { ds, c, t, sp, sectionTitle, bodyText, ctaButtonPrimary } from './velask-styles';

interface VelaskContactProps {
  isMobile: boolean;
}

export function VelaskContact({ isMobile }: VelaskContactProps) {
  const contactInView = useInView({ threshold: 0.1 });

  return (
    <Section background="white">
      <Container>
        <div ref={contactInView.ref} style={{ maxWidth: '48rem', margin: '0 auto' }}>
          <motion.div className="text-center" initial={{ opacity: 0, y: 30 }} animate={contactInView.isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: sp[2],
              padding: `${sp[3]} ${sp[5]}`,
              borderRadius: ds.borderRadius.full,
              background: 'rgba(26,62,92,0.08)',
              border: '1px solid rgba(26,62,92,0.15)',
              fontSize: t.fontSize.sm,
              fontWeight: t.fontWeight.semibold,
              color: c.brand.primary,
              textTransform: 'uppercase',
              letterSpacing: t.letterSpacing.wider,
              marginBottom: sp[6],
            }}>Contacto</span>

            <h2 style={{ ...sectionTitle, marginBottom: sp[4] }}>Fale Connosco</h2>
            <p style={{ ...bodyText, marginBottom: sp[10] }}>
              Estamos disponíveis para responder a todas as suas questões e agendar uma visita ao imóvel.
            </p>

            <div className="flex gap-4 justify-center flex-wrap" style={{ marginBottom: sp[8] }}>
              <motion.a
                href="https://wa.me/351963290394?text=Ol%C3%A1%2C+tenho+interesse+no+Projecto+Velask."
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  ...ctaButtonPrimary,
                  background: '#25d366',
                  color: '#fff',
                  boxShadow: '0 4px 14px rgba(37,211,102,0.3)',
                  textDecoration: 'none',
                  justifyContent: 'center',
                }}
                whileHover={isMobile ? {} : { scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <MessageCircle style={{ width: 20, height: 20 }} /> WhatsApp
              </motion.a>

              <motion.a
                href="mailto:contato@habta.eu"
                style={{
                  ...ctaButtonPrimary,
                  background: c.gradients.primary,
                  color: '#fff',
                  boxShadow: ds.shadows.primaryHover,
                  textDecoration: 'none',
                  justifyContent: 'center',
                }}
                whileHover={isMobile ? {} : { scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Mail style={{ width: 20, height: 20 }} /> contato@habta.eu
              </motion.a>

              <motion.a
                href="tel:+351963290394"
                style={{
                  ...ctaButtonPrimary,
                  justifyContent: 'center',
                  textDecoration: 'none',
                }}
                whileHover={isMobile ? {} : { scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Phone style={{ width: 20, height: 20 }} /> +351 963 290 394
              </motion.a>
            </div>
          </motion.div>
        </div>
      </Container>
    </Section>
  );
}
