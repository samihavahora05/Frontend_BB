import api from '../../axios';
import { getActiveToken } from '../../authUtils';
import useSWR from 'swr';

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export const InstructorService = {
  useInstructors: (params: Record<string, any> = {}) => {
    const query = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v !== '' && v != null))
    ).toString();
    const url = `/admin/instructors${query ? '?' + query : ''}`;
    
    const { data, error, mutate, isLoading } = useSWR(url, fetcher, { keepPreviousData: true });
    
    return {
      data: data?.data || [],
      meta: data?.meta || {},
      isLoading,
      isError: !!error,
      mutate
    };
  },

  getInstructorDetails: async (id: string | number) => {
    const response = await api.get(`/admin/instructors/${id}`);
    return response.data;
  },

  createInstructor: async (data: any) => {
    const response = await api.post('/admin/instructors', data);
    return response.data;
  },

  updateInstructor: async (id: string | number, data: any) => {
    const response = await api.put(`/admin/instructors/${id}`, data);
    return response.data;
  },

  deleteInstructor: async (id: string | number) => {
    const response = await api.delete(`/admin/instructors/${id}`);
    return response.data;
  },

  updateInstructorStatus: async (id: string | number, status: string, notes?: string) => {
    const response = await api.put(`/admin/instructors/${id}/status`, { status, notes });
    return response.data;
  },

  resetPassword: async (id: string | number) => {
    const response = await api.post(`/admin/instructors/${id}/reset-password`);
    return response.data;
  },

  getDashboardMetrics: async () => {
    const response = await api.get('/admin/instructors/dashboard-metrics');
    return response.data;
  },

  exportCSV: () => {
    const token = typeof window !== 'undefined' ? getActiveToken() : '';
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://backend.blueboxx.in/api';
    window.open(`${baseUrl}/admin/instructors/export?token=${token}`, '_blank');
  }
};

