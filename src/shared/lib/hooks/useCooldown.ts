import { useState, useCallback } from 'react';
export const useCooldown = (cooldownMs: number) => {
  const [isCooldown, setIsCooldown] = useState(false);
  const trigger = useCallback(() => {
    setIsCooldown(true);
    setTimeout(() => setIsCooldown(false), cooldownMs);
  }, [cooldownMs]);
  return { isCooldown, trigger };
};
