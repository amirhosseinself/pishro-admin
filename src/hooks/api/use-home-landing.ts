// @/hooks/api/use-home-landing.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type {
  HomeLandingListResponse,
  HomeLandingResponse,
  CreateHomeLandingRequest,
  UpdateHomeLandingRequest,
  HomeLandingQueryParams,
  HomeLanding,
} from '@/types/api';

/**
 * React Query hooks for Home Landing API
 */

// Query Keys
export const homeLandingKeys = {
  all: ['home-landing'] as const,
  lists: () => [...homeLandingKeys.all, 'list'] as const,
  list: (params?: HomeLandingQueryParams) => [...homeLandingKeys.lists(), params] as const,
  details: () => [...homeLandingKeys.all, 'detail'] as const,
  detail: (id: string) => [...homeLandingKeys.details(), id] as const,
};

/**
 * Get paginated list of home landing pages
 */
export function useHomeLanding(params?: HomeLandingQueryParams) {
  return useQuery({
    queryKey: homeLandingKeys.list(params),
    queryFn: async () => {
      const response = await api.get<HomeLandingListResponse>('/admin/home-landing', { params });
      return response.data;
    },
  });
}

/**
 * Get single home landing page by ID
 */
export function useHomeLandingDetail(id: string) {
  return useQuery({
    queryKey: homeLandingKeys.detail(id),
    queryFn: async () => {
      const response = await api.get<HomeLandingResponse>(`/admin/home-landing/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

/**
 * Create new home landing page
 */
export function useCreateHomeLanding() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateHomeLandingRequest) => {
      const response = await api.post<HomeLandingResponse>('/admin/home-landing', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: homeLandingKeys.lists() });
    },
  });
}

/**
 * Update existing home landing page
 */
export function useUpdateHomeLanding() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateHomeLandingRequest }) => {
      const response = await api.patch<HomeLandingResponse>(`/admin/home-landing/${id}`, data);
      return response.data as unknown as HomeLandingResponse;
    },
    onSuccess: (response: HomeLandingResponse) => {
      queryClient.invalidateQueries({ queryKey: homeLandingKeys.lists() });
      if (response.data && 'id' in response.data) {
        queryClient.invalidateQueries({ queryKey: homeLandingKeys.detail(response.data.id as string) });
      }
    },
  });
}

/**
 * Delete home landing page
 */
export function useDeleteHomeLanding() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/home-landing/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: homeLandingKeys.lists() });
    },
  });
}
