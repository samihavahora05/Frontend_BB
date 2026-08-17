import useSWR from 'swr';
import api from '../../axios';

export const CertificateApiService = {
  // Stats
  useStats() {
    const { data, error, mutate, isLoading } = useSWR('/admin/certificates/stats', (url) => api.get(url).then(res => res.data.data));
    return { data, error, mutate, isLoading };
  },

  // Issued Certificates
  useCertificates(params?: Record<string, any>) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '' && value !== null) {
          searchParams.append(key, String(value));
        }
      });
    }
    const queryString = searchParams.toString();
    const url = `/admin/certificates${queryString ? `?${queryString}` : ''}`;
    
    const { data, error, mutate, isLoading } = useSWR(url, (u) => api.get(u).then(res => res.data));
    return {
      data: data?.data || [],
      meta: data?.pagination || {},
      error,
      mutate,
      isLoading
    };
  },

  issueCertificate: async (data: any) => {
    const res = await api.post('/admin/certificates', data);
    return res.data.data;
  },

  updateStatus: async (id: number, status: string) => {
    const res = await api.put(`/admin/certificates/${id}/status`, { status });
    return res.data.data;
  },

  deleteCertificate: async (id: number) => {
    await api.delete(`/admin/certificates/${id}`);
  },

  // Templates
  useTemplates() {
    const { data, error, mutate, isLoading } = useSWR('/admin/certificates/templates', (url) => api.get(url).then(res => res.data.data));
    return { data: data || [], error, mutate, isLoading };
  },
  
  createTemplate: async (data: FormData) => {
    const res = await api.post('/admin/certificates/templates', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data.data;
  },

  updateTemplate: async (id: string | number, data: FormData) => {
    if (data instanceof FormData && !data.has('_method')) {
      data.append('_method', 'PUT');
    }
    const res = await api.post(`/admin/certificates/templates/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data.data;
  },

  deleteTemplate: async (id: string | number) => {
    await api.delete(`/admin/certificates/templates/${id}`);
  },

  // Fonts
  useFonts() {
    const { data, error, mutate, isLoading } = useSWR('/admin/certificates/fonts', (url) => api.get(url).then(res => res.data.data));
    return { data: data || [], error, mutate, isLoading };
  },
  
  createFont: async (data: FormData) => {
    const res = await api.post('/admin/certificates/fonts', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data.data;
  },

  deleteFont: async (id: number) => {
    await api.delete(`/admin/certificates/fonts/${id}`);
  },

  // Settings
  useSettings() {
    const { data, error, mutate, isLoading } = useSWR('/admin/certificates/settings', (url) => api.get(url).then(res => res.data.data));
    return { data, error, mutate, isLoading };
  },

  updateSettings: async (data: any) => {
    const res = await api.put('/admin/certificates/settings', data);
    return res.data.data;
  }
};
