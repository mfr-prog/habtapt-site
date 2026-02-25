'use client';

import React, { useState, useEffect } from 'react';
import { Container } from '@/components/Container';
import { motion } from 'motion/react';
import { useInView } from '@/components/useInView';
import { CheckCircle, Send } from '@/components/icons';
import { supabaseFetch } from '@/utils/supabase/client';
import { c, t, sp, sectionTitle, ctaButtonPrimary, inputStyle } from './velask-styles';

interface VelaskFormProps {
  isMobile: boolean;
  selectedTypology?: string;
}

export function VelaskForm({ isMobile, selectedTypology = '' }: VelaskFormProps) {
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
        <div ref={formInView.ref} style={{ maxWidth: '32rem', margin: '0 auto' }}>
          <motion.div className="text-center" initial={{ opacity: 0, y: 30 }} animate={formInView.isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
            <h2 style={{ ...sectionTitle, color: '#fff', marginBottom: sp[4] }}>Quero ser contactado</h2>
            <p style={{ fontSize: t.fontSize.base, color: 'rgba(255,255,255,0.7)', marginBottom: sp[10] }}>
              Deixe os seus dados e entramos em contacto.
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
                {/* Bug #09 — simplified to 3 fields */}
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
                    <option value="" style={{ color: '#333' }}>Selecione...</option>
                    <option value="t1" style={{ color: '#333' }}>Fraccao A — T1</option>
                    <option value="t2" style={{ color: '#333' }}>Fraccao B — T2</option>
                    <option value="t3" style={{ color: '#333' }}>Fraccao C — T3 Duplex</option>
                    <option value="unsure" style={{ color: '#333' }}>Todos / Ainda nao sei</option>
                  </select>
                </div>

                <motion.button type="submit" disabled={isSubmitting} className="flex items-center justify-center gap-2" style={{ ...ctaButtonPrimary, width: '100%', justifyContent: 'center', opacity: isSubmitting ? 0.7 : 1 }} whileHover={isMobile ? {} : { scale: 1.02 }} whileTap={{ scale: 0.95 }}>
                  <Send style={{ width: 20, height: 20 }} /> {isSubmitting ? 'A ENVIAR...' : 'QUERO SER CONTACTADO'}
                </motion.button>
              </form>
            )}
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
