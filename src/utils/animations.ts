// Centralized Motion Animations for HABTA
// All animations variants in one place for consistency

import type { Variants } from 'motion/react';

export const animations = {
  // Page Transitions
  page: {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1] // Custom easing
      }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: { duration: 0.3 }
    }
  } as Variants,

  // Fade In Animations
  fadeIn: {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { duration: 0.3 }
    }
  } as Variants,

  fadeInUp: {
    initial: { opacity: 0, y: 24 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  } as Variants,

  fadeInDown: {
    initial: { opacity: 0, y: -24 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  } as Variants,

  // Scale Animations
  scaleIn: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  } as Variants,

  scaleSpring: {
    initial: { scale: 0, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        type: 'spring',
        stiffness: 260,
        damping: 20
      }
    }
  } as Variants,

  // Card Animations
  card: {
    initial: { opacity: 0, y: 40, scale: 0.95 },
    animate: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  } as Variants,

  // List Item Animations (for stagger)
  listItem: {
    initial: { opacity: 0, x: -20 },
    animate: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.3 }
    }
  } as Variants,

  // Container for stagger children
  staggerContainer: {
    animate: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  } as Variants,

  // Hover/Tap Animations (for motion props)
  button: {
    rest: { scale: 1 },
    hover: { 
      scale: 1.02,
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.98 }
  },

  iconButton: {
    rest: { scale: 1, rotate: 0 },
    hover: { 
      scale: 1.1,
      rotate: 5,
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.95 }
  },

  // Background Elements
  float: {
    animate: {
      y: [0, -20, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  },

  pulse: {
    animate: {
      scale: [1, 1.05, 1],
      opacity: [0.5, 0.8, 0.5],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  },

  orb: {
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.03, 0.08, 0.03],
      transition: {
        duration: 8,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  },

  // Skeleton Pulse
  skeleton: {
    animate: {
      opacity: [0.5, 0.8, 0.5],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  } as Variants,

  // Spin Animation
  spin: {
    animate: {
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: 'linear'
      }
    }
  }
};

// Stagger delays
export const staggerDelays = {
  fast: 0.05,
  normal: 0.1,
  slow: 0.15
};

// Common transitions
export const transitions = {
  smooth: {
    duration: 0.3,
    ease: [0.22, 1, 0.36, 1]
  },
  spring: {
    type: 'spring' as const,
    stiffness: 260,
    damping: 20
  },
  bounce: {
    type: 'spring' as const,
    stiffness: 400,
    damping: 10
  }
};
