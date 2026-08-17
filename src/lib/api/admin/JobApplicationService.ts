import api from '../../axios';
import useSWR from 'swr';

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export const JobApplicationService = {
  useJobApplications: (jobId?: string | string[], page = 1, perPage = 15) => {
    const endpoint = jobId ? `/admin/jobs/${jobId}/applications?page=${page}&per_page=${perPage}` : null;
    const { data, error, mutate, isLoading } = useSWR(endpoint, fetcher);
    
    const applications = data?.data || data || [];
    
    return {
      data: applications,
      meta: data?.meta || {},
      isLoading,
      isError: error,
      mutate
    };
  },

  getApplicationDetails: async (id: string | number) => {
    const response = await api.get(`/admin/job-applications/${id}`);
    return response.data;
  },

  updateStatus: async (id: string | number, status: string, notes?: string) => {
    const response = await api.put(`/admin/job-applications/${id}/status`, { status, notes });
    return response.data;
  },

  scheduleInterview: async (id: string | number, payload: any) => {
    const response = await api.post(`/admin/job-applications/${id}/interviews`, payload);
    return response.data;
  }
};
