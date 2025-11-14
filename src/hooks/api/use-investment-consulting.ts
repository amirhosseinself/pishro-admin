// @/hooks/api/use-investment-consulting.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type {
  InvestmentConsultingListResponse,
  InvestmentConsultingResponse,
  CreateInvestmentConsultingRequest,
  UpdateInvestmentConsultingRequest,
  InvestmentConsultingQueryParams,
  InvestmentConsulting,
} from '@/types/api';

/**
 * React Query hooks for Investment Consulting API
 */

// Query Keys
export const investmentConsultingKeys = {
  all: ['investment-consulting'] as const,
  lists: () => [...investmentConsultingKeys.all, 'list'] as const,
  list: (params?: InvestmentConsultingQueryParams) => [...investmentConsultingKeys.lists(), params] as const,
  details: () => [...investmentConsultingKeys.all, 'detail'] as const,
  detail: (id: string) => [...investmentConsultingKeys.details(), id] as const,
};

/**
 * Get paginated list of investment consulting pages
 */
export function useInvestmentConsulting(params?: InvestmentConsultingQueryParams) {
  return useQuery({
    queryKey: investmentConsultingKeys.list(params),
    queryFn: async () => {
      const response = await api.get<InvestmentConsultingListResponse>('/admin/investment-consulting', { params });
      return response.data;
    },
  });
}

/**
 * Get single investment consulting page by ID
 */
export function useInvestmentConsultingDetail(id: string) {
  return useQuery({
    queryKey: investmentConsultingKeys.detail(id),
    queryFn: async () => {
      const response = await api.get<InvestmentConsultingResponse>(`/admin/investment-consulting/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

/**
 * Create new investment consulting page
 */
export function useCreateInvestmentConsulting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateInvestmentConsultingRequest) => {
      const response = await api.post<InvestmentConsultingResponse>('/admin/investment-consulting', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: investmentConsultingKeys.lists() });
    },
  });
}

/**
 * Update existing investment consulting page
 */
export function useUpdateInvestmentConsulting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateInvestmentConsultingRequest }) => {
      const response = await api.patch<InvestmentConsultingResponse>(`/admin/investment-consulting/${id}`, data);
      return response.data as unknown as InvestmentConsultingResponse;
    },
    onSuccess: (response: InvestmentConsultingResponse) => {
      queryClient.invalidateQueries({ queryKey: investmentConsultingKeys.lists() });
      if (response.data && 'id' in response.data) {
        queryClient.invalidateQueries({ queryKey: investmentConsultingKeys.detail(response.data.id as string) });
      }
    },
  });
}

/**
 * Delete investment consulting page
 */
export function useDeleteInvestmentConsulting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/investment-consulting/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: investmentConsultingKeys.lists() });
    },
  });
}
