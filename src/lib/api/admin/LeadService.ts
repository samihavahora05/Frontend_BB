import api from '../../axios';
import useSWR from 'swr';

const fetcher = (url: string) => api.get(url).then(res => res.data);

export const LeadService = {
  useCRMDashboard: () => {
    return useSWR('/admin/crm/dashboard', fetcher, { revalidateOnFocus: true });
  },

  useLeads: (params: { page?: number; per_page?: number; search?: string; status?: string; type?: string }) => {
    const query = new URLSearchParams();
    if (params.page) query.append('page', params.page.toString());
    if (params.per_page) query.append('per_page', params.per_page.toString());
    if (params.search) query.append('search', params.search);
    if (params.status && params.status !== 'All') query.append('status', params.status);
    if (params.type && params.type !== 'All') query.append('type', params.type);

    const url = `/admin/leads?${query.toString()}`;
    return useSWR(url, fetcher, { revalidateOnFocus: true });
  },

  getLead: async (id: number) => {
    const response = await api.get(`/admin/leads/${id}`);
    return response.data;
  },

  updateLead: async (id: number, data: { status?: string; assigned_admin_id?: number | null; internal_notes?: string }) => {
    const response = await api.put(`/admin/leads/${id}`, data);
    return response.data;
  },

  deleteLead: async (id: number) => {
    const response = await api.delete(`/admin/leads/${id}`);
    return response.data;
  },

  bulkDelete: async (ids: number[]) => {
    const response = await api.delete('/admin/leads/bulk', { data: { ids } });
    return response.data;
  },

  convertToStudent: async (id: number) => {
    const response = await api.post(`/admin/leads/${id}/convert`);
    return response.data;
  }
};
