import type { IPlacesApi } from '../core/places.api';
import * as placesModule from './modules/places.module';
import * as categoriesModule from './modules/categories.module';

export const createSupabasePlacesApi = (): IPlacesApi => ({
  getPlaces: placesModule.getPlaces,
  createPlace: placesModule.createPlace,
  updatePlace: placesModule.updatePlace,
  deletePlace: placesModule.deletePlace,

  createDateCategory: categoriesModule.createDateCategory,
  updateDateCategory: categoriesModule.updateDateCategory,
  deleteDateCategory: categoriesModule.deleteDateCategory,
});
