import React, { useState, useEffect, useRef } from 'react';

interface AnimatedCounterProps {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  formatter?: (val: number) => string;
  className?: string;
}

/**
 * AnimatedCounter Component
 * Renders a scroll-triggered count-up animation for numbers using IntersectionObserver & rAF.
 */
export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  end,
  duration = 1600,
  prefix = '',
  suffix = '',
  formatter,
  className = '',
}) => {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLSpanElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const node = elementRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [hasAnimated]);

  useEffect(() => {
    if (!hasAnimated) return;

    let animationFrameId: number;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutCubic curve for smooth decelerating count-up
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const currentCount = Math.round(easedProgress * end);

      setCount(currentCount);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [end, duration, hasAnimated]);

  const displayValue = formatter
    ? formatter(count)
    : `${prefix}${count.toLocaleString()}${suffix}`;

  return (
    <span ref={elementRef} className={className}>
      {displayValue}
    </span>
  );
};
