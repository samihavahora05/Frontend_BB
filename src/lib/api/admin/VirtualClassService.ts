import api from '../../axios';
import { getActiveToken } from '../../authUtils';
import useSWR from 'swr';

const fetcher = (url: string) => api.get(url).then(r => r.data);

export const VirtualClassService = {
  useVirtualClasses: (page = 1, perPage = 15, search = '', status = '') => {
    const key = `/admin/virtual-classes?page=${page}&per_page=${perPage}${search ? `&search=${search}` : ''}${status ? `&status=${status}` : ''}`;
    const { data, error, mutate, isLoading } = useSWR(key, fetcher);
    return {
      classes: data?.data || [],
      meta: data?.meta || {},
      isLoading,
      isError: error,
      mutate,
    };
  },

  useStats: () => {
    const { data } = useSWR('/admin/virtual-classes/stats', fetcher);
    return data?.data || {};
  },

  createClass: async (data: any) => {
    const response = await api.post('/admin/virtual-classes', data);
    return response.data;
  },

  updateClass: async (id: number, data: any) => {
    const response = await api.put(`/admin/virtual-classes/${id}`, data);
    return response.data;
  },

  updateStatus: async (id: number, status: string) => {
    const response = await api.put(`/admin/virtual-classes/${id}/status`, { status });
    return response.data;
  },

  deleteClass: async (id: number) => {
    const response = await api.delete(`/admin/virtual-classes/${id}`);
    return response.data;
  },

  exportCSV: (statusFilter = '') => {
    const token = typeof window !== 'undefined' ? getActiveToken() : '';
    const link = document.createElement('a');
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://backend.blueboxx.in/api';
    link.href = `${baseUrl}/admin/virtual-classes/export?token=${token}${statusFilter ? `&status=${statusFilter}` : ''}`;
    link.download = `virtual_classes_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  },
};

export const ZoomService = {
  useSettings: () => {
    const { data, mutate, isLoading } = useSWR('/admin/zoom-settings', fetcher);
    return {
      settings: data?.data || null,
      isLoading,
      mutate,
    };
  },

  updateSettings: async (data: any) => {
    const response = await api.put('/admin/zoom-settings', data);
    return response.data;
  },

  testConnection: async () => {
    const response = await api.post('/admin/zoom-settings/test-connection');
    return response.data;
  },
};
