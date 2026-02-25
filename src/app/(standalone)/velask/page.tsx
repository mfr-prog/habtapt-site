'use client';

import React, { useState, useEffect } from 'react';
import { designSystem } from '@/components/design-system';
import { Container } from '@/components/Container';
import { VelaskNavbar } from './_components/VelaskNavbar';
import { VelaskHero } from './_components/VelaskHero';
import { VelaskUnits } from './_components/VelaskUnits';
import { VelaskGallery } from './_components/VelaskGallery';
import { VelaskLocation } from './_components/VelaskLocation';
import { VelaskPricing } from './_components/VelaskPricing';
import { VelaskContact } from './_components/VelaskContact';
import { VelaskForm } from './_components/VelaskForm';
import { VelaskBairro } from './_components/VelaskBairro';
import { VelaskFAQ } from './_components/VelaskFAQ';

const ds = designSystem;
const c = ds.colors;
const t = ds.typography;
const sp = ds.spacing;

export default function VelaskPage() {
  const [isMobile, setIsMobile] = useState(false);
  const [selectedTypology, setSelectedTypology] = useState('');

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < parseInt(ds.breakpoints.lg));
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const scrollToForm = () => {
    document.getElementById('velask-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <VelaskNavbar />

      <div id="hero">
        <VelaskHero isMobile={isMobile} onScrollToForm={scrollToForm} />
      </div>

      <div id="projecto">
        <VelaskUnits isMobile={isMobile} onScrollToForm={scrollToForm} />
      </div>

      <div id="bairro">
        <VelaskBairro isMobile={isMobile} />
      </div>

      <div id="galeria">
        <VelaskGallery isMobile={isMobile} />
      </div>

      <div id="localizacao">
        <VelaskLocation isMobile={isMobile} />
      </div>

      <div id="precos">
        <VelaskPricing isMobile={isMobile} onSelectTypology={setSelectedTypology} />
      </div>

      <div id="contacto">
        <VelaskContact isMobile={isMobile} />
        <VelaskForm isMobile={isMobile} selectedTypology={selectedTypology} />
      </div>

      <div id="faq">
        <VelaskFAQ />
      </div>

      {/* Footer */}
      <section style={{ background: '#0F1C2E', borderTop: `1px solid ${c.neutral[800]}`, padding: `${sp[16]} 0 ${sp[8]}` }}>
        <Container>
          <div className="grid gap-8" style={{ gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', marginBottom: sp[12] }}>
            {/* Left column — brand info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: sp[4] }}>
              <a href="https://habta.eu" style={{ fontSize: t.fontSize.xl, fontWeight: t.fontWeight.black, color: '#fff', textDecoration: 'none', letterSpacing: t.letterSpacing.wider }}>HABTA</a>
              <p style={{ fontSize: t.fontSize.sm, color: c.neutral[400], fontStyle: 'italic' }}>Every home, productized.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: sp[2], fontSize: t.fontSize.sm, color: c.neutral[400] }}>
                <span>Rua Fernão Lopes, nº 23</span>
                <span>Cascais 2765-088, Portugal</span>
                <a href="tel:+351963290394" style={{ color: c.neutral[400], textDecoration: 'none' }}>+351 963 290 394</a>
                <a href="mailto:contato@habta.eu" style={{ color: c.neutral[400], textDecoration: 'none' }}>contato@habta.eu</a>
              </div>
            </div>

            {/* Right column — links */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: sp[3], alignItems: isMobile ? 'flex-start' : 'flex-end' }}>
              <p style={{ fontSize: t.fontSize.sm, fontWeight: t.fontWeight.semibold, color: c.neutral[300], marginBottom: sp[1] }}>Secções</p>
              {['O Projecto', 'O Bairro', 'Plantas', 'Preços', 'Contacto'].map((label) => (
                <button
                  key={label}
                  onClick={() => {
                    const id = label === 'O Projecto' ? 'projecto' : label === 'O Bairro' ? 'bairro' : label === 'Preços' ? 'precos' : label.toLowerCase();
                    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  style={{ background: 'none', border: 'none', color: c.neutral[400], fontSize: t.fontSize.sm, cursor: 'pointer', padding: 0, textAlign: isMobile ? 'left' : 'right' }}
                >
                  {label}
                </button>
              ))}
              <a href="https://habta.eu" style={{ color: c.neutral[400], fontSize: t.fontSize.sm, textDecoration: 'none', marginTop: sp[2] }}>habta.eu</a>
            </div>
          </div>

          {/* Bottom bar */}
          <div style={{ borderTop: '1px solid #B8956A', paddingTop: sp[6], display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'center' : 'center', justifyContent: 'space-between', gap: sp[4] }}>
            <p style={{ fontSize: t.fontSize.xs, color: c.neutral[500], textAlign: isMobile ? 'center' : 'left' }}>
              &copy; 2026 Jornada Prometida LDA &middot; NIF 518493644
            </p>
            <div className="flex items-center gap-4">
              <a href="https://habta.eu/privacidade" style={{ fontSize: t.fontSize.xs, color: c.neutral[500], textDecoration: 'none' }}>Política de Privacidade</a>
              <a href="https://habta.eu/cookies" style={{ fontSize: t.fontSize.xs, color: c.neutral[500], textDecoration: 'none' }}>Política de Cookies</a>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
