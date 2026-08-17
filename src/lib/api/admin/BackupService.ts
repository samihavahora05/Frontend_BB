import useSWR from 'swr';
import api from '../../axios';

export const BackupService = {
  useBackups: (refreshInterval = 0) => {
    const { data, error, mutate, isLoading } = useSWR('/admin/backups', async (url) => {
      const res = await api.get(url);
      return res.data;
    }, { refreshInterval });

    return {
      backups: data?.data || [],
      isLoading,
      isError: error,
      mutate
    };
  },

  useSettings: () => {
    const { data, error, mutate, isLoading } = useSWR('/admin/backups/settings', async (url) => {
      const res = await api.get(url);
      return res.data.data;
    });

    return {
      settings: data || {},
      isLoading,
      isError: error,
      mutate
    };
  },

  updateSettings: async (settings: any) => {
    const res = await api.put('/admin/backups/settings', settings);
    return res.data;
  },

  generate: async (type: string) => {
    const res = await api.post('/admin/backups/generate', { type });
    return res.data;
  },

  restore: async (id: number | string) => {
    const res = await api.post(`/admin/backups/${id}/restore`);
    return res.data;
  },

  destroy: async (id: number | string) => {
    const res = await api.delete(`/admin/backups/${id}`);
    return res.data;
  },

  download: async (id: number | string, filename: string) => {
    const res = await api.get(`/admin/backups/${id}/download`, { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },
  
  useDashboardStats: (refreshInterval = 0) => {
    const { data, error, mutate, isLoading } = useSWR('/admin/backups/dashboard', async (url) => {
      const res = await api.get(url);
      return res.data.data;
    }, { refreshInterval });

    return {
      stats: data,
      isLoading,
      isError: error,
      mutate
    };
  },

  retry: async (id: number | string) => {
    const res = await api.post(`/admin/backups/${id}/retry`);
    return res.data;
  }
};
