import type { PlaceDTO, CreatePlaceDTO } from '../types/models';

export interface IPlacesApi {
  getPlaces(pairId: string): Promise<PlaceDTO[]>;
  createPlace(pairId: string, placeData: CreatePlaceDTO): Promise<PlaceDTO>;
  updatePlace(place: PlaceDTO): Promise<void>;
  deletePlace(placeId: string): Promise<void>;
}
