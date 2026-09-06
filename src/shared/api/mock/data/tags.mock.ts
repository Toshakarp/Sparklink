import type { DateCategoryDTO, TagDTO, BudgetTierDTO } from '../../types/models';

export const mockDateTagsDTO: DateCategoryDTO[] = [
  { id: 'cat-home', label: 'Дома', emoji: '🏠' },
  { id: 'cat-walk', label: 'Прогулка', emoji: '🌳' },
];

export const mockMoodTagsDTO: TagDTO[] = [
  { id: 'hug', label: 'Порадуй меня', emoji: '🎁', audience: 'together' },
  { id: 'quiet', label: 'Хочу на ручки', emoji: '🫂', audience: 'together' },
  { id: 'talk', label: 'Тревожно', emoji: '😟', audience: 'alone' },
  { id: 'coffee', label: 'Много сил', emoji: '🔋', audience: 'alone' },
];

export const mockBudgetTiersDTO: BudgetTierDTO[] = [
  { id: 'free', label: 'Бесплатно', level: 1, emoji: '🆓' },
  { id: 'budget', label: 'Эконом', level: 2, emoji: '🪙' },
  { id: 'medium', label: 'Средний', level: 3, emoji: '💵' },
  { id: 'premium', label: 'Дорого', level: 4, emoji: '💳' },
  { id: 'luxury', label: 'Очень дорого', level: 5, emoji: '💎' },
];
