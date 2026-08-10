import React from 'react';
import { motion, useScroll, useSpring } from 'motion/react';

export const ReadingProgressBar: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 origin-left z-[100] shadow-sm pointer-events-none"
      style={{ scaleX }}
    />
  );
};
