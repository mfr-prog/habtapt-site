'use client';

import React, { useState, useEffect } from 'react';
import { designSystem } from '@/components/design-system';
import { Container } from '@/components/Container';
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
      <VelaskHero isMobile={isMobile} onScrollToForm={scrollToForm} />
      <VelaskUnits isMobile={isMobile} onScrollToForm={scrollToForm} />
      <VelaskGallery isMobile={isMobile} />
      <VelaskLocation isMobile={isMobile} />
      <VelaskPricing isMobile={isMobile} onScrollToForm={scrollToForm} />
      <VelaskContact isMobile={isMobile} />
      <VelaskForm isMobile={isMobile} />
      <VelaskFAQ />

      {/* Legal Footer */}
      <section style={{ background: c.neutral[950], borderTop: `1px solid ${c.neutral[800]}`, padding: `${sp[8]} 0` }}>
        <Container>
          <div className="flex items-center justify-between gap-4" style={{ flexDirection: isMobile ? 'column' : 'row' }}>
            <p style={{ fontSize: t.fontSize.xs, lineHeight: t.lineHeight.relaxed, color: c.neutral[500], textAlign: isMobile ? 'center' : 'left' }}>
              As imagens e renders 3D sao ilustrativos e nao vinculativos. As areas sao aproximadas e devem ser confirmadas com documentacao oficial. Esta informacao nao constitui proposta contratual e pode ser alterada sem aviso.
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
