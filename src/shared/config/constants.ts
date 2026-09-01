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
  { id: 'happy', title: 'Радость', emoji: '😊', type: 'positive' },
  { id: 'calm', title: 'Спокойствие', emoji: '😌', type: 'positive' },
  { id: 'sad', title: 'Грусть', emoji: '😔', type: 'difficult' },
  { id: 'tired', title: 'Усталость', emoji: '😴', type: 'difficult' },
  { id: 'anxious', title: 'Тревога', emoji: '😟', type: 'difficult' },
  { id: 'angry', title: 'Злость', emoji: '😠', type: 'difficult' },
  { id: 'neutral', title: 'Обычное', emoji: '😐', type: 'neutral' },
  { id: 'inspired', title: 'Вдохновение', emoji: '🤩', type: 'positive' },
];
