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

      {/* Legal Footer */}
      <section style={{ background: '#0F1C2E', borderTop: `1px solid ${c.neutral[800]}`, padding: `${sp[8]} 0` }}>
        <Container>
          <div className="flex items-center justify-between gap-4" style={{ flexDirection: isMobile ? 'column' : 'row' }}>
            <div className="flex items-center gap-4" style={{ flexDirection: isMobile ? 'column' : 'row' }}>
              <a href="https://habta.eu" style={{ fontSize: t.fontSize.sm, fontWeight: t.fontWeight.black, color: '#fff', textDecoration: 'none', letterSpacing: t.letterSpacing.wider }}>HABTA</a>
              <a href="https://habta.eu/privacidade" style={{ fontSize: t.fontSize.xs, color: c.neutral[500], textDecoration: 'none' }}>Política de Privacidade</a>
            </div>
            <p style={{ fontSize: t.fontSize.xs, color: c.neutral[500], textAlign: isMobile ? 'center' : 'left', maxWidth: '36rem' }}>
              As imagens e renders 3D são ilustrativos e não vinculativos. As áreas são aproximadas e devem ser confirmadas com documentação oficial. Esta informação não constitui proposta contratual e pode ser alterada sem aviso.
            </p>
            <p style={{ fontSize: t.fontSize.xs, color: c.neutral[600], whiteSpace: 'nowrap' }}>
              VELASK Residence &copy; {new Date().getFullYear()}
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
