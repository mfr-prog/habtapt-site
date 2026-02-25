import React from 'react';
import svgPathsWhite from '../imports/svg-4baw0a32yg';
import svgPathsBlack from '../imports/svg-webkzfe3xj';

interface LogoProps {
  variant?: 'white' | 'black';
  className?: string;
  size?: number;
}

export function Logo({ variant = 'white', className = '', size = 120 }: LogoProps) {
  const svgPaths = variant === 'white' ? svgPathsWhite : svgPathsBlack;
  const fillColor = variant === 'white' ? '#FFFFFF' : '#0A2D55';
  // A seta sempre mantém sua cor original de destaque
  const accentColor = '#6683A0';

  return (
    <svg
      className={className}
      width={size}
      height={(size * 413) / 474}
      viewBox="0 0 474 413"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g>
        <g>
          <path d={svgPaths.p2be92200} fill={fillColor} />
          <path d={svgPaths.p1ada6c80} fill={fillColor} />
          <path d={svgPaths.p2447acf0} fill={fillColor} />
          <path d={svgPaths.p3d79a600} fill={fillColor} />
          <path d={svgPaths.p133fb40} fill={fillColor} />
          <path d={svgPaths.p10c4ae80} fill={fillColor} />
          <path d={svgPaths.p2dd6000} fill={fillColor} />
          <path d={svgPaths.p1b38d700} fill={fillColor} />
          <path d={svgPaths.p29cae80} fill={fillColor} />
          <path d={svgPaths.p2d5dad00} fill={fillColor} />
          <path d={svgPaths.p19a26d80} fill={fillColor} />
          <path d={svgPaths.p170c5880} fill={fillColor} />
          <path d={svgPaths.p37374e00} fill={fillColor} />
          <path d={svgPaths.p13cf6a00} fill={fillColor} />
          <path d={svgPaths.p3ee0be80} fill={fillColor} />
          <path d={svgPaths.p1bf1b280} fill={fillColor} />
          <path d={svgPaths.p3ffaed80} fill={fillColor} />
          <path d={svgPaths.p2c207600} fill={fillColor} />
          <path d={svgPaths.p1c864200} fill={fillColor} />
          <path d={svgPaths.p11014680} fill={fillColor} />
          <path d={svgPaths.p1fa17870} fill={fillColor} />
          <path d={svgPaths.p3fed0980} fill={fillColor} />
        </g>
        <path d={svgPaths.p25aeda00} fill={accentColor} />
      </g>
    </svg>
  );
}

interface LogoFullProps {
  variant?: 'white' | 'black';
  className?: string;
  showTagline?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function LogoFull({ variant = 'white', className = '', showTagline = true, size = 'md' }: LogoFullProps) {
  const textColor = variant === 'white' ? '#0A2D55' : '#F9FAFC';
  const accentColor = '#6683A0';
  
  const sizes = {
    sm: { logo: 40, text: 'text-2xl', tagline: 'text-xs', spacing: 'gap-3' },
    md: { logo: 60, text: 'text-4xl', tagline: 'text-sm', spacing: 'gap-4' },
    lg: { logo: 80, text: 'text-5xl', tagline: 'text-base', spacing: 'gap-5' },
  };
  
  const config = sizes[size];

  return (
    <div className={`flex items-center ${config.spacing} ${className}`}>
      <Logo variant={variant} size={config.logo} />
      <div className="flex flex-col">
        <h1 
          className={`${config.text} tracking-tight leading-none`}
          style={{ color: textColor, fontWeight: 900, letterSpacing: '-0.03em' }}
        >
          HABTA
        </h1>
        {showTagline && (
          <div className="flex flex-col gap-1 mt-1">
            <p 
              className={`${config.tagline} tracking-wider uppercase`}
              style={{ color: textColor, letterSpacing: '0.12em' }}
            >
              Património de Alta Performance
            </p>
            <div 
              className="h-0.5 w-12"
              style={{ background: accentColor }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
