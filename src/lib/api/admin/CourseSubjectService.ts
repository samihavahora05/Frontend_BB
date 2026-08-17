import api from '../../axios';
import useSWR from 'swr';

export interface CourseSubject {
  id: number;
  title: string;
  slug: string;
  status: boolean;
  created_at: string;
  updated_at: string;
}

const fetcher = (url: string) => api.get(url).then(res => res.data);

export const CourseSubjectService = {
  useSubjects: (page = 1, perPage = 10, search = '') => {
    const { data, error, mutate, isLoading } = useSWR<{data: CourseSubject[], meta: any}>(
      `/admin/course-subjects?page=${page}&per_page=${perPage}&search=${search}`,
      fetcher
    );
    
    return {
      data: data?.data || [],
      meta: data?.meta,
      isLoading,
      isError: error,
      mutate
    };
  },

  create: async (data: { title: string }) => {
    const response = await api.post('/admin/course-subjects', data);
    return response.data;
  },

  update: async (id: number, data: { title: string }) => {
    const response = await api.put(`/admin/course-subjects/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/admin/course-subjects/${id}`);
    return response.data;
  },

  updateStatus: async (id: number, status: boolean) => {
    const response = await api.put(`/admin/course-subjects/${id}/status`, { status });
    return response.data;
  }
};
