'use client';

import React, { useState } from 'react';
import { LogoPattern } from './LogoPatterns';
import { designSystem } from './design-system';
import { Check } from './icons';

type LogoPatternType = 
  | 'arrows' 
  | 'arrows-grid' 
  | 'arrows-diagonal' 
  | 'arrows-scattered' 
  | 'vertical-lines' 
  | 'geometric' 
  | 'minimal-arrows' 
  | 'corner-arrows'
  | 'arrows-small'
  | 'arrows-tiny'
  | 'arrows-large'
  | 'arrows-sparse'
  | 'arrows-vertical'
  | 'arrows-offset'
  | 'arrows-dense-grid'
  | 'arrows-triple'
  | 'lines-thin'
  | 'lines-thick'
  | 'mixed-pattern'
  | 'architectural';

interface PatternOption {
  id: LogoPatternType;
  name: string;
  description: string;
  recommendedOpacity: number;
  category: 'elegant' | 'minimal' | 'dense' | 'lines' | 'creative';
}

export function LogoPatternSelector() {
  const [selectedPattern, setSelectedPattern] = useState<LogoPatternType>('minimal-arrows');
  const [copiedPattern, setCopiedPattern] = useState<LogoPatternType | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const patterns: PatternOption[] = [
    // ELEGANTES E ESPAÇADAS
    {
      id: 'minimal-arrows',
      name: 'Minimal Arrows',
      description: 'Setas grandes e espaçadas - muito elegante ⭐',
      recommendedOpacity: 0.06,
      category: 'elegant',
    },
    {
      id: 'arrows-scattered',
      name: 'Scattered Arrows',
      description: 'Setas dispersas - clean e discreto',
      recommendedOpacity: 0.08,
      category: 'elegant',
    },
    {
      id: 'arrows-large',
      name: 'Large Arrows',
      description: 'Setas grandes - impacto visual forte',
      recommendedOpacity: 0.05,
      category: 'elegant',
    },
    {
      id: 'arrows-sparse',
      name: 'Sparse Arrows',
      description: 'Setas bem espaçadas - luxuoso ⭐',
      recommendedOpacity: 0.07,
      category: 'elegant',
    },
    {
      id: 'corner-arrows',
      name: 'Corner Arrows',
      description: 'Setas nos cantos - subtil e sofisticado',
      recommendedOpacity: 0.05,
      category: 'elegant',
    },
    
    // MINIMALISTAS
    {
      id: 'vertical-lines',
      name: 'Vertical Lines',
      description: 'Linhas verticais - minimalista',
      recommendedOpacity: 0.08,
      category: 'minimal',
    },
    {
      id: 'lines-thin',
      name: 'Thin Lines',
      description: 'Linhas finas - ultra clean ⭐',
      recommendedOpacity: 0.09,
      category: 'minimal',
    },
    {
      id: 'lines-thick',
      name: 'Thick Lines',
      description: 'Linhas grossas - presença forte',
      recommendedOpacity: 0.06,
      category: 'minimal',
    },
    
    // PEQUENAS E DENSAS
    {
      id: 'arrows-small',
      name: 'Small Arrows',
      description: 'Setas pequenas - textura sutil',
      recommendedOpacity: 0.08,
      category: 'dense',
    },
    {
      id: 'arrows-tiny',
      name: 'Tiny Arrows',
      description: 'Setas minúsculas - padrão denso ⭐',
      recommendedOpacity: 0.09,
      category: 'dense',
    },
    {
      id: 'arrows-triple',
      name: 'Triple Arrows',
      description: 'Três setas - ritmo repetitivo',
      recommendedOpacity: 0.08,
      category: 'dense',
    },
    {
      id: 'arrows-dense-grid',
      name: 'Dense Grid',
      description: 'Grid denso de setas - textura rica',
      recommendedOpacity: 0.07,
      category: 'dense',
    },
    
    // CRIATIVOS E ESTRUTURADOS
    {
      id: 'arrows',
      name: 'Arrow Lines',
      description: 'Setas em linha - ritmo horizontal',
      recommendedOpacity: 0.07,
      category: 'creative',
    },
    {
      id: 'arrows-grid',
      name: 'Arrow Grid',
      description: 'Setas em grid - estruturado',
      recommendedOpacity: 0.06,
      category: 'creative',
    },
    {
      id: 'arrows-diagonal',
      name: 'Arrow Diagonal',
      description: 'Setas em diagonal - dinâmico',
      recommendedOpacity: 0.07,
      category: 'creative',
    },
    {
      id: 'arrows-vertical',
      name: 'Vertical Arrows',
      description: 'Setas verticais - altura e grandeza',
      recommendedOpacity: 0.07,
      category: 'creative',
    },
    {
      id: 'arrows-offset',
      name: 'Offset Arrows',
      description: 'Setas alternadas - movimento',
      recommendedOpacity: 0.08,
      category: 'creative',
    },
    {
      id: 'mixed-pattern',
      name: 'Mixed Pattern',
      description: 'Setas + linhas - arquitetônico ⭐',
      recommendedOpacity: 0.07,
      category: 'creative',
    },
    {
      id: 'architectural',
      name: 'Architectural',
      description: 'Padrão arquitetônico - complexo',
      recommendedOpacity: 0.06,
      category: 'creative',
    },
    {
      id: 'geometric',
      name: 'Geometric',
      description: 'Forma completa do logo - bold',
      recommendedOpacity: 0.04,
      category: 'creative',
    },
  ];

  const categories = [
    { id: 'all', name: 'Todos os Padrões', count: patterns.length },
    { id: 'elegant', name: '✨ Elegantes', count: patterns.filter(p => p.category === 'elegant').length },
    { id: 'minimal', name: '📏 Minimalistas', count: patterns.filter(p => p.category === 'minimal').length },
    { id: 'dense', name: '🔲 Densos', count: patterns.filter(p => p.category === 'dense').length },
    { id: 'creative', name: '🎨 Criativos', count: patterns.filter(p => p.category === 'creative').length },
  ];

  const filteredPatterns = selectedCategory === 'all' 
    ? patterns 
    : patterns.filter(p => p.category === selectedCategory);

  const copyCode = (pattern: PatternOption) => {
    const code = `<LogoPattern pattern="${pattern.id}" opacity={${pattern.recommendedOpacity}} color="#ffffff" />`;
    
    // Try to copy to clipboard, but don't fail if it's blocked
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(code).then(() => {
          setCopiedPattern(pattern.id);
          setTimeout(() => setCopiedPattern(null), 2000);
        }).catch(() => {
          // Fallback: just show as selected
          setCopiedPattern(pattern.id);
          setTimeout(() => setCopiedPattern(null), 3000);
        });
      } else {
        // Clipboard API not available, just show as selected
        setCopiedPattern(pattern.id);
        setTimeout(() => setCopiedPattern(null), 3000);
      }
    } catch (error) {
      // Fallback: just show as selected
      setCopiedPattern(pattern.id);
      setTimeout(() => setCopiedPattern(null), 3000);
    }
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
            🏠 Padrões com o Logo HABTA
          </h1>
          <p
            style={{
              fontSize: designSystem.typography.fontSize.lg,
              color: designSystem.colors.neutral[600],
              marginBottom: designSystem.spacing[2],
            }}
          >
            {patterns.length} padrões criados com elementos do logo - seta e formas geométricas
          </p>
          <p
            style={{
              fontSize: designSystem.typography.fontSize.sm,
              color: designSystem.colors.neutral[500],
            }}
          >
            Clique para copiar o código e substituir no Hero.tsx e Footer.tsx
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className="px-6 py-3 rounded-xl transition-all duration-300"
              style={{
                background: selectedCategory === category.id 
                  ? designSystem.colors.brand.primary 
                  : designSystem.colors.neutral.white,
                color: selectedCategory === category.id 
                  ? designSystem.colors.neutral.white 
                  : designSystem.colors.neutral[700],
                fontWeight: designSystem.typography.fontWeight.semibold,
                fontSize: designSystem.typography.fontSize.sm,
                border: `2px solid ${selectedCategory === category.id 
                  ? designSystem.colors.brand.primary 
                  : designSystem.colors.neutral[200]}`,
                boxShadow: selectedCategory === category.id 
                  ? `0 4px 12px ${designSystem.helpers.hexToRgba(designSystem.colors.brand.primary, 0.2)}`
                  : 'none',
              }}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>

        {/* Pattern Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {filteredPatterns.map((pattern) => (
            <div
              key={pattern.id}
              onClick={() => {
                setSelectedPattern(pattern.id);
                copyCode(pattern);
              }}
              className="cursor-pointer group"
            >
              {/* Preview */}
              <div
                className="relative h-56 rounded-2xl overflow-hidden mb-4 border-4 transition-all duration-300"
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
                <LogoPattern pattern={pattern.id} opacity={pattern.recommendedOpacity * 2} color="#ffffff" />
                
                {/* Overlay */}
                <div className="relative z-10 flex flex-col items-center justify-center h-full p-4">
                  {selectedPattern === pattern.id && (
                    <div
                      className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
                      style={{
                        background: copiedPattern === pattern.id 
                          ? designSystem.colors.brand.accent 
                          : designSystem.colors.brand.secondary,
                      }}
                    >
                      <Check size={18} style={{ color: designSystem.colors.neutral.white }} />
                    </div>
                  )}
                  
                  <div className="text-center">
                    <span
                      className="px-4 py-2 rounded-lg backdrop-blur-sm transition-all duration-300 group-hover:scale-110 inline-block"
                      style={{
                        color: designSystem.colors.neutral.white,
                        fontWeight: designSystem.typography.fontWeight.bold,
                        fontSize: designSystem.typography.fontSize.lg,
                        background: designSystem.helpers.hexToRgba(designSystem.colors.neutral[900], 0.4),
                      }}
                    >
                      {pattern.name}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="text-center space-y-1">
                <p
                  style={{
                    fontSize: designSystem.typography.fontSize.sm,
                    color: designSystem.colors.neutral[700],
                    fontWeight: designSystem.typography.fontWeight.medium,
                  }}
                >
                  {pattern.description}
                </p>
                <p
                  style={{
                    fontSize: designSystem.typography.fontSize.xs,
                    color: designSystem.colors.neutral[500],
                  }}
                >
                  Opacidade: {pattern.recommendedOpacity}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Code Display */}
        {selectedPattern && (
          <div
            className="p-8 rounded-2xl mb-8"
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
                {copiedPattern === selectedPattern ? '✅ Código selecionado!' : '📋 Código para usar:'}
              </h3>
              <span
                className="px-4 py-2 rounded-lg"
                style={{
                  background: copiedPattern === selectedPattern 
                    ? designSystem.colors.brand.accent 
                    : designSystem.colors.brand.secondary,
                  color: designSystem.colors.neutral.white,
                  fontSize: designSystem.typography.fontSize.sm,
                  fontWeight: designSystem.typography.fontWeight.semibold,
                }}
              >
                {copiedPattern === selectedPattern ? 'Selecionado!' : 'Copie manualmente'}
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
              {`// Importe no topo do arquivo:
import { LogoPattern } from './LogoPatterns';

// Substitua o BackgroundPattern por:
<LogoPattern 
  pattern="${selectedPattern}" 
  opacity={${patterns.find(p => p.id === selectedPattern)?.recommendedOpacity}} 
  color="#ffffff" 
/>`}
            </pre>
          </div>
        )}

        {/* Live Preview Full Width */}
        <div
          className="rounded-2xl overflow-hidden mb-8"
          style={{
            background: designSystem.colors.gradients.hero,
            border: `2px solid ${designSystem.helpers.hexToRgba(designSystem.colors.brand.secondary, 0.3)}`,
          }}
        >
          <div className="relative h-96">
            <LogoPattern 
              pattern={selectedPattern} 
              opacity={patterns.find(p => p.id === selectedPattern)?.recommendedOpacity || 0.06} 
              color="#ffffff" 
            />
            <div className="relative z-10 flex items-center justify-center h-full">
              <div className="text-center">
                <h2
                  style={{
                    fontSize: designSystem.typography.fontSize['5xl'],
                    fontWeight: designSystem.typography.fontWeight.black,
                    color: designSystem.colors.neutral.white,
                    marginBottom: designSystem.spacing[4],
                  }}
                >
                  Preview em Tamanho Real
                </h2>
                <p
                  style={{
                    fontSize: designSystem.typography.fontSize.xl,
                    color: designSystem.helpers.hexToRgba(designSystem.colors.neutral.white, 0.9),
                  }}
                >
                  Padrão: {patterns.find(p => p.id === selectedPattern)?.name}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div
          className="p-8 rounded-2xl"
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
            📝 Como usar:
          </h3>
          <ol className="space-y-3">
            <li style={{ color: designSystem.colors.neutral[600] }}>
              <strong style={{ color: designSystem.colors.brand.primary }}>1.</strong> Use os filtros acima para navegar por categoria
            </li>
            <li style={{ color: designSystem.colors.neutral[600] }}>
              <strong style={{ color: designSystem.colors.brand.primary }}>2.</strong> Clique no padrão que você gosta para ver o código abaixo
            </li>
            <li style={{ color: designSystem.colors.neutral[600] }}>
              <strong style={{ color: designSystem.colors.brand.primary }}>3.</strong> Abra o arquivo <code className="px-2 py-1 rounded" style={{ background: designSystem.colors.neutral[100] }}>Hero.tsx</code>
            </li>
            <li style={{ color: designSystem.colors.neutral[600] }}>
              <strong style={{ color: designSystem.colors.brand.primary }}>4.</strong> Adicione o import: <code className="px-2 py-1 rounded" style={{ background: designSystem.colors.neutral[100] }}>import {'{ LogoPattern }'} from './LogoPatterns';</code>
            </li>
            <li style={{ color: designSystem.colors.neutral[600] }}>
              <strong style={{ color: designSystem.colors.brand.primary }}>5.</strong> Substitua o <code className="px-2 py-1 rounded" style={{ background: designSystem.colors.neutral[100] }}>{'<BackgroundPattern />'}</code> pelo código copiado
            </li>
            <li style={{ color: designSystem.colors.neutral[600] }}>
              <strong style={{ color: designSystem.colors.brand.primary }}>6.</strong> Repita os passos 3-5 para o <code className="px-2 py-1 rounded" style={{ background: designSystem.colors.neutral[100] }}>Footer.tsx</code>
            </li>
            <li style={{ color: designSystem.colors.neutral[600], marginTop: designSystem.spacing[4], paddingTop: designSystem.spacing[4], borderTop: `1px solid ${designSystem.helpers.hexToRgba(designSystem.colors.neutral[300], 0.5)}` }}>
              💡 <strong>Dica:</strong> A opacidade recomendada já está otimizada para cada padrão, mas você pode ajustar se quiser mais ou menos visibilidade
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}
