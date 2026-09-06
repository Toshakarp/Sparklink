import type { PlaceDTO, CreatePlaceDTO, DateCategoryDTO } from '../types/models';

export interface IPlacesApi {
  getPlaces(pairId: string): Promise<PlaceDTO[]>;
  createPlace(pairId: string, placeData: CreatePlaceDTO): Promise<PlaceDTO>;
  updatePlace(place: PlaceDTO): Promise<void>;
  deletePlace(placeId: string): Promise<void>;

  createDateCategory(pairId: string, label: string, emoji: string): Promise<DateCategoryDTO>;
  updateDateCategory(category: DateCategoryDTO): Promise<void>;
  deleteDateCategory(categoryId: string): Promise<void>;
}
