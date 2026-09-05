import type { PlaceDTO } from '../../types/models';

export const mockPlacesDTO: PlaceDTO[] = [
  {
    id: 'place-1',
    title: 'Уютный вечер дома',
    description: 'Заказать пиццу и посмотреть фильм',
    address: 'Дома',
    emoji: '🍿',
    clickCount: 0,
    lastClickedAt: null,
    budgetId: 'budget',
    categoryIds: ['cat-home'],
    createdAt: '2026-01-10T12:00:00Z',
  },
  {
    id: 'place-2',
    title: 'Прогулка в парке',
    description: 'Взять кофе и пройтись по любимому маршруту',
    address: 'Парк',
    emoji: '🌳',
    clickCount: 0,
    lastClickedAt: null,
    budgetId: 'free',
    categoryIds: ['cat-walk'],
    createdAt: '2026-01-12T12:00:00Z',
  },
];
