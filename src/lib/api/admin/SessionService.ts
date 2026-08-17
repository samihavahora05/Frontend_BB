import useSWR from 'swr';
import api from '../../axios';

export const SessionService = {
  useSessions: () => {
    const { data, error, mutate, isLoading } = useSWR('/admin/security/sessions', async (url) => {
      const res = await api.get(url);
      return res.data.data;
    });

    return {
      sessions: data || [],
      isLoading,
      isError: error,
      mutate
    };
  },

  revokeSession: async (id: string) => {
    const res = await api.delete(`/admin/security/sessions/${id}`);
    return res.data;
  },

  revokeAllOthers: async () => {
    const res = await api.delete('/admin/security/sessions/others');
    return res.data;
  }
};
