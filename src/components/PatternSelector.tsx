'use client';

import React, { useState } from 'react';
import { BackgroundPattern } from './BackgroundPatterns';
import { designSystem } from './design-system';
import { Check } from './icons';

type PatternType = 'dots' | 'grid' | 'diagonal' | 'hexagon' | 'waves' | 'blueprint' | 'minimal' | 'gradient-mesh';

interface PatternOption {
  id: PatternType;
  name: string;
  description: string;
}

export function PatternSelector() {
  const [selectedPattern, setSelectedPattern] = useState<PatternType>('minimal');

  const patterns: PatternOption[] = [
    {
      id: 'minimal',
      name: 'Minimal',
      description: 'Pontos espaçados - elegante e discreto (PADRÃO ATUAL)',
    },
    {
      id: 'dots',
      name: 'Dots',
      description: 'Pontos minimalistas - clean e moderno',
    },
    {
      id: 'grid',
      name: 'Grid',
      description: 'Grid quadriculado - estruturado e técnico',
    },
    {
      id: 'diagonal',
      name: 'Diagonal',
      description: 'Linhas diagonais - dinâmico e sofisticado',
    },
    {
      id: 'hexagon',
      name: 'Hexagon',
      description: 'Hexágonos - arquitetônico e geométrico',
    },
    {
      id: 'waves',
      name: 'Waves',
      description: 'Ondas suaves - orgânico e fluido',
    },
    {
      id: 'blueprint',
      name: 'Blueprint',
      description: 'Blueprint técnico - profissional e preciso',
    },
    {
      id: 'gradient-mesh',
      name: 'Gradient Mesh',
      description: 'Apenas gradientes - minimalista absoluto',
    },
  ];

  const copyCode = (pattern: PatternType) => {
    const code = `<BackgroundPattern pattern="${pattern}" opacity={0.08} color="#ffffff" />`;
    navigator.clipboard.writeText(code);
  };

  return (
    <div className="min-h-screen py-20" style={{ background: designSystem.colors.neutral[50] }}>
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1
            style={{
              fontSize: designSystem.typography.fontSize['4xl'],
              fontWeight: designSystem.typography.fontWeight.black,
              color: designSystem.colors.brand.primary,
              marginBottom: designSystem.spacing[4],
            }}
          >
            Escolha o Padrão de Fundo
          </h1>
          <p
            style={{
              fontSize: designSystem.typography.fontSize.lg,
              color: designSystem.colors.neutral[600],
            }}
          >
            Clique em um padrão para ver o código. Substitua o <code>pattern</code> no Hero.tsx e Footer.tsx
          </p>
        </div>

        {/* Pattern Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {patterns.map((pattern) => (
            <div
              key={pattern.id}
              onClick={() => {
                setSelectedPattern(pattern.id);
                copyCode(pattern.id);
              }}
              className="cursor-pointer group"
            >
              {/* Preview */}
              <div
                className="relative h-48 rounded-2xl overflow-hidden mb-4 border-4 transition-all duration-300"
                style={{
                  background: designSystem.colors.gradients.hero,
                  borderColor: selectedPattern === pattern.id 
                    ? designSystem.colors.brand.secondary 
                    : 'transparent',
                  boxShadow: selectedPattern === pattern.id
                    ? `0 0 30px ${designSystem.helpers.hexToRgba(designSystem.colors.brand.secondary, 0.3)}`
                    : 'none',
                }}
              >
                <BackgroundPattern pattern={pattern.id} opacity={0.1} color="#ffffff" />
                
                {/* Overlay */}
                <div className="relative z-10 flex flex-col items-center justify-center h-full">
                  {selectedPattern === pattern.id && (
                    <div
                      className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center"
                      style={{
                        background: designSystem.colors.brand.secondary,
                      }}
                    >
                      <Check size={16} style={{ color: designSystem.colors.neutral.white }} />
                    </div>
                  )}
                  
                  <span
                    className="px-4 py-2 rounded-lg backdrop-blur-sm transition-all duration-300 group-hover:scale-110"
                    style={{
                      color: designSystem.colors.neutral.white,
                      fontWeight: designSystem.typography.fontWeight.bold,
                      fontSize: designSystem.typography.fontSize.xl,
                      background: designSystem.helpers.hexToRgba(designSystem.colors.neutral[900], 0.3),
                    }}
                  >
                    {pattern.name}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="text-center">
                <p
                  style={{
                    fontSize: designSystem.typography.fontSize.sm,
                    color: designSystem.colors.neutral[600],
                  }}
                >
                  {pattern.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Code Display */}
        {selectedPattern && (
          <div
            className="p-8 rounded-2xl"
            style={{
              background: designSystem.colors.neutral[900],
              border: `2px solid ${designSystem.colors.brand.secondary}`,
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3
                style={{
                  fontSize: designSystem.typography.fontSize.xl,
                  fontWeight: designSystem.typography.fontWeight.bold,
                  color: designSystem.colors.neutral.white,
                }}
              >
                Código copiado! Use em Hero.tsx e Footer.tsx:
              </h3>
              <span
                className="px-4 py-2 rounded-lg"
                style={{
                  background: designSystem.colors.brand.secondary,
                  color: designSystem.colors.neutral.white,
                  fontSize: designSystem.typography.fontSize.sm,
                  fontWeight: designSystem.typography.fontWeight.semibold,
                }}
              >
                Copiado ✓
              </span>
            </div>
            <pre
              className="overflow-x-auto"
              style={{
                fontSize: designSystem.typography.fontSize.base,
                color: designSystem.colors.brand.accent,
                fontFamily: designSystem.typography.fontFamily.mono,
              }}
            >
              {`<BackgroundPattern 
  pattern="${selectedPattern}" 
  opacity={0.08} 
  color="#ffffff" 
/>`}
            </pre>
          </div>
        )}

        {/* Instructions */}
        <div
          className="mt-12 p-8 rounded-2xl"
          style={{
            background: designSystem.colors.neutral.white,
            border: `1px solid ${designSystem.helpers.hexToRgba(designSystem.colors.brand.primary, 0.1)}`,
          }}
        >
          <h3
            className="mb-4"
            style={{
              fontSize: designSystem.typography.fontSize['2xl'],
              fontWeight: designSystem.typography.fontWeight.bold,
              color: designSystem.colors.brand.primary,
            }}
          >
            Como usar:
          </h3>
          <ol className="space-y-3">
            <li style={{ color: designSystem.colors.neutral[600] }}>
              <strong style={{ color: designSystem.colors.brand.primary }}>1.</strong> Clique no padrão que você gosta
            </li>
            <li style={{ color: designSystem.colors.neutral[600] }}>
              <strong style={{ color: designSystem.colors.brand.primary }}>2.</strong> O código é copiado automaticamente
            </li>
            <li style={{ color: designSystem.colors.neutral[600] }}>
              <strong style={{ color: designSystem.colors.brand.primary }}>3.</strong> Substitua o <code>pattern</code> em <strong>Hero.tsx</strong> (linha ~49) e <strong>Footer.tsx</strong> (linha ~21)
            </li>
            <li style={{ color: designSystem.colors.neutral[600] }}>
              <strong style={{ color: designSystem.colors.brand.primary }}>4.</strong> Ajuste a <code>opacity</code> se quiser mais ou menos visibilidade (0.05 = muito sutil, 0.15 = mais visível)
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}
