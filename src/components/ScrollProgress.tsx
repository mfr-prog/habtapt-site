'use client';

import { motion, useScroll, useSpring } from 'motion/react';
import { designSystem } from './design-system';

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 origin-left z-[100]"
      style={{
        scaleX,
        background: designSystem.colors.gradients.primary,
        transformOrigin: '0%',
      }}
    />
  );
}
