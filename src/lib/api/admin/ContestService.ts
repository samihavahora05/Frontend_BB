import api from '../../axios';
import useSWR from 'swr';

const fetcher = (url: string) => api.get(url).then(res => res.data);

export interface AdminContestPayload {
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  category_id?: number | null;
  college_id?: number | null;
}

export const ContestService = {
  useContests: (params: { page?: number; per_page?: number; search?: string } = {}) => {
    const query = new URLSearchParams();
    if (params.page) query.append('page', params.page.toString());
    if (params.per_page) query.append('per_page', params.per_page.toString());
    if (params.search) query.append('search', params.search);

    const url = `/admin/contests?${query.toString()}`;
    return useSWR(url, fetcher, { revalidateOnFocus: true });
  },

  createContest: async (data: AdminContestPayload) => {
    const response = await api.post('/admin/contests', data);
    return response.data;
  },

  updateContest: async (id: number | string, data: Partial<AdminContestPayload>) => {
    const response = await api.put(`/admin/contests/${id}`, data);
    return response.data;
  },

  deleteContest: async (id: number | string) => {
    const response = await api.delete(`/admin/contests/${id}`);
    return response.data;
  },

  useRegistrations: () => {
    return useSWR('/admin/contests/registrations', fetcher, { revalidateOnFocus: true });
  },

  useSubmissions: () => {
    return useSWR('/admin/contests/submissions', fetcher, { revalidateOnFocus: true });
  },
};
