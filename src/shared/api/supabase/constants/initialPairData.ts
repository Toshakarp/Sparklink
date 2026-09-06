export interface InitialBudgetTier {
  key: string;
  label: string;
  level: number;
  emoji: string;
}

export interface InitialPlaceCategory {
  key: string;
  label: string;
  emoji: string;
}

export interface InitialMoodTag {
  key: string;
  label: string;
  emoji: string;
  audience: 'together' | 'alone';
}

export interface InitialPlace {
  title: string;
  emoji: string;
  description: string;
  address: string;
  categoryKeys: string[];
  budgetTierKey: string;
}

export const INITIAL_BUDGET_TIERS: InitialBudgetTier[] = [
  { key: 'free', label: 'Бесплатно', level: 1, emoji: '🆓' },
  { key: 'budget', label: 'Эконом', level: 2, emoji: '🪙' },
  { key: 'medium', label: 'Средний', level: 3, emoji: '💵' },
  { key: 'premium', label: 'Дорого', level: 4, emoji: '💳' },
  { key: 'luxury', label: 'Очень дорого', level: 5, emoji: '💎' },
];

export const INITIAL_PLACE_CATEGORIES: InitialPlaceCategory[] = [
  { key: 'home', label: 'Дома', emoji: '🏠' },
  { key: 'walk', label: 'Прогулка', emoji: '🌳' },
];

export const INITIAL_MOOD_TAGS: InitialMoodTag[] = [
  { key: 'hug', label: 'Порадуй меня', emoji: '🎁', audience: 'together' },
  { key: 'quiet', label: 'Хочу на ручки', emoji: '🫂', audience: 'together' },
  { key: 'talk', label: 'Тревожно', emoji: '😟', audience: 'alone' },
  { key: 'coffee', label: 'Много сил', emoji: '🔋', audience: 'alone' },
];


export const INITIAL_PLACES: InitialPlace[] = [
  {
    title: 'Уютный вечер дома',
    emoji: '🍿',
    description: 'Заказать пиццу и посмотреть фильм',
    address: 'Дома',
    budgetTierKey: 'budget',
    categoryKeys: ['home'],
  },
  {
    title: 'Прогулка в парке',
    emoji: '🌳',
    description: 'Взять кофе и пройтись по любимому маршруту',
    address: 'Парк',
    budgetTierKey: 'free',
    categoryKeys: ['walk'],
  },
];
