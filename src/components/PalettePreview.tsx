import React from 'react';
import { motion } from 'motion/react';
import { TrendingUp, Shield, BarChart3 } from './icons';

// OPÇÃO 1: DOURADO LUXURY
const palette1 = {
  name: 'Azul Petróleo + Dourado Luxury',
  description: 'Elegância exclusiva para alto padrão',
  colors: {
    primary: '#1A3E5C',
    secondary: '#B8956A',
    accent: '#C9A872',
    neutral: '#F9FAFC',
  },
  gradients: {
    hero: 'linear-gradient(135deg, #1A3E5C 0%, #2d4a5f 50%, #3d5a6f 100%)',
    accent: 'linear-gradient(135deg, #B8956A 0%, #C9A872 100%)',
    card: 'linear-gradient(135deg, #1A3E5C 0%, #B8956A 100%)',
  }
};

// OPÇÃO 2: CINZA AZULADO PREMIUM
const palette2 = {
  name: 'Azul Petróleo + Cinza Azulado Corporate',
  description: 'Sofisticação corporativa moderna',
  colors: {
    primary: '#1A3E5C',
    secondary: '#6B7C93',
    accent: '#8396AD',
    neutral: '#FAFBFC',
  },
  gradients: {
    hero: 'linear-gradient(135deg, #1A3E5C 0%, #2d4a5f 50%, #6B7C93 100%)',
    accent: 'linear-gradient(135deg, #6B7C93 0%, #8396AD 100%)',
    card: 'linear-gradient(135deg, #1A3E5C 0%, #6B7C93 100%)',
  }
};

// OPÇÃO 3: TERRACOTA BOUTIQUE
const palette3 = {
  name: 'Azul Petróleo + Terracota Boutique',
  description: 'Contemporâneo e acolhedor premium',
  colors: {
    primary: '#1A3E5C',
    secondary: '#C07B5B',
    accent: '#D69680',
    neutral: '#FAF9F7',
  },
  gradients: {
    hero: 'linear-gradient(135deg, #1A3E5C 0%, #2d4a5f 50%, #4d5a68 100%)',
    accent: 'linear-gradient(135deg, #C07B5B 0%, #D69680 100%)',
    card: 'linear-gradient(135deg, #1A3E5C 0%, #C07B5B 100%)',
  }
};

const palettes = [palette1, palette2, palette3];

export function PalettePreview() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#F5F6F8', 
      padding: '4rem 2rem' 
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h1 style={{ 
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 900,
            color: '#1A3E5C',
            marginBottom: '1rem',
            letterSpacing: '-0.02em',
          }}>
            Escolha sua Paleta HABTA
          </h1>
          <p style={{ 
            fontSize: '1.25rem',
            color: '#64748b',
            maxWidth: '600px',
            margin: '0 auto',
          }}>
            Três opções premium mantendo o azul petróleo do logo
          </p>
        </div>

        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
          gap: '2rem',
          marginBottom: '4rem',
        }}>
          {palettes.map((palette, idx) => (
            <motion.div
              key={palette.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              whileHover={{ y: -8, scale: 1.02 }}
              style={{
                background: '#ffffff',
                borderRadius: '2rem',
                padding: '2rem',
                boxShadow: '0 10px 40px rgba(26, 62, 92, 0.12)',
                border: '1px solid rgba(26, 62, 92, 0.08)',
              }}
            >
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: palette.colors.primary,
                  marginBottom: '0.5rem',
                }}>
                  Opção {idx + 1}
                </h3>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#64748b',
                  lineHeight: 1.6,
                }}>
                  {palette.description}
                </p>
              </div>

              {/* Hero Gradient Sample */}
              <div style={{
                height: '120px',
                borderRadius: '1rem',
                background: palette.gradients.hero,
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                fontSize: '1.5rem',
                fontWeight: 700,
              }}>
                HABTA
              </div>

              {/* Color Swatches */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '0.75rem',
                marginBottom: '1.5rem',
              }}>
                <div>
                  <div style={{
                    height: '60px',
                    background: palette.colors.primary,
                    borderRadius: '0.75rem',
                    marginBottom: '0.5rem',
                  }} />
                  <p style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    Primary<br/>
                    <code style={{ fontSize: '0.7rem' }}>{palette.colors.primary}</code>
                  </p>
                </div>
                <div>
                  <div style={{
                    height: '60px',
                    background: palette.colors.secondary,
                    borderRadius: '0.75rem',
                    marginBottom: '0.5rem',
                  }} />
                  <p style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    Secondary<br/>
                    <code style={{ fontSize: '0.7rem' }}>{palette.colors.secondary}</code>
                  </p>
                </div>
              </div>

              {/* Sample Button with Accent Gradient */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  width: '100%',
                  padding: '0.875rem 1.5rem',
                  borderRadius: '0.75rem',
                  background: palette.gradients.accent,
                  color: '#ffffff',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  marginBottom: '0.75rem',
                }}
              >
                Ver Projetos
              </motion.button>

              {/* Sample Card Preview */}
              <div style={{
                padding: '1.25rem',
                background: palette.colors.neutral,
                borderRadius: '1rem',
                border: `1px solid ${palette.colors.primary}15`,
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  marginBottom: '0.75rem',
                }}>
                  <div style={{
                    padding: '0.625rem',
                    borderRadius: '0.5rem',
                    background: `${palette.colors.secondary}20`,
                  }}>
                    <TrendingUp size={20} style={{ color: palette.colors.secondary }} />
                  </div>
                  <span style={{
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: palette.colors.primary,
                  }}>
                    Sample Card
                  </span>
                </div>
                <p style={{
                  fontSize: '0.8rem',
                  color: '#64748b',
                  lineHeight: 1.5,
                }}>
                  Pré-visualização de como os elementos ficam com esta paleta
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          style={{
            background: '#ffffff',
            borderRadius: '2rem',
            padding: '2rem',
            boxShadow: '0 10px 40px rgba(26, 62, 92, 0.12)',
          }}
        >
          <h2 style={{
            fontSize: '1.75rem',
            fontWeight: 700,
            color: '#1A3E5C',
            marginBottom: '1.5rem',
            textAlign: 'center',
          }}>
            Comparação de Personalidade
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
          }}>
            <div style={{ padding: '1.5rem', background: '#FEF9F5', borderRadius: '1rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#B8956A', marginBottom: '0.75rem' }}>
                🟡 Opção 1 - Dourado
              </h3>
              <ul style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.8, paddingLeft: '1.25rem' }}>
                <li>Mais exclusivo e luxury</li>
                <li>Alto padrão evidente</li>
                <li>Para clientes premium</li>
                <li>Diferenciação visual forte</li>
              </ul>
            </div>

            <div style={{ padding: '1.5rem', background: '#F8FAFB', borderRadius: '1rem', border: '2px solid #1A3E5C20' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#6B7C93', marginBottom: '0.75rem' }}>
                ⚪ Opção 2 - Cinza Azulado ⭐
              </h3>
              <ul style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.8, paddingLeft: '1.25rem' }}>
                <li><strong>Corporativo sofisticado</strong></li>
                <li>Profissional e moderno</li>
                <li>Tech-forward elegante</li>
                <li><strong>Recomendado</strong></li>
              </ul>
            </div>

            <div style={{ padding: '1.5rem', background: '#FBF8F6', borderRadius: '1rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#C07B5B', marginBottom: '0.75rem' }}>
                🧡 Opção 3 - Terracota
              </h3>
              <ul style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.8, paddingLeft: '1.25rem' }}>
                <li>Mais acolhedor</li>
                <li>Boutique contemporâneo</li>
                <li>Humanizado e warm</li>
                <li>Cliente final friendly</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Instructions */}
        <div style={{
          marginTop: '3rem',
          padding: '2rem',
          background: 'linear-gradient(135deg, #1A3E5C 0%, #2d4a5f 100%)',
          borderRadius: '1.5rem',
          color: '#ffffff',
          textAlign: 'center',
        }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>
            Como escolher?
          </h3>
          <p style={{ fontSize: '1rem', opacity: 0.9, maxWidth: '700px', margin: '0 auto' }}>
            Me diga qual opção você prefere (1, 2 ou 3) e vou atualizar todo o design system 
            e todos os componentes do site para usar essa paleta de forma consistente.
          </p>
        </div>
      </div>
    </div>
  );
}
