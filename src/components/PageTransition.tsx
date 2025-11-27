'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { designSystem } from './design-system';
import { Logo } from './Logo';
import { LogoPattern } from './LogoPatterns';

interface PageTransitionProps {
  children: React.ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simula progresso de carregamento mais realista
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        // Progressão não-linear para parecer mais natural
        const increment = Math.random() * (prev < 50 ? 20 : prev < 80 ? 10 : 5);
        return Math.min(prev + increment, 100);
      });
    }, 80);

    const timer = setTimeout(() => {
      setProgress(100);
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }, 1200);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(timer);
    };
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ 
              opacity: 0,
              scale: 1.1,
              filter: 'blur(10px)'
            }}
            transition={{ 
              duration: 0.7,
              ease: [0.43, 0.13, 0.23, 0.96]
            }}
            className="fixed inset-0 flex items-center justify-center"
            style={{ 
              background: designSystem.colors.gradients.hero,
              zIndex: designSystem.zIndex.modal + 1,
            }}
          >
            {/* Background Pattern - Setas Minúsculas do Logo HABTA */}
            <LogoPattern 
              pattern="arrows-tiny" 
              opacity={0.09} 
              color={designSystem.colors.neutral.white}
            />

            {/* Animated Orb */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute w-96 h-96 rounded-full"
              style={{
                background: `radial-gradient(circle, ${designSystem.helpers.hexToRgba(designSystem.colors.brand.secondary, 0.4)} 0%, transparent 70%)`,
                filter: 'blur(80px)',
              }}
            />

            <div className="relative z-10 text-center">
              {/* Logo Animation */}
              <motion.div
                initial={{ opacity: 0, scale: 0.5, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ 
                  duration: 0.8,
                  ease: [0.6, -0.05, 0.01, 0.99]
                }}
                className="mb-8"
              >
                <motion.div
                  animate={{ 
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="mb-8"
                >
                  <div 
                    className="mx-auto flex items-center justify-center"
                    style={{
                      filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.3))',
                    }}
                  >
                    <Logo variant="white" size={120} />
                  </div>
                </motion.div>
                
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  style={{
                    fontSize: designSystem.typography.fontSize.sm,
                    fontWeight: designSystem.typography.fontWeight.medium,
                    color: designSystem.helpers.hexToRgba(designSystem.colors.neutral.white, 0.7),
                    letterSpacing: designSystem.typography.letterSpacing.wider,
                    textTransform: 'uppercase',
                  }}
                >
                  Every Home, Productized
                </motion.p>
              </motion.div>

              {/* Progress Bar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="w-64 mx-auto"
              >
                <div 
                  className="h-1 rounded-full overflow-hidden backdrop-blur-sm"
                  style={{
                    background: designSystem.helpers.hexToRgba(designSystem.colors.neutral.white, 0.2),
                  }}
                >
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      background: `linear-gradient(90deg, ${designSystem.colors.brand.secondary}, ${designSystem.colors.brand.secondaryLight})`,
                      boxShadow: `0 0 20px ${designSystem.helpers.hexToRgba(designSystem.colors.brand.secondary, 0.5)}`,
                    }}
                    initial={{ width: '0%' }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                
                <motion.p
                  className="mt-3"
                  style={{
                    fontSize: designSystem.typography.fontSize.xs,
                    color: designSystem.helpers.hexToRgba(designSystem.colors.neutral.white, 0.6),
                    fontWeight: designSystem.typography.fontWeight.medium,
                  }}
                >
                  {Math.round(progress)}%
                </motion.p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: isLoading ? 0 : 1,
          y: isLoading ? 20 : 0
        }}
        transition={{ 
          duration: 0.8,
          ease: [0.43, 0.13, 0.23, 0.96]
        }}
      >
        {children}
      </motion.div>
    </>
  );
}
