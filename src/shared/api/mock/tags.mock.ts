import type { TagDTO, BudgetTierDTO } from './types';

export const mockDateTagsDTO: TagDTO[] = [
  { id: 'all', label: 'Все', emoji: '✨', type: 'date' },
  { id: 'food', label: 'Еда & Кофе', emoji: '☕️', type: 'date' },
  { id: 'romantic', label: 'Романтика', emoji: '🍷', type: 'date' },
  { id: 'walk', label: 'Прогулка', emoji: '🌿', type: 'date' },
  { id: 'active', label: 'Активный отдых', emoji: '🧗', type: 'date' },
  { id: 'home', label: 'Дома', emoji: '🛋', type: 'date' },
  { id: 'culture', label: 'Культура', emoji: '🎭', type: 'date' },
];

export const mockMoodTagsDTO: TagDTO[] = [
  { id: 'hug', label: 'Хочу обнимашек', emoji: '🫂', type: 'mood', audience: 'together', selectedByMe: true, markedBy: ['user'] },
  { id: 'coffee', label: 'Нужен кофе', emoji: '☕️', type: 'mood', audience: 'alone', selectedByMe: false, markedBy: [] },
  { id: 'sleep', label: 'Хочу спать', emoji: '😴', type: 'mood', audience: 'alone', selectedByMe: false, markedBy: [] },
  { id: 'walk_tag', label: 'Погулять на воздухе', emoji: '🌿', type: 'mood', audience: 'together', selectedByMe: true, markedBy: ['user', 'partner'], selectedByPartner: true },
  { id: 'talk', label: 'Поговорить по душам', emoji: '💬', type: 'mood', audience: 'together', selectedByMe: false, markedBy: [] },
  { id: 'quiet', label: 'Побыть в тишине', emoji: '🎧', type: 'mood', audience: 'alone', selectedByMe: false, markedBy: [] },
];

export const mockBudgetTiersDTO: BudgetTierDTO[] = [
  { id: 'free', name: 'Бесплатно', label: 'Бесплатно', rangeLabel: '0 ₽', emoji: '🪙', colorLevel: 1, minAmount: 0, maxAmount: 0 },
  { id: 'budget', name: 'Бюджетно', label: 'Бюджетно', rangeLabel: 'до 1 500 ₽', emoji: '💵', colorLevel: 2, minAmount: 0, maxAmount: 1500 },
  { id: 'medium', name: 'Средний', label: 'Средний', rangeLabel: '1 500 – 4 000 ₽', emoji: '💳', colorLevel: 3, minAmount: 1500, maxAmount: 4000 },
  { id: 'premium', name: 'Премиум', label: 'Премиум', rangeLabel: '4 000 – 10 000 ₽', emoji: '💎', colorLevel: 4, minAmount: 4000, maxAmount: 10000 },
  { id: 'luxury', name: 'Роскошно', label: 'Роскошно', rangeLabel: 'от 10 000 ₽', emoji: '👑', colorLevel: 5, minAmount: 10000 },
];
