// @/hooks/api/use-investment-plans.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type {
  InvestmentPlansListResponse,
  InvestmentPlansResponse,
  CreateInvestmentPlansRequest,
  UpdateInvestmentPlansRequest,
  InvestmentPlansQueryParams,
  InvestmentPlansWithRelations,
  InvestmentPlanListResponse,
  InvestmentPlanResponse,
  CreateInvestmentPlanRequest,
  UpdateInvestmentPlanRequest,
  InvestmentPlanQueryParams,
  InvestmentPlan,
  InvestmentTagListResponse,
  InvestmentTagResponse,
  CreateInvestmentTagRequest,
  UpdateInvestmentTagRequest,
  InvestmentTagQueryParams,
  InvestmentTag,
} from '@/types/api';

/**
 * React Query hooks for Investment Plans API
 */

// Query Keys
export const investmentPlansKeys = {
  all: ['investment-plans'] as const,
  lists: () => [...investmentPlansKeys.all, 'list'] as const,
  list: (params?: InvestmentPlansQueryParams) => [...investmentPlansKeys.lists(), params] as const,
  details: () => [...investmentPlansKeys.all, 'detail'] as const,
  detail: (id: string) => [...investmentPlansKeys.details(), id] as const,
};

/**
 * Get paginated list of investment plans
 */
export function useInvestmentPlans(params?: InvestmentPlansQueryParams) {
  return useQuery({
    queryKey: investmentPlansKeys.list(params),
    queryFn: async () => {
      const response = await api.get<InvestmentPlansListResponse>('/admin/investment-plans', { params });
      return response.data;
    },
  });
}

/**
 * Get single investment plans page by ID
 */
export function useInvestmentPlansDetail(id: string) {
  return useQuery({
    queryKey: investmentPlansKeys.detail(id),
    queryFn: async () => {
      const response = await api.get<InvestmentPlansResponse>(`/admin/investment-plans/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

/**
 * Create new investment plans page
 */
export function useCreateInvestmentPlans() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateInvestmentPlansRequest) => {
      const response = await api.post<InvestmentPlansResponse>('/admin/investment-plans', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: investmentPlansKeys.lists() });
    },
  });
}

/**
 * Update existing investment plans page
 */
export function useUpdateInvestmentPlans() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateInvestmentPlansRequest }) => {
      const response = await api.patch<InvestmentPlansResponse>(`/admin/investment-plans/${id}`, data);
      return response.data as unknown as InvestmentPlansResponse;
    },
    onSuccess: (response: InvestmentPlansResponse) => {
      queryClient.invalidateQueries({ queryKey: investmentPlansKeys.lists() });
      if (response.data && 'id' in response.data) {
        queryClient.invalidateQueries({ queryKey: investmentPlansKeys.detail(response.data.id as string) });
      }
    },
  });
}

/**
 * Delete investment plans page
 */
export function useDeleteInvestmentPlans() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/investment-plans/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: investmentPlansKeys.lists() });
    },
  });
}

/**
 * Investment Plan Items Hooks
 */

export const investmentPlanKeys = {
  all: ['investment-plan-items'] as const,
  lists: () => [...investmentPlanKeys.all, 'list'] as const,
  list: (params?: InvestmentPlanQueryParams) => [...investmentPlanKeys.lists(), params] as const,
  details: () => [...investmentPlanKeys.all, 'detail'] as const,
  detail: (id: string) => [...investmentPlanKeys.details(), id] as const,
};

/**
 * Get paginated list of investment plan items
 */
export function useInvestmentPlanItems(params?: InvestmentPlanQueryParams) {
  return useQuery({
    queryKey: investmentPlanKeys.list(params),
    queryFn: async () => {
      const response = await api.get<InvestmentPlanListResponse>('/admin/investment-plan-items', { params });
      return response.data;
    },
  });
}

/**
 * Get single investment plan item by ID
 */
export function useInvestmentPlanItem(id: string) {
  return useQuery({
    queryKey: investmentPlanKeys.detail(id),
    queryFn: async () => {
      const response = await api.get<InvestmentPlanResponse>(`/admin/investment-plan-items/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

/**
 * Create new investment plan item
 */
export function useCreateInvestmentPlanItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateInvestmentPlanRequest) => {
      const response = await api.post<InvestmentPlanResponse>('/admin/investment-plan-items', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: investmentPlanKeys.lists() });
      queryClient.invalidateQueries({ queryKey: investmentPlansKeys.all });
    },
  });
}

/**
 * Update existing investment plan item
 */
export function useUpdateInvestmentPlanItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateInvestmentPlanRequest }) => {
      const response = await api.patch<InvestmentPlanResponse>(`/admin/investment-plan-items/${id}`, data);
      return response.data as unknown as InvestmentPlanResponse;
    },
    onSuccess: (response: InvestmentPlanResponse) => {
      queryClient.invalidateQueries({ queryKey: investmentPlanKeys.lists() });
      queryClient.invalidateQueries({ queryKey: investmentPlansKeys.all });
      if (response.data && 'id' in response.data) {
        queryClient.invalidateQueries({ queryKey: investmentPlanKeys.detail(response.data.id as string) });
      }
    },
  });
}

/**
 * Delete investment plan item
 */
export function useDeleteInvestmentPlanItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/investment-plan-items/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: investmentPlanKeys.lists() });
      queryClient.invalidateQueries({ queryKey: investmentPlansKeys.all });
    },
  });
}

/**
 * Investment Tags Hooks
 */

export const investmentTagKeys = {
  all: ['investment-tags'] as const,
  lists: () => [...investmentTagKeys.all, 'list'] as const,
  list: (params?: InvestmentTagQueryParams) => [...investmentTagKeys.lists(), params] as const,
  details: () => [...investmentTagKeys.all, 'detail'] as const,
  detail: (id: string) => [...investmentTagKeys.details(), id] as const,
};

/**
 * Get paginated list of investment tags
 */
export function useInvestmentTags(params?: InvestmentTagQueryParams) {
  return useQuery({
    queryKey: investmentTagKeys.list(params),
    queryFn: async () => {
      const response = await api.get<InvestmentTagListResponse>('/admin/investment-tags', { params });
      return response.data;
    },
  });
}

/**
 * Get single investment tag by ID
 */
export function useInvestmentTag(id: string) {
  return useQuery({
    queryKey: investmentTagKeys.detail(id),
    queryFn: async () => {
      const response = await api.get<InvestmentTagResponse>(`/admin/investment-tags/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

/**
 * Create new investment tag
 */
export function useCreateInvestmentTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateInvestmentTagRequest) => {
      const response = await api.post<InvestmentTagResponse>('/admin/investment-tags', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: investmentTagKeys.lists() });
      queryClient.invalidateQueries({ queryKey: investmentPlansKeys.all });
    },
  });
}

/**
 * Update existing investment tag
 */
export function useUpdateInvestmentTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateInvestmentTagRequest }) => {
      const response = await api.patch<InvestmentTagResponse>(`/admin/investment-tags/${id}`, data);
      return response.data as unknown as InvestmentTagResponse;
    },
    onSuccess: (response: InvestmentTagResponse) => {
      queryClient.invalidateQueries({ queryKey: investmentTagKeys.lists() });
      queryClient.invalidateQueries({ queryKey: investmentPlansKeys.all });
      if (response.data && 'id' in response.data) {
        queryClient.invalidateQueries({ queryKey: investmentTagKeys.detail(response.data.id as string) });
      }
    },
  });
}

/**
 * Delete investment tag
 */
export function useDeleteInvestmentTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/investment-tags/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: investmentTagKeys.lists() });
      queryClient.invalidateQueries({ queryKey: investmentPlansKeys.all });
    },
  });
}
