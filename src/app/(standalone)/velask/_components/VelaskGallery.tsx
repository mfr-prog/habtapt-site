'use client';

import { useState, useCallback } from 'react';
import { Container } from '@/components/Container';
import { Section } from '@/components/Section';
import { motion } from 'motion/react';
import { useInView } from '@/components/useInView';
import { Eye } from '@/components/icons';
import { galleryItems, allImages } from '../_data/velask-data';
import { c, t, sp, ds, sectionBadge, sectionTitle, bodyText, ctaButtonPrimary } from './velask-styles';
import { VelaskLightbox } from './VelaskLightbox';

interface VelaskGalleryProps {
  isMobile: boolean;
}

export function VelaskGallery({ isMobile }: VelaskGalleryProps) {
  const galInView = useInView({ threshold: 0.1 });
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxImages, setLightboxImages] = useState(galleryItems);

  const openLightbox = (i: number) => {
    setLightboxImages(galleryItems);
    setSelectedIndex(i);
    setLightboxOpen(true);
  };

  const openFullGallery = () => {
    setLightboxImages(allImages);
    setSelectedIndex(0);
    setLightboxOpen(true);
  };

  const handleNext = useCallback(() => {
    setSelectedIndex((prev) => (prev + 1) % lightboxImages.length);
  }, [lightboxImages.length]);

  const handlePrev = useCallback(() => {
    setSelectedIndex((prev) => (prev - 1 + lightboxImages.length) % lightboxImages.length);
  }, [lightboxImages.length]);

  // Asymmetric grid: row of 1 large + 2 small
  const rows: { src: string; alt: string; caption: string; big: boolean; idx: number }[][] = [];
  let i = 0;
  while (i < galleryItems.length) {
    const row: typeof rows[0] = [];
    row.push({ ...galleryItems[i], big: true, idx: i });
    i++;
    if (i < galleryItems.length) { row.push({ ...galleryItems[i], big: false, idx: i }); i++; }
    if (i < galleryItems.length) { row.push({ ...galleryItems[i], big: false, idx: i }); i++; }
    rows.push(row);
  }

  return (
    <Section background="muted">
      <Container>
        <div ref={galInView.ref} className="text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={galInView.isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
            <span style={sectionBadge(true)}>Galeria</span>
          </motion.div>

          <motion.h2 initial={{ opacity: 0, y: 30 }} animate={galInView.isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.1 }} style={{ ...sectionTitle, marginBottom: sp[4] }}>
            Ambientes e inspiração
          </motion.h2>

          <motion.p initial={{ opacity: 0, y: 30 }} animate={galInView.isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.2 }} style={{ ...bodyText, maxWidth: '42rem', margin: `0 auto ${sp[12]}` }}>
            Explore o conceito de interiores e exteriores. <em>(Imagens 3D ilustrativas.)</em>
          </motion.p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: sp[4] }}>
            {rows.map((row, ri) => (
              <div
                key={ri}
                className="grid gap-4"
                style={{
                  gridTemplateColumns: isMobile
                    ? '1fr'
                    : row.length === 3
                      ? (ri % 2 === 0 ? '2fr 1fr 1fr' : '1fr 1fr 2fr')
                      : row.length === 2 ? '2fr 1fr' : '1fr',
                }}
              >
                {row.map((item) => (
                  <motion.div
                    key={item.idx}
                    className="group relative overflow-hidden cursor-pointer rounded-3xl"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={galInView.isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.5, delay: 0.3 + item.idx * 0.06 }}
                    style={{ minHeight: item.big && !isMobile ? 320 : 220 }}
                    whileHover={isMobile ? {} : { scale: 1.02 }}
                    onClick={() => openLightbox(item.idx)}
                  >
                    <img
                      src={item.src}
                      alt={item.alt}
                      loading="lazy"
                      width={1600}
                      height={893}
                      decoding="async"
                      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div
                      className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ background: 'rgba(26,62,92,0.3)' }}
                    >
                      <Eye style={{ width: 32, height: 32, color: '#fff' }} />
                    </div>
                    <div className="absolute" style={{ inset: '0', top: 'auto', padding: sp[4], background: 'linear-gradient(to top, rgba(26,62,92,0.75), transparent)' }}>
                      <p style={{ color: c.brand.secondaryLight, fontSize: t.fontSize.sm, fontWeight: t.fontWeight.semibold, lineHeight: t.lineHeight.snug }}>{item.caption}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={galInView.isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.8 }} style={{ marginTop: sp[10] }}>
            <motion.button
              onClick={openFullGallery}
              style={{ ...ctaButtonPrimary, background: c.gradients.primary, color: '#fff', boxShadow: ds.shadows.primaryHover }}
              whileHover={isMobile ? {} : { scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Eye style={{ width: 18, height: 18 }} /> Ver todas as fotografias
            </motion.button>
          </motion.div>
        </div>
      </Container>

      <VelaskLightbox
        images={lightboxImages}
        selectedIndex={selectedIndex}
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNext={handleNext}
        onPrev={handlePrev}
      />
    </Section>
  );
}
