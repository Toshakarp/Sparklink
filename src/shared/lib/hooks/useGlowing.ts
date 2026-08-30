import { useState, useRef, useEffect, useCallback } from 'react';

export function useGlowing(duration = 5000) {
  const [isGlowing, setIsGlowing] = useState(false);
  const timerRef = useRef<number | null>(null);

  const triggerGlow = useCallback(() => {
    setIsGlowing(true);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      setIsGlowing(false);
    }, duration);
  }, [duration]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return { isGlowing, triggerGlow };
}
