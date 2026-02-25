'use client';

import React, { useEffect, useRef } from 'react';
import { Container } from '@/components/Container';
import { Section } from '@/components/Section';
import { motion } from 'motion/react';
import { useInView } from '@/components/useInView';
import { ChevronDown } from '@/components/icons';
import { locationAccordion } from '../_data/velask-data';
import { c, t, sp, sectionBadge, sectionTitle, bodyText } from './velask-styles';

interface VelaskLocationProps {
  isMobile: boolean;
}

export function VelaskLocation({ isMobile }: VelaskLocationProps) {
  const locInView = useInView({ threshold: 0.1 });
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<unknown>(null);

  const toggleAccordion = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const loadLeaflet = async () => {
      const L = (await import('leaflet')).default;

      // Load Leaflet CSS
      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      const map = L.map(mapRef.current!, {
        scrollWheelZoom: false,
        zoomControl: true,
      }).setView([41.1635, -8.5955], 16);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
        maxZoom: 19,
      }).addTo(map);

      const icon = L.divIcon({
        className: '',
        html: `<div style="width:32px;height:32px;background:#1A3E5C;border-radius:50%;border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        </div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
      });

      L.marker([41.1635, -8.5955], { icon }).addTo(map)
        .bindPopup('<strong>VELASK</strong><br/>Rua Manuel Carqueja, 259<br/>Porto');

      mapInstanceRef.current = map;
    };

    loadLeaflet();
  }, []);

  return (
    <Section background="white">
      <Container>
        <div ref={locInView.ref} className="text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={locInView.isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
            <span style={sectionBadge()}>Localização</span>
          </motion.div>

          <motion.h2 initial={{ opacity: 0, y: 30 }} animate={locInView.isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.1 }} style={sectionTitle}>
            Tudo ao seu alcance
          </motion.h2>

          <motion.p initial={{ opacity: 0, y: 30 }} animate={locInView.isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.15 }} style={{ ...bodyText, maxWidth: '42rem', margin: `0 auto ${sp[10]}` }}>
            Antas coloca-o a minutos de tudo o que importa.
          </motion.p>

          {/* 2-column: map (60%) + sidebar (40%) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={locInView.isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid"
            style={{
              gridTemplateColumns: isMobile ? '1fr' : '60% 40%',
              maxWidth: '64rem',
              margin: '0 auto',
              borderRadius: '1rem',
              overflow: 'hidden',
              border: `1px solid ${c.neutral[200]}`,
              background: '#fff',
            }}
          >
            {/* Map */}
            <div
              ref={mapRef}
              style={{
                height: isMobile ? 300 : 500,
                width: '100%',
                background: c.neutral[100],
              }}
            />

            {/* Sidebar accordion */}
            <div style={{
              padding: isMobile ? sp[6] : sp[8],
              overflowY: 'auto',
              maxHeight: isMobile ? 'none' : 500,
              textAlign: 'left',
            }}>
              {locationAccordion.map((cat, i) => (
                <div
                  key={i}
                  style={{ borderBottom: `1px solid ${c.neutral[200]}` }}
                >
                  <button
                    onClick={() => toggleAccordion(i)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: `${sp[4]} 0`,
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: sp[3] }}>
                      <span style={{ fontSize: t.fontSize.lg }}>{cat.icon}</span>
                      <span style={{ fontSize: t.fontSize.sm, fontWeight: t.fontWeight.semibold, color: c.neutral[900] }}>{cat.title}</span>
                    </span>
                    <ChevronDown style={{
                      width: 18,
                      height: 18,
                      color: c.neutral[500],
                      transition: 'transform 0.25s',
                      transform: openIndex === i ? 'rotate(180deg)' : 'rotate(0deg)',
                    }} />
                  </button>
                  {openIndex === i && (
                    <div style={{ paddingBottom: sp[4], paddingLeft: sp[9] }}>
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: sp[2] }}>
                        {cat.items.map((item, j) => (
                          <li key={j} style={{ fontSize: t.fontSize.xs, color: c.neutral[600], lineHeight: t.lineHeight.relaxed }}>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </Container>
    </Section>
  );
}
