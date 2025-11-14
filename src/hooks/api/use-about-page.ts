// @/hooks/api/use-about-page.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type {
  AboutPageListResponse,
  AboutPageResponse,
  CreateAboutPageRequest,
  UpdateAboutPageRequest,
  AboutPageQueryParams,
  AboutPageWithRelations,
  ResumeItemListResponse,
  ResumeItemResponse,
  CreateResumeItemRequest,
  UpdateResumeItemRequest,
  ResumeItemQueryParams,
  ResumeItem,
  TeamMemberListResponse,
  TeamMemberResponse,
  CreateTeamMemberRequest,
  UpdateTeamMemberRequest,
  TeamMemberQueryParams,
  TeamMember,
  CertificateListResponse,
  CertificateResponse,
  CreateCertificateRequest,
  UpdateCertificateRequest,
  CertificateQueryParams,
  Certificate,
} from '@/types/api';

/**
 * React Query hooks for About Page API
 */

// Query Keys
export const aboutPageKeys = {
  all: ['about-page'] as const,
  lists: () => [...aboutPageKeys.all, 'list'] as const,
  list: (params?: AboutPageQueryParams) => [...aboutPageKeys.lists(), params] as const,
  details: () => [...aboutPageKeys.all, 'detail'] as const,
  detail: (id: string) => [...aboutPageKeys.details(), id] as const,
};

/**
 * Get paginated list of about pages
 */
export function useAboutPages(params?: AboutPageQueryParams) {
  return useQuery({
    queryKey: aboutPageKeys.list(params),
    queryFn: async () => {
      const response = await api.get<AboutPageListResponse>('/admin/about-page', { params });
      return response.data;
    },
  });
}

/**
 * Get single about page by ID
 */
export function useAboutPage(id: string) {
  return useQuery({
    queryKey: aboutPageKeys.detail(id),
    queryFn: async () => {
      const response = await api.get<AboutPageResponse>(`/admin/about-page/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

/**
 * Create new about page
 */
export function useCreateAboutPage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateAboutPageRequest) => {
      const response = await api.post<AboutPageResponse>('/admin/about-page', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: aboutPageKeys.lists() });
    },
  });
}

/**
 * Update existing about page
 */
export function useUpdateAboutPage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateAboutPageRequest }) => {
      const response = await api.patch<AboutPageResponse>(`/admin/about-page/${id}`, data);
      return response.data as unknown as AboutPageResponse;
    },
    onSuccess: (response: AboutPageResponse) => {
      queryClient.invalidateQueries({ queryKey: aboutPageKeys.lists() });
      if (response.data && 'id' in response.data) {
        queryClient.invalidateQueries({ queryKey: aboutPageKeys.detail(response.data.id as string) });
      }
    },
  });
}

/**
 * Delete about page
 */
export function useDeleteAboutPage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/about-page/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: aboutPageKeys.lists() });
    },
  });
}

/**
 * Resume Items Hooks
 */

export const resumeItemKeys = {
  all: ['resume-items'] as const,
  lists: () => [...resumeItemKeys.all, 'list'] as const,
  list: (params?: ResumeItemQueryParams) => [...resumeItemKeys.lists(), params] as const,
  details: () => [...resumeItemKeys.all, 'detail'] as const,
  detail: (id: string) => [...resumeItemKeys.details(), id] as const,
};

/**
 * Get paginated list of resume items
 */
export function useResumeItems(params?: ResumeItemQueryParams) {
  return useQuery({
    queryKey: resumeItemKeys.list(params),
    queryFn: async () => {
      const response = await api.get<ResumeItemListResponse>('/admin/resume-items', { params });
      return response.data;
    },
  });
}

/**
 * Get single resume item by ID
 */
export function useResumeItem(id: string) {
  return useQuery({
    queryKey: resumeItemKeys.detail(id),
    queryFn: async () => {
      const response = await api.get<ResumeItemResponse>(`/admin/resume-items/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

/**
 * Create new resume item
 */
export function useCreateResumeItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateResumeItemRequest) => {
      const response = await api.post<ResumeItemResponse>('/admin/resume-items', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: resumeItemKeys.lists() });
      queryClient.invalidateQueries({ queryKey: aboutPageKeys.all });
    },
  });
}

/**
 * Update existing resume item
 */
export function useUpdateResumeItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateResumeItemRequest }) => {
      const response = await api.patch<ResumeItemResponse>(`/admin/resume-items/${id}`, data);
      return response.data as unknown as ResumeItemResponse;
    },
    onSuccess: (response: ResumeItemResponse) => {
      queryClient.invalidateQueries({ queryKey: resumeItemKeys.lists() });
      queryClient.invalidateQueries({ queryKey: aboutPageKeys.all });
      if (response.data && 'id' in response.data) {
        queryClient.invalidateQueries({ queryKey: resumeItemKeys.detail(response.data.id as string) });
      }
    },
  });
}

/**
 * Delete resume item
 */
export function useDeleteResumeItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/resume-items/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: resumeItemKeys.lists() });
      queryClient.invalidateQueries({ queryKey: aboutPageKeys.all });
    },
  });
}

/**
 * Team Members Hooks
 */

export const teamMemberKeys = {
  all: ['team-members'] as const,
  lists: () => [...teamMemberKeys.all, 'list'] as const,
  list: (params?: TeamMemberQueryParams) => [...teamMemberKeys.lists(), params] as const,
  details: () => [...teamMemberKeys.all, 'detail'] as const,
  detail: (id: string) => [...teamMemberKeys.details(), id] as const,
};

/**
 * Get paginated list of team members
 */
export function useTeamMembers(params?: TeamMemberQueryParams) {
  return useQuery({
    queryKey: teamMemberKeys.list(params),
    queryFn: async () => {
      const response = await api.get<TeamMemberListResponse>('/admin/team-members', { params });
      return response.data;
    },
  });
}

/**
 * Get single team member by ID
 */
export function useTeamMember(id: string) {
  return useQuery({
    queryKey: teamMemberKeys.detail(id),
    queryFn: async () => {
      const response = await api.get<TeamMemberResponse>(`/admin/team-members/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

/**
 * Create new team member
 */
export function useCreateTeamMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateTeamMemberRequest) => {
      const response = await api.post<TeamMemberResponse>('/admin/team-members', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamMemberKeys.lists() });
      queryClient.invalidateQueries({ queryKey: aboutPageKeys.all });
    },
  });
}

/**
 * Update existing team member
 */
export function useUpdateTeamMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateTeamMemberRequest }) => {
      const response = await api.patch<TeamMemberResponse>(`/admin/team-members/${id}`, data);
      return response.data as unknown as TeamMemberResponse;
    },
    onSuccess: (response: TeamMemberResponse) => {
      queryClient.invalidateQueries({ queryKey: teamMemberKeys.lists() });
      queryClient.invalidateQueries({ queryKey: aboutPageKeys.all });
      if (response.data && 'id' in response.data) {
        queryClient.invalidateQueries({ queryKey: teamMemberKeys.detail(response.data.id as string) });
      }
    },
  });
}

/**
 * Delete team member
 */
export function useDeleteTeamMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/team-members/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamMemberKeys.lists() });
      queryClient.invalidateQueries({ queryKey: aboutPageKeys.all });
    },
  });
}

/**
 * Certificates Hooks
 */

export const certificateKeys = {
  all: ['certificates'] as const,
  lists: () => [...certificateKeys.all, 'list'] as const,
  list: (params?: CertificateQueryParams) => [...certificateKeys.lists(), params] as const,
  details: () => [...certificateKeys.all, 'detail'] as const,
  detail: (id: string) => [...certificateKeys.details(), id] as const,
};

/**
 * Get paginated list of certificates
 */
export function useCertificates(params?: CertificateQueryParams) {
  return useQuery({
    queryKey: certificateKeys.list(params),
    queryFn: async () => {
      const response = await api.get<CertificateListResponse>('/admin/certificates', { params });
      return response.data;
    },
  });
}

/**
 * Get single certificate by ID
 */
export function useCertificate(id: string) {
  return useQuery({
    queryKey: certificateKeys.detail(id),
    queryFn: async () => {
      const response = await api.get<CertificateResponse>(`/admin/certificates/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

/**
 * Create new certificate
 */
export function useCreateCertificate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateCertificateRequest) => {
      const response = await api.post<CertificateResponse>('/admin/certificates', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: certificateKeys.lists() });
      queryClient.invalidateQueries({ queryKey: aboutPageKeys.all });
    },
  });
}

/**
 * Update existing certificate
 */
export function useUpdateCertificate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateCertificateRequest }) => {
      const response = await api.patch<CertificateResponse>(`/admin/certificates/${id}`, data);
      return response.data as unknown as CertificateResponse;
    },
    onSuccess: (response: CertificateResponse) => {
      queryClient.invalidateQueries({ queryKey: certificateKeys.lists() });
      queryClient.invalidateQueries({ queryKey: aboutPageKeys.all });
      if (response.data && 'id' in response.data) {
        queryClient.invalidateQueries({ queryKey: certificateKeys.detail(response.data.id as string) });
      }
    },
  });
}

/**
 * Delete certificate
 */
export function useDeleteCertificate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/certificates/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: certificateKeys.lists() });
      queryClient.invalidateQueries({ queryKey: aboutPageKeys.all });
    },
  });
}
