import React from 'react';
import svgPaths from '../imports/svg-webkzfe3xj';

interface LogoPatternProps {
  pattern?: 
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
  opacity?: number;
  color?: string;
}

export function LogoPattern({ 
  pattern = 'arrows', 
  opacity = 0.05, 
  color = '#ffffff' 
}: LogoPatternProps) {
  
  const arrowPath = svgPaths.p25aeda00;
  
  // Criar SVGs como strings diretas
  const getSvgPattern = () => {
    switch (pattern) {
      // ORIGINAIS
      case 'arrows':
        return `<svg width="240" height="90" viewBox="0 0 240 90" xmlns="http://www.w3.org/2000/svg">
          <g transform="scale(0.25)">
            <path d="${arrowPath}" fill="${color}" />
          </g>
          <g transform="translate(80, 0) scale(0.25)">
            <path d="${arrowPath}" fill="${color}" />
          </g>
          <g transform="translate(160, 0) scale(0.25)">
            <path d="${arrowPath}" fill="${color}" />
          </g>
        </svg>`;
      
      case 'arrows-grid':
        return `<svg width="160" height="180" viewBox="0 0 160 180" xmlns="http://www.w3.org/2000/svg">
          <g transform="scale(0.2)">
            <path d="${arrowPath}" fill="${color}" />
          </g>
          <g transform="translate(80, 0) scale(0.2)">
            <path d="${arrowPath}" fill="${color}" />
          </g>
          <g transform="translate(0, 90) scale(0.2)">
            <path d="${arrowPath}" fill="${color}" />
          </g>
          <g transform="translate(80, 90) scale(0.2)">
            <path d="${arrowPath}" fill="${color}" />
          </g>
        </svg>`;
      
      case 'arrows-diagonal':
        return `<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <g transform="translate(0, 0) scale(0.2)">
            <path d="${arrowPath}" fill="${color}" />
          </g>
          <g transform="translate(100, 50) scale(0.2)">
            <path d="${arrowPath}" fill="${color}" />
          </g>
          <g transform="translate(50, 100) scale(0.2)">
            <path d="${arrowPath}" fill="${color}" />
          </g>
        </svg>`;
      
      case 'arrows-scattered':
        return `<svg width="300" height="200" viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg">
          <g transform="translate(20, 20) scale(0.15)">
            <path d="${arrowPath}" fill="${color}" />
          </g>
          <g transform="translate(180, 80) scale(0.15)">
            <path d="${arrowPath}" fill="${color}" />
          </g>
        </svg>`;
      
      case 'vertical-lines':
        return `<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
          <line x1="15" y1="0" x2="15" y2="60" stroke="${color}" stroke-width="0.5" />
          <line x1="30" y1="0" x2="30" y2="60" stroke="${color}" stroke-width="0.5" />
          <line x1="45" y1="0" x2="45" y2="60" stroke="${color}" stroke-width="0.5" />
        </svg>`;
      
      case 'geometric':
        return `<svg width="200" height="180" viewBox="0 0 474 413" xmlns="http://www.w3.org/2000/svg">
          <path d="${svgPaths.p2be92200}" fill="${color}" />
          <path d="${svgPaths.p1ada6c80}" fill="${color}" />
          <path d="${arrowPath}" fill="${color}" />
        </svg>`;
      
      case 'minimal-arrows':
        return `<svg width="300" height="150" viewBox="0 0 300 150" xmlns="http://www.w3.org/2000/svg">
          <g transform="translate(50, 30) scale(0.3)">
            <path d="${arrowPath}" fill="${color}" />
          </g>
        </svg>`;
      
      case 'corner-arrows':
        return `<svg width="400" height="400" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
          <g transform="translate(20, 20) scale(0.2)">
            <path d="${arrowPath}" fill="${color}" />
          </g>
          <g transform="translate(320, 20) scale(0.2) rotate(90 237 41.5)">
            <path d="${arrowPath}" fill="${color}" />
          </g>
          <g transform="translate(20, 320) scale(0.2) rotate(270 237 41.5)">
            <path d="${arrowPath}" fill="${color}" />
          </g>
          <g transform="translate(320, 320) scale(0.2) rotate(180 237 41.5)">
            <path d="${arrowPath}" fill="${color}" />
          </g>
        </svg>`;
      
      // NOVAS OPÇÕES - SETAS PEQUENAS
      case 'arrows-small':
        return `<svg width="120" height="60" viewBox="0 0 120 60" xmlns="http://www.w3.org/2000/svg">
          <g transform="scale(0.12)">
            <path d="${arrowPath}" fill="${color}" />
          </g>
          <g transform="translate(60, 0) scale(0.12)">
            <path d="${arrowPath}" fill="${color}" />
          </g>
        </svg>`;
      
      case 'arrows-tiny':
        return `<svg width="80" height="40" viewBox="0 0 80 40" xmlns="http://www.w3.org/2000/svg">
          <g transform="scale(0.08)">
            <path d="${arrowPath}" fill="${color}" />
          </g>
          <g transform="translate(40, 0) scale(0.08)">
            <path d="${arrowPath}" fill="${color}" />
          </g>
        </svg>`;
      
      // SETAS GRANDES E ESPAÇADAS
      case 'arrows-large':
        return `<svg width="400" height="200" viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
          <g transform="scale(0.4)">
            <path d="${arrowPath}" fill="${color}" />
          </g>
        </svg>`;
      
      case 'arrows-sparse':
        return `<svg width="500" height="300" viewBox="0 0 500 300" xmlns="http://www.w3.org/2000/svg">
          <g transform="translate(50, 50) scale(0.2)">
            <path d="${arrowPath}" fill="${color}" />
          </g>
          <g transform="translate(300, 150) scale(0.2)">
            <path d="${arrowPath}" fill="${color}" />
          </g>
        </svg>`;
      
      // SETAS EM LINHA VERTICAL
      case 'arrows-vertical':
        return `<svg width="90" height="240" viewBox="0 0 90 240" xmlns="http://www.w3.org/2000/svg">
          <g transform="scale(0.25)">
            <path d="${arrowPath}" fill="${color}" />
          </g>
          <g transform="translate(0, 80) scale(0.25)">
            <path d="${arrowPath}" fill="${color}" />
          </g>
          <g transform="translate(0, 160) scale(0.25)">
            <path d="${arrowPath}" fill="${color}" />
          </g>
        </svg>`;
      
      // SETAS OFFSET (ALTERNADAS)
      case 'arrows-offset':
        return `<svg width="160" height="120" viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg">
          <g transform="scale(0.15)">
            <path d="${arrowPath}" fill="${color}" />
          </g>
          <g transform="translate(80, 60) scale(0.15)">
            <path d="${arrowPath}" fill="${color}" />
          </g>
        </svg>`;
      
      // GRID DENSO
      case 'arrows-dense-grid':
        return `<svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
          <g transform="scale(0.12)">
            <path d="${arrowPath}" fill="${color}" />
          </g>
          <g transform="translate(60, 0) scale(0.12)">
            <path d="${arrowPath}" fill="${color}" />
          </g>
          <g transform="translate(0, 60) scale(0.12)">
            <path d="${arrowPath}" fill="${color}" />
          </g>
          <g transform="translate(60, 60) scale(0.12)">
            <path d="${arrowPath}" fill="${color}" />
          </g>
        </svg>`;
      
      // TRÊS SETAS
      case 'arrows-triple':
        return `<svg width="180" height="60" viewBox="0 0 180 60" xmlns="http://www.w3.org/2000/svg">
          <g transform="scale(0.12)">
            <path d="${arrowPath}" fill="${color}" />
          </g>
          <g transform="translate(60, 0) scale(0.12)">
            <path d="${arrowPath}" fill="${color}" />
          </g>
          <g transform="translate(120, 0) scale(0.12)">
            <path d="${arrowPath}" fill="${color}" />
          </g>
        </svg>`;
      
      // LINHAS FINAS
      case 'lines-thin':
        return `<svg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
          <line x1="20" y1="0" x2="20" y2="80" stroke="${color}" stroke-width="0.3" />
          <line x1="40" y1="0" x2="40" y2="80" stroke="${color}" stroke-width="0.3" />
          <line x1="60" y1="0" x2="60" y2="80" stroke="${color}" stroke-width="0.3" />
        </svg>`;
      
      // LINHAS GROSSAS
      case 'lines-thick':
        return `<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <line x1="25" y1="0" x2="25" y2="100" stroke="${color}" stroke-width="1.5" />
          <line x1="50" y1="0" x2="50" y2="100" stroke="${color}" stroke-width="1.5" />
          <line x1="75" y1="0" x2="75" y2="100" stroke="${color}" stroke-width="1.5" />
        </svg>`;
      
      // PADRÃO MISTO (SETAS + LINHAS)
      case 'mixed-pattern':
        return `<svg width="150" height="100" viewBox="0 0 150 100" xmlns="http://www.w3.org/2000/svg">
          <line x1="20" y1="0" x2="20" y2="100" stroke="${color}" stroke-width="0.5" />
          <g transform="translate(50, 30) scale(0.15)">
            <path d="${arrowPath}" fill="${color}" />
          </g>
          <line x1="130" y1="0" x2="130" y2="100" stroke="${color}" stroke-width="0.5" />
        </svg>`;
      
      // PADRÃO ARQUITETÔNICO
      case 'architectural':
        return `<svg width="240" height="200" viewBox="0 0 240 200" xmlns="http://www.w3.org/2000/svg">
          <g transform="translate(20, 20) scale(0.15)">
            <path d="${arrowPath}" fill="${color}" />
          </g>
          <line x1="60" y1="0" x2="60" y2="200" stroke="${color}" stroke-width="0.5" />
          <line x1="120" y1="0" x2="120" y2="200" stroke="${color}" stroke-width="0.5" />
          <line x1="180" y1="0" x2="180" y2="200" stroke="${color}" stroke-width="0.5" />
          <g transform="translate(140, 100) scale(0.15)">
            <path d="${arrowPath}" fill="${color}" />
          </g>
        </svg>`;
      
      default:
        return `<svg width="240" height="90" viewBox="0 0 240 90" xmlns="http://www.w3.org/2000/svg">
          <g transform="scale(0.25)">
            <path d="${arrowPath}" fill="${color}" />
          </g>
        </svg>`;
    }
  };

  const svgString = getSvgPattern();
  const encodedSvg = encodeURIComponent(svgString);
  const dataUrl = `data:image/svg+xml,${encodedSvg}`;

  return (
    <div 
      className="absolute inset-0"
      style={{
        opacity,
        backgroundImage: `url("${dataUrl}")`,
        backgroundRepeat: 'repeat',
      }}
    />
  );
}
