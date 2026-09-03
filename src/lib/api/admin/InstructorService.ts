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
    
    const { data, error, mutate, isLoading } = useSWR(url, async (u) => {
      try {
        const res = await api.get(u);
        if (res?.data) return res.data;
      } catch (err) {
        try {
          const fallback = await api.get(`/admin/users?role=expert${query ? '&' + query : ''}`);
          if (fallback?.data) return fallback.data;
        } catch {}
      }
      return { data: [] };
    }, { keepPreviousData: true });
    
    const rawList = Array.isArray(data?.data)
      ? data.data
      : Array.isArray(data?.data?.data)
        ? data.data.data
        : Array.isArray(data?.instructors)
          ? data.instructors
          : Array.isArray(data)
            ? data
            : [];

    return {
      data: rawList,
      meta: data?.meta || data?.pagination || data?.data?.pagination || {},
      isLoading,
      isError: !!error,
      mutate
    };
  },

  getInstructorDetails: async (id: string | number) => {
    try {
      const response = await api.get(`/admin/instructors/${id}`);
      return response.data;
    } catch {
      const response = await api.get(`/admin/users/${id}`);
      return response.data;
    }
  },

  createInstructor: async (data: any) => {
    if (typeof FormData !== 'undefined' && data instanceof FormData) {
      const fn = (data.get('first_name') as string) || '';
      const ln = (data.get('last_name') as string) || '';
      const fullName = `${fn} ${ln}`.trim() || fn || 'Expert';
      if (!data.has('name') || !data.get('name')) {
        data.set('name', fullName);
      }
      if (!data.has('role')) {
        data.set('role', 'expert');
      }
    } else if (data && typeof data === 'object') {
      const fullName = `${data.first_name || ''} ${data.last_name || ''}`.trim() || data.first_name || 'Expert';
      if (!data.name) {
        data.name = fullName;
      }
      if (!data.role) {
        data.role = 'expert';
      }
    }

    try {
      const response = await api.post('/admin/instructors', data);
      return response.data;
    } catch {
      const response = await api.post('/admin/users', data);
      return response.data;
    }
  },

  updateInstructor: async (id: string | number, data: any) => {
    if (typeof FormData !== 'undefined' && data instanceof FormData) {
      const fn = (data.get('first_name') as string) || '';
      const ln = (data.get('last_name') as string) || '';
      const fullName = `${fn} ${ln}`.trim() || fn;
      if (fullName && (!data.has('name') || !data.get('name'))) {
        data.set('name', fullName);
      }
      if (!data.has('_method')) {
        data.append('_method', 'PUT');
      }
      try {
        const response = await api.post(`/admin/instructors/${id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
      } catch {
        const response = await api.post(`/admin/users/${id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
      }
    }

    if (data && typeof data === 'object') {
      const fullName = `${data.first_name || ''} ${data.last_name || ''}`.trim() || data.first_name;
      if (fullName && !data.name) {
        data.name = fullName;
      }
    }

    try {
      const response = await api.put(`/admin/instructors/${id}`, data);
      return response.data;
    } catch {
      const response = await api.put(`/admin/users/${id}`, data);
      return response.data;
    }
  },

  deleteInstructor: async (id: string | number) => {
    try {
      const response = await api.delete(`/admin/instructors/${id}`);
      return response.data;
    } catch {
      const response = await api.delete(`/admin/users/${id}`);
      return response.data;
    }
  },

  updateInstructorStatus: async (id: string | number, status: string, notes?: string) => {
    try {
      const response = await api.put(`/admin/instructors/${id}/status`, { status, notes });
      return response.data;
    } catch {
      const response = await api.put(`/admin/users/${id}`, { status });
      return response.data;
    }
  },

  resetPassword: async (id: string | number) => {
    try {
      const response = await api.post(`/admin/instructors/${id}/reset-password`);
      return response.data;
    } catch {
      const response = await api.post(`/admin/users/${id}/reset-password`);
      return response.data;
    }
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

