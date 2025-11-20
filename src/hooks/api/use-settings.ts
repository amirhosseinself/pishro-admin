// @/hooks/api/use-settings.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';

/**
 * React Query hooks for Settings API
 */

// Types
export interface SiteSettings {
  id: string;
  zarinpalMerchantId?: string | null;
  siteName?: string | null;
  siteDescription?: string | null;
  supportEmail?: string | null;
  supportPhone?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SettingsResponse {
  success: boolean;
  message: string;
  data: SiteSettings;
}

export interface UpdateSettingsRequest {
  zarinpalMerchantId?: string | null;
  siteName?: string | null;
  siteDescription?: string | null;
  supportEmail?: string | null;
  supportPhone?: string | null;
}

// Query Keys
export const settingsKeys = {
  all: ['settings'] as const,
  detail: () => [...settingsKeys.all, 'detail'] as const,
};

/**
 * Get site settings
 */
export function useSettings() {
  return useQuery<SettingsResponse>({
    queryKey: settingsKeys.detail(),
    queryFn: async () => {
      const response = await api.get<SettingsResponse>('/admin/settings');
      return response;
    },
  });
}

/**
 * Update site settings
 */
export function useUpdateSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateSettingsRequest) => {
      const response = await api.patch<SettingsResponse>('/admin/settings', data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.detail() });
    },
  });
}
