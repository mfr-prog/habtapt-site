'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUp } from './icons';
import { designSystem } from './design-system';

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 500) {
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
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, y: 20, scale: 0 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0 }}
          transition={{
            duration: 0.3,
            type: 'spring',
            stiffness: 300,
            damping: 20,
          }}
          onClick={scrollToTop}
          whileHover={{ 
            scale: 1.1,
            boxShadow: '0 8px 32px rgba(26, 62, 92, 0.25)'
          }}
          whileTap={{ scale: 0.9 }}
          className="fixed bottom-6 left-6 z-50 flex items-center justify-center w-14 h-14 rounded-full"
          style={{
            background: designSystem.colors.gradients.primary,
            boxShadow: '0 4px 20px rgba(26, 62, 92, 0.2)',
          }}
          aria-label="Voltar ao topo"
        >
          <ArrowUp size={22} style={{ color: designSystem.colors.neutral.white }} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
