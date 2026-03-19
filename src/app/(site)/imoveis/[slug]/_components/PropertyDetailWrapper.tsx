'use client';

import dynamic from 'next/dynamic';
import type { Project } from '@/types/project';

const PropertyDetailContent = dynamic(
  () => import('./PropertyDetailContent'),
  {
    ssr: false,
    loading: () => (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#999' }}>A carregar imóvel...</p>
      </div>
    ),
  }
);

export default function PropertyDetailWrapper({ property }: { property: Project }) {
  return <PropertyDetailContent property={property} />;
}
