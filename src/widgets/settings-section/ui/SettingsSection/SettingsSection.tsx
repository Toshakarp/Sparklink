import type { FC } from 'react';
import {
  MapPin,
  FolderHeart,
  Coins,
  Smile,
  Palette,
  Bell,
  UserX,
  RotateCcw,
  LogOut,
} from 'lucide-react';
import { SettingsListItem } from '../SettingsListItem/SettingsListItem';
import { SectionHeader } from '@/shared/ui';
import styles from './SettingsSection.module.scss';

export interface SettingsSectionProps {
  placesCount: number;
  dateTagsCount: number;
  moodTagsCount: number;
  budgetTiersCount: number;
  isDemo?: boolean;
  onNavigatePlaces: () => void;
  onNavigateDateCategories: () => void;
  onNavigateBudgetTiers: () => void;
  onNavigateMoodTags: () => void;
  onNavigateAppearance: () => void;
  onNavigateNotifications: () => void;
  onOpenUnlink: () => void;
  onResetData: () => void;
  onExitApp?: () => void;
}

export const SettingsSection: FC<SettingsSectionProps> = ({
  placesCount,
  dateTagsCount,
  moodTagsCount,
  budgetTiersCount,
  isDemo = false,
  onNavigatePlaces,
  onNavigateDateCategories,
  onNavigateBudgetTiers,
  onNavigateMoodTags,
  onNavigateAppearance,
  onNavigateNotifications,
  onOpenUnlink,
  onResetData,
  onExitApp,
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.group}>
        <SectionHeader title="Управление контентом" />
        <div className={styles.list}>
          <SettingsListItem
            icon={<MapPin size={18} />}
            title="Все места и идеи"
            subtitle={`${placesCount} мест`}
            onClick={onNavigatePlaces}
          />
          <SettingsListItem
            icon={<FolderHeart size={18} />}
            title="Категории свиданий"
            subtitle={`${dateTagsCount} категорий`}
            onClick={onNavigateDateCategories}
          />
          <SettingsListItem
            icon={<Coins size={18} />}
            title="Уровни бюджета"
            subtitle={`${budgetTiersCount} уровня`}
            onClick={onNavigateBudgetTiers}
          />
          <SettingsListItem
            icon={<Smile size={18} />}
            title="Теги настроения"
            subtitle={`${moodTagsCount} тегов`}
            onClick={onNavigateMoodTags}
          />
        </div>
      </div>

      <div className={styles.group}>
        <SectionHeader title="Приложение" />
        <div className={styles.list}>
          <SettingsListItem
            icon={<Palette size={18} />}
            title="Внешний вид"
            subtitle="Цветовой акцент"
            onClick={onNavigateAppearance}
          />
          <SettingsListItem
            icon={<Bell size={18} />}
            title="Уведомления"
            subtitle="Маяк, настроения, фото"
            onClick={onNavigateNotifications}
          />
        </div>
      </div>

      <div className={styles.group}>
        <SectionHeader title="Отношения и данные" />
        <div className={styles.list}>
          <SettingsListItem
            icon={<UserX size={18} />}
            title="Отвязать партнёра"
            subtitle="Разорвать связь в приложении"
            isDestructive
            onClick={onOpenUnlink}
          />
          {isDemo ? (
            <SettingsListItem
              icon={<RotateCcw size={18} />}
              title="Сбросить демо-данные"
              subtitle="Вернуть стандартные настройки"
              isDestructive
              onClick={onResetData}
            />
          ) : (
            <SettingsListItem
              icon={<LogOut size={18} />}
              title="Выйти из приложения"
              subtitle="Закрыть Telegram Mini App"
              isDestructive
              onClick={onExitApp}
            />
          )}
        </div>
      </div>
    </div>
  );
};
