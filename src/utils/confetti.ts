import confetti from 'canvas-confetti';

/**
 * Fires a subtle, celebration confetti burst.
 * Designed with elegant, auspicious colors (gold, saffron, amber, emerald, violet, sky)
 * to boost user engagement without overwhelming the screen.
 */
export function triggerConfetti(options?: {
  particleCount?: number;
  spread?: number;
  origin?: { x: number; y: number };
  colors?: string[];
}) {
  try {
    const defaultColors = ['#F59E0B', '#10B981', '#6366F1', '#EC4899', '#3B82F6', '#EF4444', '#F59E0B'];

    confetti({
      particleCount: options?.particleCount ?? 60,
      spread: options?.spread ?? 70,
      origin: options?.origin ?? { y: 0.6 },
      colors: options?.colors ?? defaultColors,
      disableForReducedMotion: true,
      zIndex: 9999,
      scalar: 0.9,
    });
  } catch (err) {
    // Graceful fallback if canvas is restricted
    console.debug('Confetti effect unavailable:', err);
  }
}

/**
 * Fires a side cannon confetti effect for extra special key actions like registration completion
 */
export function triggerCelebrationConfetti() {
  try {
    const colors = ['#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899'];

    // Left side cannon
    confetti({
      particleCount: 40,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors,
      zIndex: 9999,
      disableForReducedMotion: true,
    });

    // Right side cannon slightly delayed
    setTimeout(() => {
      confetti({
        particleCount: 40,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors,
        zIndex: 9999,
        disableForReducedMotion: true,
      });
    }, 150);
  } catch (err) {
    console.debug('Celebration confetti unavailable:', err);
  }
}

/**
 * Fires dazzling radiant gold, amber, and champagne sparkles for newly earned digital ID badges
 */
export function triggerGoldShimmerConfetti(originPoint?: { x: number; y: number }) {
  try {
    const goldColors = ['#F59E0B', '#FBBF24', '#FDE047', '#FEF08A', '#D97706', '#FFFFFF'];

    // Center burst of golden sparks
    confetti({
      particleCount: 50,
      spread: 60,
      startVelocity: 25,
      origin: originPoint ?? { x: 0.5, y: 0.45 },
      colors: goldColors,
      zIndex: 99999,
      scalar: 0.85,
      ticks: 200,
      gravity: 0.8,
      shapes: ['star', 'circle'],
      disableForReducedMotion: true,
    });
  } catch (err) {
    console.debug('Gold shimmer confetti unavailable:', err);
  }
}
