import type { FC } from 'react';
import { SectionHeader } from '@/shared/ui';
import { TagSelector } from '@/features/mood-tracking';
import { useWishTagsStore } from '@/entities/mood';
import { useUserStore } from '@/entities/user';
import { usePairStore } from '@/entities/pair';
import styles from './OurMoodSection.module.scss';

export const OurMoodSection: FC = () => {
  const moodTags = useWishTagsStore(state => state.moodTags);
  const toggleMoodTag = useWishTagsStore(state => state.toggleMoodTag);
  
  const currentUser = useUserStore(state => state.currentUser);
  const partnerUser = usePairStore(state => state.partnerUser);

  if (!currentUser || !partnerUser) return null;

  const categoryGroups = [
    {
      categoryId: 'together',
      label: 'Для двоих',
      tags: moodTags.filter((t) => t.audience === 'together'),
    },
    {
      categoryId: 'alone',
      label: 'Для одного',
      tags: moodTags.filter((t) => t.audience === 'alone'),
    },
  ];

  return (
    <section className={styles.section}>
      <SectionHeader title="Наше настроение" />

      <div className={styles.categoriesWrapper}>
        {categoryGroups.map((group) => {
          if (group.tags.length === 0) return null;

          return (
            <div key={group.categoryId} className={styles.categoryBlock}>
              <div className={styles.categoryLabel}>{group.label}</div>
              <TagSelector
                tags={group.tags}
                currentUser={currentUser}
                partnerUser={partnerUser}
                onToggleTag={toggleMoodTag}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
};
