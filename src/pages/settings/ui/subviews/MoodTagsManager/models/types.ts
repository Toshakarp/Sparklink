export type MoodAudience = 'together' | 'alone';

export interface MoodTagFormData {
  label: string;
  emoji: string;
  category: MoodAudience;
}
