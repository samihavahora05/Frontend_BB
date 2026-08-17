import api from '../../axios';
import { getActiveToken } from '../../authUtils';
import useSWR from 'swr';

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export const EnrollmentService = {
  useEnrollments: (params: Record<string, any> = {}) => {
    const query = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v !== '' && v != null))
    ).toString();
    const url = `/admin/enrollments${query ? '?' + query : ''}`;
    
    // AdminCourseEnrollmentController paginates directly without standard resource wrapping.
    const { data, error, mutate, isLoading } = useSWR(url, fetcher, { keepPreviousData: true });
    
    return {
      data: data?.data || [],
      meta: {
        current_page: data?.current_page,
        from: data?.from,
        last_page: data?.last_page,
        per_page: data?.per_page,
        to: data?.to,
        total: data?.total,
      },
      isLoading,
      isError: !!error,
      mutate,
    };
  },

  getEnrollmentDetails: async (id: string | number) => {
    const response = await api.get(`/admin/enrollments/${id}`);
    return response.data;
  },

  updateStatus: async (id: string | number, status: string) => {
    const response = await api.put(`/admin/enrollments/${id}/status`, { status });
    return response.data;
  },

  deleteEnrollment: async (id: string | number) => {
    const response = await api.delete(`/admin/enrollments/${id}`);
    return response.data;
  },

  exportCSV: (status?: string) => {
    const token = typeof window !== 'undefined' ? getActiveToken() : '';
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://backend.blueboxx.in/api';
    const query = status && status !== 'All' ? `&status=${status}` : '';
    window.open(`${baseUrl}/admin/enrollments/export?token=${token}${query}`, '_blank');
  }
};
