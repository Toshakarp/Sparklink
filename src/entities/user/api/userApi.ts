import { mockCurrentUserDTO, mockPartnerUserDTO } from '@/shared/api/mock/user.mock';
import type { UserDTO, AppearanceSettingsDTO, NotificationSettingsDTO } from '@/shared/api/mock/types';
import { tgService } from '@/shared/lib/telegram/telegram';

export const userApi = {
  /**
   * Initializes and retrieves current user profile.
   * Prioritizes Telegram Mini App SDK data if running inside Telegram,
   * otherwise falls back to local dev mock.
   */
  async getCurrentUser(_isDemo = false): Promise<UserDTO> {
    // TODO: [Supabase Integration]
    // 1. Check active Supabase session or authenticate with Telegram initData:
    //    const { data: { session } } = await supabase.auth.signInWithCustomToken(tgService.getInitData());
    // 2. Fetch user row from 'users' table:
    //    const { data: profile } = await supabase.from('users').select('*').eq('telegram_id', tgUser.id).single();

    // In Telegram SDK, the current user ALWAYS comes from Telegram SDK (even in demo mode)
    const tgUser = tgService.getTelegramUser();
    if (tgUser && tgUser.id) {
      return Promise.resolve({
        id: tgUser.id,
        telegramId: tgUser.id,
        firstName: tgUser.first_name || 'Пользователь',
        lastName: tgUser.last_name || '',
        username: tgUser.username || '',
        photoUrl: tgUser.photo_url || mockCurrentUserDTO.photoUrl,
        themeColor: mockCurrentUserDTO.themeColor,
        notificationsEnabled: true,
      });
    }

    // In standalone browser / dev mode outside Telegram SDK
    return Promise.resolve(mockCurrentUserDTO);
  },

  /**
   * Fetches partner profile linked to current user.
   */
  async getPartnerUser(isDemo = false): Promise<UserDTO | null> {
    // TODO: [Supabase Integration]
    // Fetch active pair relationship:
    // const { data: pair } = await supabase.from('pairs').select('partner_id, users(*)').eq('user_id', currentUserId).single();
    // return pair?.users ? mapToUserDTO(pair.users) : null;

    if (isDemo) {
      return Promise.resolve(mockPartnerUserDTO);
    }

    return Promise.resolve(null);
  },

  async updateAppearance(settings: AppearanceSettingsDTO): Promise<void> {
    // TODO: [Supabase Integration]
    // await supabase.from('user_settings').upsert({ user_id: currentUserId, theme_color: settings.accentColor });
    mockCurrentUserDTO.themeColor = settings.accentColor;
    return Promise.resolve();
  },

  async updateNotifications(_settings: NotificationSettingsDTO): Promise<void> {
    // TODO: [Supabase Integration]
    // await supabase.from('user_settings').upsert({ user_id: currentUserId, notifications: _settings });
    return Promise.resolve();
  },
};

// Backward-compatibility alias
export const userService = userApi;
