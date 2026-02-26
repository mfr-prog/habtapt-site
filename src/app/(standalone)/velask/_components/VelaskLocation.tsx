'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import { Container } from '@/components/Container';
import { Section } from '@/components/Section';
import { motion } from 'motion/react';
import { useInView } from '@/components/useInView';
import { ChevronDown } from '@/components/icons';
import { locationAccordion } from '../_data/velask-data';
import { c, t, sp, sectionBadge, sectionTitle, bodyText } from './velask-styles';

const VELASK_LAT = 41.1635;
const VELASK_LNG = -8.5955;

interface VelaskLocationProps {
  isMobile: boolean;
}

export function VelaskLocation({ isMobile }: VelaskLocationProps) {
  const locInView = useInView({ threshold: 0.1 });
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const poiLayerRef = useRef<any>(null);
  const leafletRef = useRef<any>(null);

  const updateMarkers = useCallback((categoryIndex: number | null) => {
    const L = leafletRef.current;
    const map = mapInstanceRef.current;
    const poiLayer = poiLayerRef.current;
    if (!L || !map || !poiLayer) return;

    poiLayer.clearLayers();

    if (categoryIndex === null) {
      map.setView([VELASK_LAT, VELASK_LNG], 16, { animate: true });
      return;
    }

    const cat = locationAccordion[categoryIndex];
    if (!cat?.pois?.length) {
      map.setView([VELASK_LAT, VELASK_LNG], 16, { animate: true });
      return;
    }

    cat.pois.forEach((poi, i) => {
      const poiIcon = L.divIcon({
        className: '',
        html: `<div style="width:28px;height:28px;background:${cat.color};border-radius:50%;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#fff">${String(i + 1).padStart(2, '0')}</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      L.marker([poi.lat, poi.lng], { icon: poiIcon })
        .addTo(poiLayer)
        .bindTooltip(poi.label, {
          direction: 'top',
          offset: [0, -16],
          className: 'velask-poi-tooltip',
        });
    });

    // Fit bounds to include Velask + all POIs
    const allPoints: [number, number][] = [
      [VELASK_LAT, VELASK_LNG],
      ...cat.pois.map((p) => [p.lat, p.lng] as [number, number]),
    ];
    const bounds = L.latLngBounds(allPoints);
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15, animate: true });
  }, []);

  const toggleAccordion = (i: number) => {
    const newIndex = openIndex === i ? null : i;
    setOpenIndex(newIndex);
    updateMarkers(newIndex);
  };

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const loadLeaflet = async () => {
      const L = (await import('leaflet')).default;
      leafletRef.current = L;

      // Load Leaflet CSS
      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      // Custom tooltip style
      if (!document.getElementById('velask-poi-style')) {
        const style = document.createElement('style');
        style.id = 'velask-poi-style';
        style.textContent = `.velask-poi-tooltip { font-family: Inter, system-ui, sans-serif; font-size: 12px; font-weight: 600; padding: 4px 10px; border-radius: 6px; box-shadow: 0 2px 8px rgba(0,0,0,0.15); }`;
        document.head.appendChild(style);
      }

      const map = L.map(mapRef.current!, {
        scrollWheelZoom: false,
        zoomControl: true,
      }).setView([VELASK_LAT, VELASK_LNG], 16);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
        maxZoom: 19,
      }).addTo(map);

      // Velask home marker
      const icon = L.divIcon({
        className: '',
        html: `<div style="width:32px;height:32px;background:#1A3E5C;border-radius:50%;border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        </div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
      });

      L.marker([VELASK_LAT, VELASK_LNG], { icon }).addTo(map)
        .bindPopup('<strong>VELASK</strong><br/>Rua Manuel Carqueja, 259<br/>Porto');

      // POI layer group
      const poiLayer = L.layerGroup().addTo(map);
      poiLayerRef.current = poiLayer;
      mapInstanceRef.current = map;

      // Show initial category markers (Transportes is open by default)
      updateMarkers(0);
    };

    loadLeaflet();
  }, [updateMarkers]);

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
            Campanhã coloca-o a minutos de tudo o que importa.
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
                      <span style={{
                        fontSize: t.fontSize.sm,
                        fontWeight: t.fontWeight.semibold,
                        color: openIndex === i ? cat.color : c.neutral[900],
                        transition: 'color 0.2s',
                      }}>{cat.title}</span>
                    </span>
                    <ChevronDown style={{
                      width: 18,
                      height: 18,
                      color: openIndex === i ? cat.color : c.neutral[500],
                      transition: 'transform 0.25s, color 0.2s',
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
