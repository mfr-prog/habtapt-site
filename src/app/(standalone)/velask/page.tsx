'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { designSystem } from '@/components/design-system';
import { Footer } from '@/components/Footer';
import { VelaskNavbar } from './_components/VelaskNavbar';
import { VelaskHero } from './_components/VelaskHero';
import { VelaskProjeto, VelaskInteriores, VelaskPlantas } from './_components/VelaskUnits';
import { VelaskBairro } from './_components/VelaskBairro';
import { VelaskGallery } from './_components/VelaskGallery';
import { VelaskLocation } from './_components/VelaskLocation';
import { VelaskPricing } from './_components/VelaskPricing';
import { VelaskContactForm } from './_components/VelaskContactForm';
import { VelaskFAQ } from './_components/VelaskFAQ';
import { supabaseFetch } from '@/utils/supabase/client';
import { mergeApiUnits, mergeApiPricingRows, type ApiUnit } from './_data/velask-data';

const ds = designSystem;

export default function VelaskPage() {
  const [isMobile, setIsMobile] = useState(false);
  const [selectedTypology, setSelectedTypology] = useState('');
  const [apiUnits, setApiUnits] = useState<ApiUnit[]>([]);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < parseInt(ds.breakpoints.lg));
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Fetch units from API (public endpoint, no admin header)
  useEffect(() => {
    supabaseFetch('units', {}, 2)
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        if (data?.units?.length) setApiUnits(data.units);
      })
      .catch(() => {
        // Silently fall back to hardcoded data
      });
  }, []);

  const dynamicUnits = useMemo(() => mergeApiUnits(apiUnits), [apiUnits]);
  const dynamicPricingRows = useMemo(() => mergeApiPricingRows(apiUnits), [apiUnits]);

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
        <VelaskProjeto isMobile={isMobile} />
      </div>

      <div id="bairro">
        <VelaskBairro isMobile={isMobile} />
      </div>

      <VelaskPlantas isMobile={isMobile} onScrollToForm={scrollToForm} unitsData={dynamicUnits} />

      <VelaskInteriores isMobile={isMobile} />

      <div id="galeria">
        <VelaskGallery isMobile={isMobile} />
      </div>

      <div id="localizacao">
        <VelaskLocation isMobile={isMobile} />
      </div>

      <div id="precos">
        <VelaskPricing isMobile={isMobile} onSelectTypology={setSelectedTypology} rows={dynamicPricingRows} />
      </div>

      <div id="contacto">
        <VelaskContactForm isMobile={isMobile} selectedTypology={selectedTypology} />
      </div>

      <div id="faq">
        <VelaskFAQ />
      </div>

      <Footer />
    </>
  );
}
