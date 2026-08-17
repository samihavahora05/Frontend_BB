import api from '../../axios';
import { getActiveToken } from '../../authUtils';
import useSWR from 'swr';

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export const JobService = {

  useJobs: (params: Record<string, any> = {}) => {
    const query = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v !== '' && v != null))
    ).toString();
    const url = `/admin/jobs${query ? '?' + query : ''}`;
    const { data, error, mutate, isLoading } = useSWR(url, fetcher, { 
      keepPreviousData: true,
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    });
    const items = Array.isArray(data) 
      ? data 
      : Array.isArray(data?.data) 
        ? data.data 
        : (Array.isArray(data?.data?.data) ? data.data.data : []);
    return {
      data: items,
      meta: data?.data?.current_page ? data.data : (data?.current_page ? data : {}),
      isLoading,
      isError: !!error,
      mutate,
    };
  },

  getJobDetails: async (id: string | number) => {
    const response = await api.get(`/admin/jobs/${id}`);
    return response.data;
  },

  createJob: async (data: any) => {
    const response = await api.post('/admin/jobs', data);
    return response.data;
  },

  updateJob: async (id: string | number, data: any) => {
    const response = await api.put(`/admin/jobs/${id}`, data);
    return response.data;
  },

  deleteJob: async (id: string | number) => {
    const response = await api.delete(`/admin/jobs/${id}`);
    return response.data;
  },

  bulkDeleteJobs: async (ids: number[]) => {
    const response = await api.post('/admin/jobs/bulk-delete', { ids });
    return response.data;
  },

  useDashboardMetrics: () => {
    const { data, error, isLoading, mutate } = useSWR('/admin/jobs/dashboard-metrics', fetcher, {
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    });
    return { data: data?.data || data, error, isLoading, mutate };
  },

  exportCSV: () => {
    const token = typeof window !== 'undefined' ? getActiveToken() : '';
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://backend.blueboxx.in/api';
    const url = `${baseUrl}/admin/jobs/export`;
    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.blob())
      .then(blob => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'jobs-export.csv';
        a.click();
      });
  },
};
