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

export function LogoFull({ variant = 'white', className = '', showTagline: _showTagline = true, size = 'md' }: LogoFullProps) {
  const logoSrc = variant === 'white' ? '/logo-dark.svg' : '/logo-white.svg';

  const sizes = {
    sm: { height: 32 },
    md: { height: 48 },
    lg: { height: 64 },
  };

  const config = sizes[size];

  return (
    <div className={className}>
      <img
        src={logoSrc}
        alt="HABTA — Every Home, Productized"
        height={config.height}
        style={{ height: config.height, width: 'auto' }}
      />
    </div>
  );
}
