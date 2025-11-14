// @/hooks/api/use-mobile-scroller-steps.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type {
  MobileScrollerStepListResponse,
  MobileScrollerStepResponse,
  CreateMobileScrollerStepRequest,
  UpdateMobileScrollerStepRequest,
  MobileScrollerStepQueryParams,
  MobileScrollerStep,
} from '@/types/api';

/**
 * React Query hooks for Mobile Scroller Steps API
 */

// Query Keys
export const mobileScrollerStepKeys = {
  all: ['mobile-scroller-steps'] as const,
  lists: () => [...mobileScrollerStepKeys.all, 'list'] as const,
  list: (params?: MobileScrollerStepQueryParams) => [...mobileScrollerStepKeys.lists(), params] as const,
  details: () => [...mobileScrollerStepKeys.all, 'detail'] as const,
  detail: (id: string) => [...mobileScrollerStepKeys.details(), id] as const,
};

/**
 * Get paginated list of mobile scroller steps
 */
export function useMobileScrollerSteps(params?: MobileScrollerStepQueryParams) {
  return useQuery({
    queryKey: mobileScrollerStepKeys.list(params),
    queryFn: async () => {
      const response = await api.get<MobileScrollerStepListResponse>('/admin/mobile-scroller-steps', { params });
      return response.data;
    },
  });
}

/**
 * Get single mobile scroller step by ID
 */
export function useMobileScrollerStep(id: string) {
  return useQuery({
    queryKey: mobileScrollerStepKeys.detail(id),
    queryFn: async () => {
      const response = await api.get<MobileScrollerStepResponse>(`/admin/mobile-scroller-steps/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

/**
 * Create new mobile scroller step
 */
export function useCreateMobileScrollerStep() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateMobileScrollerStepRequest) => {
      const response = await api.post<MobileScrollerStepResponse>('/admin/mobile-scroller-steps', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mobileScrollerStepKeys.lists() });
    },
  });
}

/**
 * Update existing mobile scroller step
 */
export function useUpdateMobileScrollerStep() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateMobileScrollerStepRequest }) => {
      const response = await api.patch<MobileScrollerStepResponse>(`/admin/mobile-scroller-steps/${id}`, data);
      return response.data as unknown as MobileScrollerStepResponse;
    },
    onSuccess: (response: MobileScrollerStepResponse) => {
      queryClient.invalidateQueries({ queryKey: mobileScrollerStepKeys.lists() });
      if (response.data && 'id' in response.data) {
        queryClient.invalidateQueries({ queryKey: mobileScrollerStepKeys.detail(response.data.id as string) });
      }
    },
  });
}

/**
 * Delete mobile scroller step
 */
export function useDeleteMobileScrollerStep() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/mobile-scroller-steps/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mobileScrollerStepKeys.lists() });
    },
  });
}
