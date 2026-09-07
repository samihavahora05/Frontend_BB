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

  importCSV: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/admin/jobs/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

    downloadSampleCSV: async () => {
    try {
      const res = await api.get('/admin/jobs/sample-csv', { responseType: 'blob' });
      const blob = new Blob([res.data], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'jobs-sample-template.csv';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download sample CSV', err);
      throw err;
    }
  },

  useDashboardMetrics: () => {
    const { data, error, isLoading, mutate } = useSWR('/admin/jobs/dashboard-metrics', fetcher, {
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    });
    return { data: data?.data || data, error, isLoading, mutate };
  },

    exportCSV: async () => {
    try {
      const res = await api.get('/admin/jobs/export', { responseType: 'blob' });
      const blob = new Blob([res.data], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'jobs-export.csv';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to export CSV', err);
      throw err;
    }
  },
};

