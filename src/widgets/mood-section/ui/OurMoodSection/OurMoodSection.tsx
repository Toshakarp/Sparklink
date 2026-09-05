import type { FC } from 'react';
import { SectionHeader } from '@/shared/ui';
import { TagSelector } from '@/features/mood-tracking';
import { useWishTagsStore } from '@/entities/mood';
import { useUserStore } from '@/entities/user';
import { usePairStore } from '@/entities/pair';
import { useApi } from '@/app/providers/ApiProvider';
import styles from './OurMoodSection.module.scss';

export const OurMoodSection: FC = () => {
  const moodTags = useWishTagsStore(state => state.moodTags);
  const toggleMoodTag = useWishTagsStore(state => state.toggleMoodTag);
  const mySelectedTagIds = useWishTagsStore(state => state.mySelectedTagIds);
  const partnerSelectedTagIds = useWishTagsStore(state => state.partnerSelectedTagIds);
  
  const { pairApi } = useApi();
  const currentUser = useUserStore(state => state.currentUser);
  const partnerUser = usePairStore(state => state.partnerUser);

  if (!currentUser || !partnerUser) return null;

  const handleToggleTag = async (tagId: string) => {
    const isSelected = mySelectedTagIds.includes(tagId);
    toggleMoodTag(tagId);
    if (pairApi && currentUser?.pairId && currentUser?.id) {
      try {
        await pairApi.toggleUserMoodTag(currentUser.id, currentUser.pairId, tagId, !isSelected);
      } catch (e) {
        console.error('Failed to toggle mood tag on backend', e);
        toggleMoodTag(tagId);
      }
    }
  };

  const categoryGroups = [
    {
      categoryId: 'together',
      label: 'Для двоих',
      tags: moodTags.filter((t) => t.audience === 'together' || (!t.audience && moodTags.length > 0)),
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
                mySelectedTagIds={mySelectedTagIds}
                partnerSelectedTagIds={partnerSelectedTagIds}
                onToggleTag={handleToggleTag}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
};
