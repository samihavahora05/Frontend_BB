import api from '../../axios';
import useSWR from 'swr';

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export const LogService = {
  useLogs: (params?: { page?: number; per_page?: number; search?: string }) => {
    let url = '/admin/logs';
    if (params) {
      const query = new URLSearchParams();
      if (params.page) query.append('page', params.page.toString());
      if (params.per_page) query.append('per_page', params.per_page.toString());
      if (params.search) query.append('search', params.search);
      url += `?${query.toString()}`;
    }
    return useSWR(url, fetcher);
  }
};
