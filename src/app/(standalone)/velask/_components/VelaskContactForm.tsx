'use client';

import React, { useState, useEffect } from 'react';
import { Container } from '@/components/Container';
import { motion } from 'motion/react';
import { useInView } from '@/components/useInView';
import { CheckCircle, Send, MessageCircle, Mail } from '@/components/icons';
import { Logo } from '@/components/Logo';
import { supabaseFetch } from '@/utils/supabase/client';
import { ds, c, t, sp, sectionTitle, ctaButtonPrimary, inputStyle } from './velask-styles';

interface VelaskContactFormProps {
  isMobile: boolean;
  selectedTypology?: string;
}

export function VelaskContactForm({ isMobile, selectedTypology = '' }: VelaskContactFormProps) {
  const [formData, setFormData] = useState({
    name: '', phone: '', typology: '',
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formInView = useInView({ threshold: 0.1 });

  useEffect(() => {
    if (selectedTypology) {
      setFormData((prev) => ({ ...prev, typology: selectedTypology }));
    }
  }, [selectedTypology]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await supabaseFetch('contacts', {
        method: 'POST',
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          typology: formData.typology,
          source: 'velask-landing',
        }),
      });

      if (response.ok) {
        setFormSubmitted(true);
      } else {
        setFormSubmitted(true);
      }
    } catch {
      setFormSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="velask-form" style={{ background: c.gradients.heroLuxury, padding: `${sp[24]} 0` }}>
      <Container>
        <div ref={formInView.ref} style={{ maxWidth: '36rem', margin: '0 auto' }}>
          <motion.div className="text-center" initial={{ opacity: 0, y: 30 }} animate={formInView.isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
            {/* HABTA logo */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: sp[3], marginBottom: sp[6] }}>
              <Logo variant="white" size={36} />
              <span style={{ fontSize: t.fontSize.xl, fontWeight: t.fontWeight.black, color: '#fff', letterSpacing: t.letterSpacing.wider }}>HABTA</span>
            </div>

            <h2 style={{ ...sectionTitle, color: '#fff', marginBottom: sp[4] }}>Fale Connosco</h2>
            <p style={{ fontSize: t.fontSize.base, color: 'rgba(255,255,255,0.7)', marginBottom: sp[10] }}>
              Estamos disponíveis para responder a todas as suas questões e agendar uma visita ao imóvel.
            </p>

            {formSubmitted ? (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center rounded-3xl" style={{ padding: sp[12], background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)' }}>
                <div className="flex items-center justify-center rounded-full" style={{ width: 64, height: 64, background: 'rgba(16,185,129,0.2)', margin: `0 auto ${sp[6]}` }}>
                  <CheckCircle style={{ width: 32, height: 32, color: c.semantic.success }} />
                </div>
                <h3 style={{ fontSize: t.fontSize['2xl'], fontWeight: t.fontWeight.bold, color: '#fff', marginBottom: sp[3] }}>Obrigado!</h3>
                <p style={{ fontSize: t.fontSize.base, color: 'rgba(255,255,255,0.7)' }}>Vamos entrar em contacto brevemente.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleFormSubmit} className="rounded-3xl" style={{ padding: isMobile ? sp[8] : sp[10], background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)', textAlign: 'left' }}>
                <div style={{ marginBottom: sp[5] }}>
                  <label style={{ display: 'block', fontSize: t.fontSize.sm, fontWeight: t.fontWeight.semibold, color: 'rgba(255,255,255,0.8)', marginBottom: sp[2] }}>Nome completo <span style={{ color: c.brand.secondaryLight }}>*</span></label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} style={inputStyle} placeholder="O seu nome" />
                </div>

                <div style={{ marginBottom: sp[5] }}>
                  <label style={{ display: 'block', fontSize: t.fontSize.sm, fontWeight: t.fontWeight.semibold, color: 'rgba(255,255,255,0.8)', marginBottom: sp[2] }}>Telefone / WhatsApp <span style={{ color: c.brand.secondaryLight }}>*</span></label>
                  <input type="tel" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} style={inputStyle} placeholder="+351 000 000 000" />
                </div>

                <div style={{ marginBottom: sp[8] }}>
                  <label style={{ display: 'block', fontSize: t.fontSize.sm, fontWeight: t.fontWeight.semibold, color: 'rgba(255,255,255,0.8)', marginBottom: sp[2] }}>Qual apartamento lhe interessa? <span style={{ color: c.brand.secondaryLight }}>*</span></label>
                  <select required value={formData.typology} onChange={(e) => setFormData({ ...formData, typology: e.target.value })} style={inputStyle}>
                    <option value="" style={{ color: '#333' }}>Selecione…</option>
                    <option value="t1" style={{ color: '#333' }}>Fracção A — T1</option>
                    <option value="t2" style={{ color: '#333' }}>Fracção B — T2</option>
                    <option value="t3" style={{ color: '#333' }}>Fracção C — T3 Duplex</option>
                    <option value="unsure" style={{ color: '#333' }}>Todos / Ainda não sei</option>
                  </select>
                </div>

                <motion.button type="submit" disabled={isSubmitting} className="flex items-center justify-center gap-2" style={{ ...ctaButtonPrimary, width: '100%', justifyContent: 'center', opacity: isSubmitting ? 0.7 : 1 }} whileHover={isMobile ? {} : { scale: 1.02 }} whileTap={{ scale: 0.95 }}>
                  <Send style={{ width: 20, height: 20 }} /> {isSubmitting ? 'A ENVIAR…' : 'QUERO SER CONTACTADO'}
                </motion.button>
              </form>
            )}

            {/* Direct contact buttons */}
            <div className="flex gap-4 justify-center flex-wrap" style={{ marginTop: sp[10] }}>
              <motion.a
                href="https://wa.me/351963290394?text=Ol%C3%A1%2C+tenho+interesse+no+Projecto+Velask."
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: sp[2],
                  padding: `${sp[3]} ${sp[6]}`,
                  borderRadius: ds.borderRadius.full,
                  background: 'rgba(255,255,255,0.1)',
                  color: '#fff',
                  fontWeight: t.fontWeight.semibold,
                  fontSize: t.fontSize.sm,
                  border: '2px solid rgba(255,255,255,0.2)',
                  textDecoration: 'none',
                  cursor: 'pointer',
                }}
                whileHover={isMobile ? {} : { scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <MessageCircle style={{ width: 18, height: 18 }} /> WhatsApp
              </motion.a>

              <motion.a
                href="mailto:contato@habta.eu"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: sp[2],
                  padding: `${sp[3]} ${sp[6]}`,
                  borderRadius: ds.borderRadius.full,
                  background: 'rgba(255,255,255,0.1)',
                  color: '#fff',
                  fontWeight: t.fontWeight.semibold,
                  fontSize: t.fontSize.sm,
                  border: '2px solid rgba(255,255,255,0.2)',
                  textDecoration: 'none',
                  cursor: 'pointer',
                }}
                whileHover={isMobile ? {} : { scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Mail style={{ width: 18, height: 18 }} /> contato@habta.eu
              </motion.a>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
