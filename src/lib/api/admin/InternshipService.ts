import api from '../../axios';
import { getActiveToken } from '../../authUtils';
import useSWR from 'swr';

const fetcher = (url: string) => api.get(url).then((res) => res.data);

const extractArray = (res: any): any[] => {
  if (!res) return [];
  if (Array.isArray(res)) return res;
  if (Array.isArray(res.data)) return res.data;
  if (Array.isArray(res.data?.data)) return res.data.data;
  if (Array.isArray(res.data?.internships)) return res.data.internships;
  if (Array.isArray(res.internships)) return res.internships;
  if (Array.isArray(res.applications)) return res.applications;
  if (Array.isArray(res.data?.applications)) return res.data.applications;
  if (Array.isArray(res.submissions)) return res.submissions;
  if (Array.isArray(res.data?.submissions)) return res.data.submissions;
  return [];
};

export const InternshipService = {

  // ─── Dashboard Stats ────────────────────────────────────────────────────────
  useStats: () => {
    const { data, error, mutate, isLoading } = useSWR('/admin/internships/stats', fetcher);
    return { data: data?.data || null, isLoading, isError: !!error, mutate };
  },

  // ─── Internship CRUD ─────────────────────────────────────────────────────────
  useInternships: (params: Record<string, any> = {}) => {
    const query = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v !== '' && v != null))
    ).toString();
    const url = `/admin/internships${query ? '?' + query : ''}`;
    const { data, error, mutate, isLoading } = useSWR(url, fetcher, { keepPreviousData: true });
    return {
      data: extractArray(data),
      meta: data?.data?.current_page ? data.data : (data?.current_page ? data : {}),
      isLoading,
      isError: !!error,
      mutate,
    };
  },

  getInternship: async (id: number | string) => {
    const res = await api.get(`/admin/internships/${id}`);
    return res.data;
  },

  createInternship: async (data: Record<string, any>) => {
    const res = await api.post('/admin/internships', data);
    return res.data;
  },

  updateInternship: async (id: number | string, data: Record<string, any>) => {
    const res = await api.put(`/admin/internships/${id}`, data);
    return res.data;
  },

  deleteInternship: async (id: number | string) => {
    const res = await api.delete(`/admin/internships/${id}`);
    return res.data;
  },

  duplicateInternship: async (id: number | string) => {
    const res = await api.post(`/admin/internships/${id}/duplicate`);
    return res.data;
  },

  bulkUpdateStatus: async (ids: (number | string)[], status: string) => {
    const res = await api.post('/admin/internships/bulk-update-status', { ids, status });
    return res.data;
  },

  bulkDelete: async (ids: (number | string)[]) => {
    const res = await api.post('/admin/internships/bulk-delete', { ids });
    return res.data;
  },

  exportCSV: (params: Record<string, any> = {}) => {
    const token = typeof window !== 'undefined' ? getActiveToken() : '';
    const queryParams = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v !== '' && v != null))
    ).toString();
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://backend.blueboxx.in/api';
    const url = `${baseUrl}/admin/internships/export${queryParams ? '?' + queryParams : ''}`;
    // Use fetch with auth header for file download
    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.blob())
      .then(blob => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'internships_export.csv';
        a.click();
      });
  },

  // ─── Applications ────────────────────────────────────────────────────────────
  useAllApplications: (params: Record<string, any> = {}) => {
    const query = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v !== '' && v != null))
    ).toString();
    const url = `/admin/internships/all-applications${query ? '?' + query : ''}`;
    const { data, error, mutate, isLoading } = useSWR(url, fetcher, { keepPreviousData: true });
    return {
      data: extractArray(data),
      meta: data?.data?.current_page ? data.data : (data?.current_page ? data : {}),
      isLoading,
      isError: !!error,
      mutate,
    };
  },

  useInternshipApplications: (internshipId: number | string, params: Record<string, any> = {}) => {
    const query = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v !== '' && v != null))
    ).toString();
    const url = internshipId
      ? `/admin/internships/${internshipId}/applications${query ? '?' + query : ''}`
      : null;
    const { data, error, mutate, isLoading } = useSWR(url, fetcher, { keepPreviousData: true });
    return {
      data: extractArray(data),
      meta: data?.data?.current_page ? data.data : (data?.current_page ? data : {}),
      isLoading,
      isError: !!error,
      mutate,
    };
  },

  getApplication: async (id: number | string) => {
    const res = await api.get(`/admin/internships/applications/${id}`);
    return res.data;
  },

  updateApplicationStatus: async (id: number | string, status: string, internalNotes?: string) => {
    const res = await api.put(`/admin/internships/applications/${id}/status`, {
      status,
      internal_notes: internalNotes,
    });
    return res.data;
  },

  // ─── Tasks ───────────────────────────────────────────────────────────────────
  useInternshipTasks: (internshipId: number | string) => {
    const url = internshipId ? `/admin/internships/${internshipId}/tasks` : null;
    const { data, error, mutate, isLoading } = useSWR(url, fetcher);
    return {
      data: extractArray(data),
      isLoading,
      isError: !!error,
      mutate,
    };
  },

  createTask: async (data: Record<string, any>) => {
    const res = await api.post('/admin/internships/tasks', data);
    return res.data;
  },

  updateTask: async (id: number | string, data: Record<string, any>) => {
    const res = await api.put(`/admin/internships/tasks/${id}`, data);
    return res.data;
  },

  deleteTask: async (id: number | string) => {
    const res = await api.delete(`/admin/internships/tasks/${id}`);
    return res.data;
  },

  // ─── Submissions ─────────────────────────────────────────────────────────────
  useAllSubmissions: (params: Record<string, any> = {}) => {
    const query = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v !== '' && v != null))
    ).toString();
    const url = `/admin/internships/all-submissions${query ? '?' + query : ''}`;
    const { data, error, mutate, isLoading } = useSWR(url, fetcher, { keepPreviousData: true });
    return {
      data: extractArray(data),
      meta: data?.data?.current_page ? data.data : (data?.current_page ? data : {}),
      isLoading,
      isError: !!error,
      mutate,
    };
  },

  gradeSubmission: async (
    submissionId: number | string,
    payload: { status: string; marks_obtained?: number; feedback?: string }
  ) => {
    const res = await api.put(`/admin/internships/submissions/${submissionId}/grade`, payload);
    return res.data;
  },
};
