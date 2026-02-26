'use client';

import { Container } from '@/components/Container';
import { Section } from '@/components/Section';
import { motion } from 'motion/react';
import { useInView } from '@/components/useInView';
import { ArrowRight } from '@/components/icons';
import { pricingRows } from '../_data/velask-data';
import { ds, c, t, sp, sectionBadge, sectionTitle, cardBase } from './velask-styles';

interface VelaskPricingProps {
  isMobile: boolean;
  onSelectTypology: (typology: string) => void;
}

export function VelaskPricing({ isMobile, onSelectTypology }: VelaskPricingProps) {
  const priceInView = useInView({ threshold: 0.1 });

  const waMessages: Record<string, string> = {
    t1: 'Olá, tenho interesse na Fracção A (T1) do Velask Residence.',
    t2: 'Olá, tenho interesse na Fracção B (T2) do Velask Residence.',
    t3: 'Olá, tenho interesse na Fracção C (T3 Duplex) do Velask Residence.',
  };

  const getWhatsAppUrl = (typologyKey: string) =>
    `https://wa.me/351963290394?text=${encodeURIComponent(waMessages[typologyKey] || 'Olá, tenho interesse no Velask Residence.')}`;

  return (
    <Section background="muted">
      <Container>
        <div ref={priceInView.ref} className="text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={priceInView.isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
            <span style={sectionBadge(true)}>Investimento</span>
          </motion.div>

          <motion.h2 initial={{ opacity: 0, y: 30 }} animate={priceInView.isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.1 }} style={{ ...sectionTitle, marginBottom: sp[12] }}>
            Preços e Disponibilidade
          </motion.h2>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={priceInView.isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.2 }} style={{ maxWidth: '56rem', margin: '0 auto' }}>
            {!isMobile && (
              <div className="rounded-3xl overflow-hidden" style={{ background: '#fff', border: `1px solid ${c.neutral[200]}` }}>
                <table style={{ width: '100%' }}>
                  <thead>
                    <tr style={{ background: c.brand.primary }}>
                      {['Frac.', 'Tipo', 'Área bruta', 'Diferencial', 'Preço', 'Estado', ''].map(h => (
                        <th key={h} style={{ textAlign: 'left', fontSize: t.fontSize.sm, fontWeight: t.fontWeight.semibold, color: '#fff', padding: `${sp[4]} ${sp[5]}` }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {pricingRows.map((row, i) => (
                      <tr key={i} style={{ borderBottom: i < pricingRows.length - 1 ? `1px solid ${c.neutral[200]}` : 'none' }}>
                        <td style={{ padding: `${sp[5]} ${sp[5]}`, fontSize: t.fontSize.sm, fontWeight: t.fontWeight.semibold, color: c.neutral[900] }}>{row.unit}</td>
                        <td style={{ padding: `${sp[5]} ${sp[5]}`, fontSize: t.fontSize.sm, fontWeight: t.fontWeight.medium, color: c.brand.primary }}>{row.type}</td>
                        <td style={{ padding: `${sp[5]} ${sp[5]}`, fontSize: t.fontSize.sm, color: c.neutral[700] }}>{row.area} m&sup2;</td>
                        <td style={{ padding: `${sp[5]} ${sp[5]}`, fontSize: t.fontSize.sm, color: c.neutral[600] }}>{row.diferencial}</td>
                        <td style={{ padding: `${sp[5]} ${sp[5]}`, fontSize: t.fontSize.base, fontWeight: t.fontWeight.bold, color: c.brand.secondary }}>&euro;{row.price}</td>
                        <td style={{ padding: `${sp[5]} ${sp[6]}` }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: sp[1], fontSize: t.fontSize.xs, fontWeight: t.fontWeight.semibold, padding: `${sp[1]} ${sp[3]}`, borderRadius: ds.borderRadius.full, background: 'rgba(16,185,129,0.1)', color: c.semantic.success }}>
                            <span style={{ width: 6, height: 6, borderRadius: '50%', background: c.semantic.success }} />{row.status}
                          </span>
                        </td>
                        <td style={{ padding: `${sp[5]} ${sp[6]}` }}>
                          <motion.a
                            href={getWhatsAppUrl(row.typologyKey)}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: sp[1],
                              padding: `${sp[2]} ${sp[4]}`,
                              borderRadius: ds.borderRadius.full,
                              background: c.gradients.secondary,
                              color: c.brand.primary,
                              fontWeight: t.fontWeight.semibold,
                              fontSize: t.fontSize.xs,
                              textDecoration: 'none',
                              whiteSpace: 'nowrap',
                            }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Saber Mais <ArrowRight style={{ width: 14, height: 14 }} />
                          </motion.a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {isMobile && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: sp[4] }}>
                {pricingRows.map((row, i) => (
                  <div key={i} className="rounded-3xl" style={{ ...cardBase, padding: sp[6] }}>
                    <div className="flex items-center justify-between" style={{ marginBottom: sp[4] }}>
                      <div className="flex items-center gap-2">
                        <span style={{ fontSize: t.fontSize.lg, fontWeight: t.fontWeight.bold, color: c.brand.primary }}>{row.type}</span>
                        <span style={{ fontSize: t.fontSize.sm, color: c.neutral[500] }}>Frac. {row.unit}</span>
                      </div>
                      <span style={{ fontSize: t.fontSize.xs, fontWeight: t.fontWeight.semibold, padding: `${sp[1]} ${sp[3]}`, borderRadius: ds.borderRadius.full, background: 'rgba(16,185,129,0.1)', color: c.semantic.success }}>{row.status}</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: sp[2], fontSize: t.fontSize.sm, marginBottom: sp[4] }}>
                      <div className="flex justify-between"><span style={{ color: c.neutral[500] }}>Área bruta</span><span style={{ fontWeight: t.fontWeight.medium, color: c.neutral[800] }}>{row.area} m&sup2;</span></div>
                      <div className="flex justify-between"><span style={{ color: c.neutral[500] }}>Diferencial</span><span style={{ fontWeight: t.fontWeight.medium, color: c.neutral[800] }}>{row.diferencial}</span></div>
                    </div>
                    <div className="flex items-center justify-between" style={{ paddingTop: sp[4], borderTop: `1px solid ${c.neutral[200]}` }}>
                      <p style={{ fontSize: t.fontSize.xl, fontWeight: t.fontWeight.bold, color: c.brand.secondary }}>&euro;{row.price}</p>
                      <motion.a
                        href={getWhatsAppUrl(row.typologyKey)}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: sp[2],
                          padding: `${sp[3]} ${sp[5]}`,
                          borderRadius: ds.borderRadius.full,
                          background: c.gradients.secondary,
                          color: c.brand.primary,
                          fontWeight: t.fontWeight.semibold,
                          fontSize: t.fontSize.sm,
                          textDecoration: 'none',
                        }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Saber Mais <ArrowRight style={{ width: 14, height: 14 }} />
                      </motion.a>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <p style={{ fontSize: t.fontSize.xs, color: c.neutral[500], marginTop: sp[6], lineHeight: t.lineHeight.relaxed }}>
              Preços incluem IVA. Sujeito a disponibilidade. Para informação sobre financiamento, contacte-nos.
            </p>
          </motion.div>
        </div>
      </Container>
    </Section>
  );
}
