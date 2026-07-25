import { useState, useEffect } from 'react';

/**
 * Custom hook for dynamic typewriter placeholder effect in search inputs.
 * Cycles through an array of phrases with smooth typing, pausing, and erasing animations.
 */
export function useTypingPlaceholder(
  placeholders: string[],
  typingSpeed = 70,
  deletingSpeed = 35,
  pauseDuration = 2200
): string {
  const [displayedText, setDisplayedText] = useState('');
  const [index, setIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!placeholders || placeholders.length === 0) return;

    const currentText = placeholders[index % placeholders.length];
    let timer: ReturnType<typeof setTimeout>;

    if (!isDeleting) {
      if (displayedText.length < currentText.length) {
        timer = setTimeout(() => {
          setDisplayedText(currentText.slice(0, displayedText.length + 1));
        }, typingSpeed);
      } else {
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, pauseDuration);
      }
    } else {
      if (displayedText.length > 0) {
        timer = setTimeout(() => {
          setDisplayedText(currentText.slice(0, displayedText.length - 1));
        }, deletingSpeed);
      } else {
        setIsDeleting(false);
        setIndex((prevIndex) => (prevIndex + 1) % placeholders.length);
      }
    }

    return () => clearTimeout(timer);
  }, [displayedText, index, isDeleting, placeholders, typingSpeed, deletingSpeed, pauseDuration]);

  return displayedText;
}
