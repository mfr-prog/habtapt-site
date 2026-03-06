import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'HABTA — Reabilitação Urbana e Investimento Imobiliário em Portugal';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #1A3E5C 0%, #2d4a5f 50%, #3d5a6f 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, sans-serif',
          position: 'relative',
        }}
      >
        {/* Decorative accent line */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '6px',
            background: 'linear-gradient(90deg, #B8956A 0%, #C9A872 50%, #B8956A 100%)',
          }}
        />

        {/* Logo text */}
        <div
          style={{
            fontSize: 96,
            fontWeight: 900,
            color: '#ffffff',
            letterSpacing: '-2px',
            marginBottom: '16px',
          }}
        >
          HABTA
        </div>

        {/* Divider */}
        <div
          style={{
            width: '80px',
            height: '3px',
            background: '#B8956A',
            marginBottom: '24px',
            borderRadius: '2px',
          }}
        />

        {/* Tagline */}
        <div
          style={{
            fontSize: 28,
            color: 'rgba(255, 255, 255, 0.9)',
            fontWeight: 500,
            textAlign: 'center',
            maxWidth: '800px',
            lineHeight: 1.4,
          }}
        >
          Reabilitação Urbana e Investimento Imobiliário
        </div>

        {/* Location */}
        <div
          style={{
            fontSize: 20,
            color: 'rgba(255, 255, 255, 0.6)',
            fontWeight: 400,
            marginTop: '12px',
          }}
        >
          Lisboa · Porto · Cascais
        </div>

        {/* Bottom accent */}
        <div
          style={{
            position: 'absolute',
            bottom: '32px',
            fontSize: 16,
            color: '#B8956A',
            fontWeight: 600,
            letterSpacing: '2px',
          }}
        >
          habta.eu
        </div>
      </div>
    ),
    { ...size }
  );
}
