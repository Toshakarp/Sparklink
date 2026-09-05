import type { IPlacesApi } from '../../core/places.api';
import type { PlaceDTO } from '../../types/models';
import { mockPlacesDTO } from '../data/places.mock';

export const createMockPlacesApi = (): IPlacesApi => {
  let places: PlaceDTO[] = [...mockPlacesDTO];

  return {
    getPlaces: async () => {
      await new Promise((resolve) => setTimeout(resolve, 200));
      return places;
    },

    createPlace: async (_pairId, placeData) => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      const newPlace: PlaceDTO = {
        id: `mock-place-${Date.now()}`,
        title: placeData.title,
        emoji: placeData.emoji,
        address: placeData.address,
        description: placeData.description,
        categoryIds: placeData.categoryIds || [],
        budgetId: placeData.budgetId,
        clickCount: 0,
        lastClickedAt: null,
      };
      places.push(newPlace);
      return newPlace;
    },

    updatePlace: async (place) => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      places = places.map((p) => (p.id === place.id ? { ...p, ...place } : p));
    },

    deletePlace: async (placeId) => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      places = places.filter((p) => p.id !== placeId);
    },
  };
};
