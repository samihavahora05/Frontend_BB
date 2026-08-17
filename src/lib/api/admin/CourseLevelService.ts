import api from '../../axios';
import useSWR from 'swr';

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export const CourseLevelService = {
  useLevels: (params: Record<string, any> = {}) => {
    const query = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v !== '' && v != null))
    ).toString();
    const url = `/admin/course-levels${query ? '?' + query : ''}`;
    
    const { data, error, mutate, isLoading } = useSWR(url, fetcher, { keepPreviousData: true });
    
    return {
      data: data?.data || (Array.isArray(data) ? data : []),
      meta: data?.meta || {},
      isLoading,
      isError: !!error,
      mutate
    };
  },

  get: async (id: string | number) => {
    const response = await api.get(`/admin/course-levels/${id}`);
    return response.data;
  },

  create: async (data: Record<string, any>) => {
    const response = await api.post('/admin/course-levels', data);
    return response.data;
  },

  update: async (id: string | number, data: Record<string, any>) => {
    const response = await api.put(`/admin/course-levels/${id}`, data);
    return response.data;
  },

  delete: async (id: string | number) => {
    const response = await api.delete(`/admin/course-levels/${id}`);
    return response.data;
  },

  bulkDelete: async (ids: number[]) => {
    const response = await api.post(`/admin/course-levels/bulk-delete`, { ids });
    return response.data;
  },

  bulkStatus: async (ids: number[], status: string) => {
    const response = await api.post(`/admin/course-levels/bulk-status`, { ids, status });
    return response.data;
  },

  exportCSV: async (params: Record<string, any> = {}) => {
    const query = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v !== '' && v != null))
    ).toString();
    const url = `/admin/course-levels/export${query ? '?' + query : ''}`;
    
    try {
      const response = await api.get(url, { responseType: 'blob' });
      const blob = new Blob([response.data], { type: 'text/csv' });
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `course_levels_export_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Export failed', error);
      throw error;
    }
  }
};
