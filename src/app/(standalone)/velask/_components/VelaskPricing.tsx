'use client';

import { Container } from '@/components/Container';
import { Section } from '@/components/Section';
import { motion } from 'motion/react';
import { useInView } from '@/components/useInView';
import { ArrowRight } from '@/components/icons';
import { pricingRows } from '../_data/velask-data';
import { ds, c, t, sp, sectionBadge, sectionTitle, cardBase, ctaButtonPrimary } from './velask-styles';

interface VelaskPricingProps {
  isMobile: boolean;
  onScrollToForm: () => void;
}

export function VelaskPricing({ isMobile, onScrollToForm }: VelaskPricingProps) {
  const priceInView = useInView({ threshold: 0.1 });

  return (
    <Section background="muted">
      <Container>
        <div ref={priceInView.ref} className="text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={priceInView.isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
            <span style={sectionBadge(true)}>Investimento</span>
          </motion.div>

          <motion.h2 initial={{ opacity: 0, y: 30 }} animate={priceInView.isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.1 }} style={{ ...sectionTitle, marginBottom: sp[12] }}>
            Precos e Disponibilidade
          </motion.h2>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={priceInView.isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.2 }} style={{ maxWidth: '56rem', margin: '0 auto' }}>
            {!isMobile && (
              <div className="rounded-3xl overflow-hidden" style={{ background: '#fff', border: `1px solid ${c.neutral[200]}` }}>
                <table style={{ width: '100%' }}>
                  <thead>
                    <tr style={{ background: c.brand.primary }}>
                      {['Unidade', 'Piso', 'Tipologia', 'Area bruta (m\u00B2)', 'Preco', 'Estado'].map(h => (
                        <th key={h} style={{ textAlign: 'left', fontSize: t.fontSize.sm, fontWeight: t.fontWeight.semibold, color: '#fff', padding: `${sp[4]} ${sp[6]}` }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {pricingRows.map((row, i) => (
                      <tr key={i} style={{ borderBottom: i < pricingRows.length - 1 ? `1px solid ${c.neutral[200]}` : 'none' }}>
                        <td style={{ padding: `${sp[5]} ${sp[6]}`, fontSize: t.fontSize.sm, fontWeight: t.fontWeight.semibold, color: c.neutral[900] }}>{row.unit}</td>
                        <td style={{ padding: `${sp[5]} ${sp[6]}`, fontSize: t.fontSize.sm, color: c.neutral[700] }}>{row.floor}</td>
                        <td style={{ padding: `${sp[5]} ${sp[6]}`, fontSize: t.fontSize.sm, fontWeight: t.fontWeight.medium, color: c.brand.primary }}>{row.type}</td>
                        <td style={{ padding: `${sp[5]} ${sp[6]}`, fontSize: t.fontSize.sm, color: c.neutral[700] }}>{row.area}</td>
                        <td style={{ padding: `${sp[5]} ${sp[6]}`, fontSize: t.fontSize.sm, fontWeight: t.fontWeight.semibold, color: c.brand.secondary }}>{row.price}</td>
                        <td style={{ padding: `${sp[5]} ${sp[6]}` }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: sp[1], fontSize: t.fontSize.xs, fontWeight: t.fontWeight.semibold, padding: `${sp[1]} ${sp[3]}`, borderRadius: ds.borderRadius.full, background: 'rgba(16,185,129,0.1)', color: c.semantic.success }}>
                            <span style={{ width: 6, height: 6, borderRadius: '50%', background: c.semantic.success }} />{row.status}
                          </span>
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
                    <div className="flex items-center justify-between" style={{ marginBottom: sp[3] }}>
                      <div className="flex items-center gap-2">
                        <span style={{ fontSize: t.fontSize.lg, fontWeight: t.fontWeight.bold, color: c.brand.primary }}>Unidade {row.unit}</span>
                        <span style={{ fontSize: t.fontSize.sm, fontWeight: t.fontWeight.medium, color: c.neutral[600] }}>{row.type}</span>
                      </div>
                      <span style={{ fontSize: t.fontSize.xs, fontWeight: t.fontWeight.semibold, padding: `${sp[1]} ${sp[3]}`, borderRadius: ds.borderRadius.full, background: 'rgba(16,185,129,0.1)', color: c.semantic.success }}>{row.status}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2" style={{ fontSize: t.fontSize.sm }}>
                      <div><span style={{ color: c.neutral[500] }}>Piso: </span><span style={{ fontWeight: t.fontWeight.medium, color: c.neutral[800] }}>{row.floor}</span></div>
                      <div><span style={{ color: c.neutral[500] }}>Area: </span><span style={{ fontWeight: t.fontWeight.medium, color: c.neutral[800] }}>{row.area} m&sup2;</span></div>
                    </div>
                    <div style={{ marginTop: sp[3], paddingTop: sp[3], borderTop: `1px solid ${c.neutral[200]}` }}>
                      <p style={{ fontSize: t.fontSize.sm, fontWeight: t.fontWeight.semibold, color: c.brand.secondary }}>{row.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <p style={{ fontSize: t.fontSize.xs, color: c.neutral[500], marginTop: sp[6], lineHeight: t.lineHeight.relaxed }}>
              Areas brutas incluem componentes como jardim/patio/varanda/garagem/anexo/sotao conforme unidade. Solicite a brochura para detalhe completo.
            </p>

            <div style={{ marginTop: sp[8] }}>
              <motion.button onClick={onScrollToForm} style={ctaButtonPrimary} whileHover={isMobile ? {} : { scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                PEDIR TABELA DE PRECOS <ArrowRight style={{ width: 20, height: 20 }} />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </Container>
    </Section>
  );
}
