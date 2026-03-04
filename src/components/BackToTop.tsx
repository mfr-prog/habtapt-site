'use client';

import { useState, useEffect } from 'react';
import { ArrowUp } from './icons';
import { designSystem } from './design-system';

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-6 left-6 flex items-center justify-center w-14 h-14 rounded-full transition-transform duration-200 hover:scale-110 active:scale-90 ${
        isVisible ? 'float-btn-enter' : 'float-btn-hidden'
      }`}
      style={{
        zIndex: designSystem.zIndex.sticky,
        background: designSystem.colors.gradients.primary,
        boxShadow: '0 4px 20px rgba(26, 62, 92, 0.2)',
        transition: 'transform 0.2s, box-shadow 0.3s, opacity 0.3s, scale 0.3s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 8px 32px rgba(26, 62, 92, 0.25)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(26, 62, 92, 0.2)';
      }}
      aria-label="Voltar ao topo"
    >
      <ArrowUp size={22} style={{ color: designSystem.colors.neutral.white }} />
    </button>
  );
}
