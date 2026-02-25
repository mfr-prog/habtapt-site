'use client';

import { useState, useCallback } from 'react';
import { Container } from '@/components/Container';
import { Section } from '@/components/Section';
import { motion } from 'motion/react';
import { useInView } from '@/components/useInView';
import { Eye } from '@/components/icons';
import { galleryItems } from '../_data/velask-data';
import { c, t, sp, sectionBadge, sectionTitle, bodyText } from './velask-styles';
import { VelaskLightbox } from './VelaskLightbox';

interface VelaskGalleryProps {
  isMobile: boolean;
}

export function VelaskGallery({ isMobile }: VelaskGalleryProps) {
  const galInView = useInView({ threshold: 0.1 });
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const openLightbox = (i: number) => {
    setSelectedIndex(i);
    setLightboxOpen(true);
  };

  const handleNext = useCallback(() => {
    setSelectedIndex((prev) => (prev + 1) % galleryItems.length);
  }, []);

  const handlePrev = useCallback(() => {
    setSelectedIndex((prev) => (prev - 1 + galleryItems.length) % galleryItems.length);
  }, []);

  return (
    <Section background="muted">
      <Container>
        <div ref={galInView.ref} className="text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={galInView.isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
            <span style={sectionBadge(true)}>Galeria</span>
          </motion.div>

          <motion.h2 initial={{ opacity: 0, y: 30 }} animate={galInView.isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.1 }} style={{ ...sectionTitle, marginBottom: sp[4] }}>
            Ambientes e inspiracao
          </motion.h2>

          <motion.p initial={{ opacity: 0, y: 30 }} animate={galInView.isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.2 }} style={{ ...bodyText, maxWidth: '42rem', margin: `0 auto ${sp[12]}` }}>
            Explore o conceito de interiores e exteriores. <em>(Imagens 3D ilustrativas.)</em>
          </motion.p>

          <div className="grid grid-cols-2 gap-4" style={{ gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)' }}>
            {galleryItems.map((item, i) => (
              <motion.div
                key={i}
                className="group relative overflow-hidden cursor-pointer rounded-3xl"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={galInView.isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.08 }}
                style={{
                  minHeight: i === 0 && !isMobile ? 320 : 180,
                  gridColumn: i === 0 && !isMobile ? 'span 2' : undefined,
                  gridRow: i === 0 && !isMobile ? 'span 2' : undefined,
                }}
                whileHover={isMobile ? {} : { scale: 1.02 }}
                onClick={() => openLightbox(i)}
              >
                <img
                  src={item.src}
                  alt={item.alt}
                  loading="lazy"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
                <div
                  className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: 'rgba(26,62,92,0.3)' }}
                >
                  <Eye style={{ width: 32, height: 32, color: '#fff' }} />
                </div>
                <div className="absolute" style={{ inset: '0', top: 'auto', padding: sp[4], background: 'linear-gradient(to top, rgba(26,62,92,0.75), transparent)' }}>
                  <p style={{ color: '#fff', fontSize: t.fontSize.xs, fontWeight: t.fontWeight.medium, lineHeight: t.lineHeight.snug }}>{item.alt}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Container>

      <VelaskLightbox
        images={galleryItems}
        selectedIndex={selectedIndex}
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNext={handleNext}
        onPrev={handlePrev}
      />
    </Section>
  );
}
