import type { FC } from 'react';
import { Users, User } from 'lucide-react';
import styles from './MoodAudiencePicker.module.scss';

export type MoodAudience = 'together' | 'alone';

export interface MoodAudiencePickerProps {
  value: MoodAudience;
  onChange: (value: MoodAudience) => void;
  className?: string;
}

export const MoodAudiencePicker: FC<MoodAudiencePickerProps> = ({
  value,
  onChange,
  className = '',
}) => {
  return (
    <div className={`${styles.container} ${className}`.trim()}>
      <button
        type="button"
        className={`${styles.optionBtn} ${value === 'together' ? styles.active : ''}`}
        onClick={() => onChange('together')}
      >
        <Users size={16} className={styles.icon} />
        <span>Для двоих</span>
      </button>

      <button
        type="button"
        className={`${styles.optionBtn} ${value === 'alone' ? styles.active : ''}`}
        onClick={() => onChange('alone')}
      >
        <User size={16} className={styles.icon} />
        <span>Для одного</span>
      </button>
    </div>
  );
};
