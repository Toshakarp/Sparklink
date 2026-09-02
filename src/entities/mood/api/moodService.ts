import { mockMyMoodDTO, mockPartnerMoodDTO } from '@/shared/api/mock/user.mock';
import { mockMoodTagsDTO } from '@/shared/api/mock/tags.mock';
import type { MoodStatusDTO, TagDTO } from '@/shared/api/mock/types';

export const moodService = {
  /**
   * Fetches the current user's active mood status.
   */
  async getMyMood(): Promise<MoodStatusDTO> {
    // TODO: [Supabase Realtime / API Integration]
    // 1. Query 'mood_statuses' table by current user_id:
    //    const { data } = await supabase.from('mood_statuses').select('*').eq('user_id', myUserId).single();
    // 2. Return mapped DTO or null.
    return Promise.resolve(mockMyMoodDTO);
  },

  /**
   * Fetches the partner's active mood status.
   */
  async getPartnerMood(): Promise<MoodStatusDTO> {
    // TODO: [Supabase Realtime / API Integration]
    // 1. Subscribe to partner's updates via Supabase channel:
    //    supabase.channel('partner_mood').on('postgres_changes', { event: '*', table: 'mood_statuses', filter: `user_id=eq.${partnerId}` }, (p) => { ... });
    // 2. Fetch latest snapshot from 'mood_statuses'.
    return Promise.resolve(mockPartnerMoodDTO);
  },

  /**
   * Fetches available mood tag categories.
   */
  async getMoodTags(): Promise<TagDTO[]> {
    // TODO: [Supabase Integration]
    // Query custom/shared mood tags from 'mood_tags' table:
    // const { data } = await supabase.from('mood_tags').select('*').or(`pair_id.eq.${pairId},is_default.eq.true`);
    return Promise.resolve(mockMoodTagsDTO);
  },

  /**
   * Persists updated mood and energy level.
   */
  async updateMood(emotionId: string, energyLevel: number): Promise<void> {
    // TODO: [Supabase Realtime Integration]
    // Upsert status to Supabase 'mood_statuses' table:
    // await supabase.from('mood_statuses').upsert({ user_id: myUserId, emotion_id: emotionId, energy_level: energyLevel, updated_at: new Date().toISOString() });
    console.log('updated:', emotionId, energyLevel )
    return Promise.resolve();
  },
  /**
   * Uploads and updates Locket photo widget.
   */
  async updateLocketPhoto(photoUrl: string): Promise<void> {
    // TODO: [Supabase Storage / TMA Cloud Integration]
    // 1. Upload compressed blob to Supabase storage bucket 'locket_photos'.
    // 2. Update 'mood_statuses.locket_photo_url' and trigger instant partner push notification.
    console.log('photo updated:', photoUrl)
    return Promise.resolve();
  }
};

