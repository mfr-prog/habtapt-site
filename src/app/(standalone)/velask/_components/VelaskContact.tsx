'use client';

import { Container } from '@/components/Container';
import { Section } from '@/components/Section';
import { motion } from 'motion/react';
import { useInView } from '@/components/useInView';
import { Phone, Mail, MessageCircle } from '@/components/icons';
import { ds, c, t, sp, sectionBadge, sectionTitle, bodyText, cardBase, ctaButtonPrimary } from './velask-styles';

interface VelaskContactProps {
  isMobile: boolean;
}

export function VelaskContact({ isMobile }: VelaskContactProps) {
  const contactInView = useInView({ threshold: 0.1 });

  const handleWhatsApp = () => {
    window.open('https://wa.me/351963290394?text=Ola! Gostaria de saber mais sobre o VELASK Residence.', '_blank');
  };

  const contactItems = [
    { icon: Phone, label: '+351 963 290 394', sub: 'Telefone', href: 'tel:+351963290394', iconColor: c.brand.primary, bgColor: 'rgba(26,62,92,0.08)' },
    { icon: Mail, label: 'contato@habta.eu', sub: 'Email', href: 'mailto:contato@habta.eu', iconColor: c.brand.secondary, bgColor: 'rgba(184,149,106,0.1)' },
    { icon: MessageCircle, label: 'WhatsApp', sub: 'Mensagem', onClick: handleWhatsApp, iconColor: c.external.whatsappPrimary, bgColor: 'rgba(37,211,102,0.08)' },
  ];

  return (
    <Section background="white">
      <Container>
        <div ref={contactInView.ref} style={{ maxWidth: '48rem', margin: '0 auto' }}>
          <motion.div className="text-center" initial={{ opacity: 0, y: 30 }} animate={contactInView.isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
            <span style={sectionBadge()}>Contactos</span>
            <h2 style={{ ...sectionTitle, marginBottom: sp[6] }}>Gestor de Vendas</h2>
            <p style={{ ...bodyText, marginBottom: sp[10] }}>
              Acompanhamo-lo(a) em todo o processo: esclarecimento de areas, mapa de acabamentos, simulacoes de financiamento e agendamento de visita.
            </p>

            <div className="grid gap-4" style={{ gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', marginBottom: sp[8] }}>
              {contactItems.map((item, i) => (
                <motion.a key={i} href={item.href} onClick={item.onClick} className="flex flex-col items-center gap-3 p-6 rounded-3xl" style={{ ...cardBase, textDecoration: 'none', cursor: 'pointer' }} whileHover={isMobile ? {} : { scale: 1.02, x: 4 }}>
                  <div className="flex items-center justify-center rounded-full" style={{ width: 48, height: 48, background: item.bgColor }}>
                    <item.icon style={{ width: 20, height: 20, color: item.iconColor }} />
                  </div>
                  <p style={{ fontSize: t.fontSize.sm, fontWeight: t.fontWeight.semibold, color: c.neutral[800] }}>{item.label}</p>
                  <p style={{ fontSize: t.fontSize.xs, color: c.neutral[500] }}>{item.sub}</p>
                </motion.a>
              ))}
            </div>

            <div className="flex gap-4 justify-center" style={{ flexDirection: isMobile ? 'column' : 'row' }}>
              <motion.a href="tel:+351963290394" style={{ ...ctaButtonPrimary, background: c.gradients.primary, boxShadow: ds.shadows.primaryHover, textDecoration: 'none', justifyContent: 'center' }} whileHover={isMobile ? {} : { scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                <Phone style={{ width: 20, height: 20 }} /> LIGAR AGORA
              </motion.a>
              <motion.button onClick={handleWhatsApp} style={{ ...ctaButtonPrimary, background: c.external.whatsappPrimary, boxShadow: '0 4px 14px rgba(37,211,102,0.3)', justifyContent: 'center' }} whileHover={isMobile ? {} : { scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                <MessageCircle style={{ width: 20, height: 20 }} /> ENVIAR WHATSAPP
              </motion.button>
            </div>
          </motion.div>
        </div>
      </Container>
    </Section>
  );
}
