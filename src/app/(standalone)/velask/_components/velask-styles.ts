import React from 'react';
import { designSystem } from '@/components/design-system';

const ds = designSystem;
const c = ds.colors;
const t = ds.typography;
const sp = ds.spacing;

export { ds, c, t, sp };

export const sectionBadge = (gold = false): React.CSSProperties => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: sp[2],
  padding: `${sp[3]} ${sp[5]}`,
  borderRadius: ds.borderRadius.full,
  background: gold ? 'rgba(184,149,106,0.08)' : 'rgba(26,62,92,0.08)',
  border: `1px solid ${gold ? 'rgba(184,149,106,0.15)' : 'rgba(26,62,92,0.15)'}`,
  fontSize: t.fontSize.sm,
  fontWeight: t.fontWeight.semibold,
  color: gold ? c.brand.secondary : c.brand.primary,
  textTransform: 'uppercase',
  letterSpacing: t.letterSpacing.wider,
  marginBottom: sp[6],
});

export const sectionTitle: React.CSSProperties = {
  fontSize: t.fontSize['4xl'],
  fontWeight: t.fontWeight.black,
  color: c.brand.primary,
  letterSpacing: t.letterSpacing.tight,
  lineHeight: t.lineHeight.tight,
  marginBottom: sp[4],
};

export const bodyText: React.CSSProperties = {
  fontSize: t.fontSize.lg,
  fontWeight: t.fontWeight.normal,
  color: c.neutral[600],
  lineHeight: t.lineHeight.relaxed,
};

export const cardBase: React.CSSProperties = {
  background: c.neutral.white,
  borderRadius: ds.borderRadius['3xl'],
  border: '1px solid rgba(26,62,92,0.12)',
  boxShadow: ds.shadows.md,
  transition: ds.animations.transition.base,
};

export const ctaButtonPrimary: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: sp[2],
  padding: `${sp[5]} ${sp[10]}`,
  borderRadius: ds.borderRadius.full,
  background: c.gradients.secondary,
  color: c.neutral.white,
  fontWeight: t.fontWeight.semibold,
  fontSize: t.fontSize.base,
  boxShadow: '0 10px 40px rgba(184,149,106,0.3)',
  cursor: 'pointer',
  border: 'none',
};

export const ctaButtonOutline: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: sp[2],
  padding: `${sp[5]} ${sp[10]}`,
  borderRadius: ds.borderRadius.full,
  background: 'rgba(255,255,255,0.1)',
  color: c.neutral.white,
  fontWeight: t.fontWeight.semibold,
  fontSize: t.fontSize.base,
  border: '2px solid rgba(255,255,255,0.3)',
  backdropFilter: 'blur(12px)',
  cursor: 'pointer',
};

export const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: `${sp[3]} ${sp[4]}`,
  borderRadius: ds.borderRadius.xl,
  background: 'rgba(255,255,255,0.08)',
  border: '1px solid rgba(255,255,255,0.15)',
  color: '#fff',
  fontSize: t.fontSize.base,
  outline: 'none',
};

export const anim = (i: number) => ({
  initial: { opacity: 0, y: 30 } as const,
  animate: { opacity: 1, y: 0 } as const,
  transition: { duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] as const },
});
