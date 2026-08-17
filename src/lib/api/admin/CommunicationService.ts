import api from '../../axios';
import useSWR from 'swr';

const fetcher = (url: string) => api.get(url).then(res => res.data);

export const CommunicationService = {
  useInbox: (params: Record<string, any> = {}) => {
    const query = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v !== '' && v != null))
    ).toString();
    
    const { data, error, mutate, isLoading } = useSWR(`/admin/communication/inbox${query ? '?' + query : ''}`, fetcher);
    
    return {
      data: data?.data || [],
      meta: data || {},
      isLoading,
      isError: !!error,
      mutate,
    };
  },

  useBroadcasts: (params: Record<string, any> = {}) => {
    const query = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v !== '' && v != null))
    ).toString();
    
    const { data, error, mutate, isLoading } = useSWR(`/admin/communication/broadcasts${query ? '?' + query : ''}`, fetcher);
    
    return {
      data: data?.data || [],
      meta: data || {},
      isLoading,
      isError: !!error,
      mutate,
    };
  },

  getThread: async (id: number | string) => {
    const res = await api.get(`/admin/communication/threads/${id}`);
    return res.data;
  },

  sendMessage: async (data: any) => {
    const res = await api.post(`/admin/communication/messages`, data);
    return res.data;
  },

  deleteThread: async (id: number) => {
    const res = await api.delete(`/admin/communication/threads/${id}`);
    return res.data;
  },

  deleteBroadcast: async (id: number) => {
    const res = await api.delete(`/admin/communication/broadcasts/${id}`);
    return res.data;
  },

  sendBroadcast: async (data: any) => {
    const res = await api.post(`/admin/communication/broadcasts`, data);
    return res.data;
  },

  // Announcements

  useAnnouncements: (params: Record<string, any> = {}) => {
    const query = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v !== '' && v != null))
    ).toString();
    
    const { data, error, mutate, isLoading } = useSWR(`/admin/communication/announcements${query ? '?' + query : ''}`, fetcher);
    
    return {
      data: data?.data || [],
      meta: data || {},
      isLoading,
      isError: !!error,
      mutate,
    };
  },

  createAnnouncement: async (data: any) => {
    const res = await api.post(`/admin/communication/announcements`, data);
    return res.data;
  },

  updateAnnouncement: async (id: number, data: any) => {
    const res = await api.put(`/admin/communication/announcements/${id}`, data);
    return res.data;
  },

  deleteAnnouncement: async (id: number) => {
    const res = await api.delete(`/admin/communication/announcements/${id}`);
    return res.data;
  },

  // Course Q&A
  
  useCourseQA: (params: Record<string, any> = {}) => {
    const query = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v !== '' && v != null))
    ).toString();
    
    const { data, error, mutate, isLoading } = useSWR(`/admin/course-qa${query ? '?' + query : ''}`, fetcher);
    
    return {
      data: data?.data || [],
      meta: data || {},
      isLoading,
      isError: !!error,
      mutate,
    };
  },

  approveCourseQA: async (id: number) => {
    const res = await api.put(`/admin/course-qa/${id}/status`, { status: 'Resolved' });
    return res.data;
  },

  deleteCourseQA: async (id: number) => {
    const res = await api.delete(`/admin/course-qa/${id}`);
    return res.data;
  }
};
