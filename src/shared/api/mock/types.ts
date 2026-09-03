// для обратной совместимости.

import type { User, NotificationSettings, AppearanceSettings } from '@/entities/user/model/types';
import type { Place, BudgetTier, CreatePlacePayload } from '@/entities/place/model/types';
import type { Pair } from '@/entities/pair/model/types';
import type { MoodStatus, Tag, Emotion } from '@/entities/mood/model/types';

export type UserDTO = User;
export type MoodStatusDTO = MoodStatus;
export type PairDTO = Pair;
export type TagDTO = Tag;
export type BudgetTierDTO = BudgetTier;
export type PlaceDTO = Place;
export type CreatePlaceDTO = CreatePlacePayload;
export type NotificationSettingsDTO = NotificationSettings;
export type AppearanceSettingsDTO = AppearanceSettings;
export type EmotionDTO = Emotion;
