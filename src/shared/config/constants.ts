export const ATTENTION_COOLDOWN_MS = 45000;
export const DEFAULT_AVATAR_URL = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
export const DEFAULT_PARTNER_AVATAR_URL = 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80';

export const EMOJI_CATEGORIES = {
  dates: ['🍿', '🍕', '🍣', '🍔', '☕', '🍷', '🍦', '🍰'],
  activities: ['🎨', '🎭', '🎪', '🎳', '🎮', '🎲', '🎯', '🎸'],
  outdoor: ['🎡', '🎢', '🏖️', '🌲', '⛵', '🚀', '🚲', '🛹'],
  romance: ['✨', '❤️', '🔥', '💫', '⭐', '🌙', '🕯️', '🛁'],
  sport: ['🏊', '🧗', '🥊', '⚽', '🎾', '⛸️', '⛷️', '🥋'],
  gifts: ['🛍️', '🎁', '📸', '📚', '🧩', '🎈', '🎉', '💐'],
  food: ['🥐', '🍩', '🍫', '🍵', '🥂', '🍹', '🌮', '🥞'],
} as const;

export const DEFAULT_EMOJIS: string[] = Object.values(EMOJI_CATEGORIES).flat();

export const ENERGY_LEVEL_MARKS = [0, 50, 100] as const;
export const DEFAULT_ENERGY_LEVEL = 50;
export const ENERGY_STEP = 5;

export const DEFAULT_EMOTIONS = [
  { id: '1', title: 'Радость', emoji: '😊', type: 'positive' },
  { id: '2', title: 'Спокойствие', emoji: '😌', type: 'positive' },
  { id: '3', title: 'Грусть', emoji: '😔', type: 'difficult' },
  { id: '4', title: 'Усталость', emoji: '😴', type: 'difficult' },
  { id: '5', title: 'Тревога', emoji: '😟', type: 'difficult' },
  { id: '6', title: 'Злость', emoji: '😠', type: 'difficult' },
  { id: '7', title: 'Обычное', emoji: '😐', type: 'neutral' },
  { id: '8', title: 'Вдохновение', emoji: '🤩', type: 'positive' },
];
