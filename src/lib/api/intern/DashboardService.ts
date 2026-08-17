import useSWR from 'swr';
import api from '../../axios';

export const DashboardService = {
  useDashboard: () => {
    return useSWR('/intern/dashboard', async (url) => {
      const res = await api.get(url);
      return res.data;
    });
  },

  useApplications: () => {
    return useSWR('/intern/applications', async (url) => {
      const res = await api.get(url);
      return res.data;
    });
  },

  useSessions: () => {
    return useSWR('/intern/mentor-sessions', async (url) => {
      const res = await api.get(url);
      return res.data;
    });
  },

  useSettings: () => {
    return useSWR('/intern/settings', async (url) => {
      const res = await api.get(url);
      return res.data;
    });
  },

  updateSettings: async (data: any) => {
    const res = await api.put('/intern/settings', data);
    return res.data;
  },

  useResume: () => {
    return useSWR('/intern/resume', async (url) => {
      const res = await api.get(url);
      return res.data;
    });
  },

  uploadResume: async (file: File) => {
    const formData = new FormData();
    formData.append('resume', file);
    const res = await api.post('/intern/resume', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return res.data;
  }
};
