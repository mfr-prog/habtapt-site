// Opções de padrões de fundo para Hero e Footer
// Use o padrão que preferir alterando o 'pattern' prop

import React from 'react';

interface BackgroundPatternProps {
  pattern?: 'dots' | 'grid' | 'diagonal' | 'hexagon' | 'waves' | 'blueprint' | 'minimal' | 'gradient-mesh';
  opacity?: number;
  color?: string;
}

export function BackgroundPattern({ 
  pattern = 'dots', 
  opacity = 0.05, 
  color = '#ffffff' 
}: BackgroundPatternProps) {
  
  const patterns = {
    // Padrão 1: Pontos minimalistas
    dots: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='${encodeURIComponent(color)}' fill-opacity='1'%3E%3Ccircle cx='3' cy='3' r='2'/%3E%3C/g%3E%3C/svg%3E")`,
    
    // Padrão 2: Grid quadriculado limpo
    grid: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg stroke='${encodeURIComponent(color)}' stroke-width='1'%3E%3Cpath d='M0 40L40 0M40 40L0 0'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
    
    // Padrão 3: Linhas diagonais sutis
    diagonal: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='${encodeURIComponent(color)}' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 38L40 -2M0 -2L40 38' stroke='${encodeURIComponent(color)}' stroke-width='0.5'/%3E%3C/g%3E%3C/svg%3E")`,
    
    // Padrão 4: Hexágonos (arquitetônico)
    hexagon: `url("data:image/svg+xml,%3Csvg width='56' height='100' viewBox='0 0 56 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M28 66L0 50L0 16L28 0L56 16L56 50L28 66L28 100' fill='none' stroke='${encodeURIComponent(color)}' stroke-width='1'/%3E%3Cpath d='M28 0L28 34L0 50L0 84L28 100L56 84L56 50L28 34' fill='none' stroke='${encodeURIComponent(color)}' stroke-width='1'/%3E%3C/svg%3E")`,
    
    // Padrão 5: Ondas suaves
    waves: `url("data:image/svg+xml,%3Csvg width='100' height='20' viewBox='0 0 100 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M21.184 20c.357-.13.72-.264 1.088-.402l1.768-.661C33.64 15.347 39.647 14 50 14c10.271 0 15.362 1.222 24.629 4.928.955.383 1.869.74 2.75 1.072h6.225c-2.51-.73-5.139-1.691-8.233-2.928C65.888 13.278 60.562 12 50 12c-10.626 0-16.855 1.397-26.66 5.063l-1.767.662c-2.475.923-4.66 1.674-6.724 2.275h6.335zm0-20C13.258 2.892 8.077 4 0 4V2c5.744 0 9.951-.574 14.85-2h6.334zM77.38 0C85.239 2.966 90.502 4 100 4V2c-6.842 0-11.386-.542-16.396-2h-6.225zM0 14c8.44 0 13.718-1.21 22.272-4.402l1.768-.661C33.64 5.347 39.647 4 50 4c10.271 0 15.362 1.222 24.629 4.928C84.112 12.722 89.438 14 100 14v-2c-10.271 0-15.362-1.222-24.629-4.928C65.888 3.278 60.562 2 50 2 39.374 2 33.145 3.397 23.34 7.063l-1.767.662C13.223 10.84 8.163 12 0 12v2z' fill='${encodeURIComponent(color)}' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
    
    // Padrão 6: Blueprint técnico
    blueprint: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='${encodeURIComponent(color)}' stroke-width='0.5'%3E%3Cline x1='0' y1='0' x2='100' y2='0'/%3E%3Cline x1='0' y1='25' x2='100' y2='25'/%3E%3Cline x1='0' y1='50' x2='100' y2='50'/%3E%3Cline x1='0' y1='75' x2='100' y2='75'/%3E%3Cline x1='0' y1='100' x2='100' y2='100'/%3E%3Cline x1='0' y1='0' x2='0' y2='100'/%3E%3Cline x1='25' y1='0' x2='25' y2='100'/%3E%3Cline x1='50' y1='0' x2='50' y2='100'/%3E%3Cline x1='75' y1='0' x2='75' y2='100'/%3E%3Cline x1='100' y1='0' x2='100' y2='100'/%3E%3C/g%3E%3C/svg%3E")`,
    
    // Padrão 7: Minimalista - apenas alguns pontos espaçados
    minimal: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='${encodeURIComponent(color)}' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='1.5'/%3E%3C/g%3E%3C/svg%3E")`,
    
    // Padrão 8: Gradient Mesh (sem imagem, apenas CSS)
    'gradient-mesh': 'none',
  };

  if (pattern === 'gradient-mesh') {
    return (
      <div 
        className="absolute inset-0"
        style={{
          opacity,
          background: `
            radial-gradient(at 0% 0%, ${color}15 0px, transparent 50%),
            radial-gradient(at 100% 0%, ${color}10 0px, transparent 50%),
            radial-gradient(at 100% 100%, ${color}15 0px, transparent 50%),
            radial-gradient(at 0% 100%, ${color}10 0px, transparent 50%)
          `,
        }}
      />
    );
  }

  return (
    <div 
      className="absolute inset-0"
      style={{
        opacity,
        backgroundImage: patterns[pattern],
        backgroundSize: pattern === 'hexagon' ? '56px 100px' : undefined,
      }}
    />
  );
}

// Componente de preview para testar os padrões
export function BackgroundPatternPreview() {
  const patterns: Array<BackgroundPatternProps['pattern']> = [
    'dots',
    'grid', 
    'diagonal',
    'hexagon',
    'waves',
    'blueprint',
    'minimal',
    'gradient-mesh',
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-8">
      {patterns.map((pattern) => (
        <div key={pattern} className="space-y-2">
          <div 
            className="relative h-40 rounded-xl overflow-hidden"
            style={{ background: '#1A3E5C' }}
          >
            <BackgroundPattern pattern={pattern} opacity={0.1} color="#ffffff" />
            <div className="relative z-10 flex items-center justify-center h-full">
              <span 
                className="px-4 py-2 bg-black/20 rounded-lg backdrop-blur-sm"
                style={{
                  color: '#ffffff',
                  fontWeight: 600,
                }}
              >
                {pattern}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
