import api from '../../axios';
import useSWR from 'swr';

export interface Course {
  id: number;
  category_id: number;
  level_id: number | null;
  expert_id: number;
  title: string;
  slug: string;
  short_description: string;
  description: string;
  thumbnail: string | null;
  preview_video_url: string | null;
  demo_pdf_url: string | null;
  landing_page_url: string | null;
  price: string;
  discount_price: string | null;
  course_type: string;
  language: string;
  duration: string | null;
  status: 'Draft' | 'Published' | 'Private' | 'Pending Approval' | 'Rejected';
  is_featured: boolean;
  is_archived: boolean;
  created_at: string;
  category: any;
  level: any;
  expert: any;
}

export const CourseService = {
  useCourses(params?: Record<string, any>) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '' && value !== null) {
          searchParams.append(key, String(value));
        }
      });
    }
    const queryString = searchParams.toString();
    const url = `/admin/courses${queryString ? `?${queryString}` : ''}`;
    
    const { data, error, mutate, isLoading } = useSWR(url, async (u) => {
      const res = await api.get(u);
      return res.data;
    });

    return {
      data: (data?.data as Course[]) || [],
      meta: data?.pagination || {},
      isLoading,
      isError: error,
      mutate,
    };
  },

  async get(id: number) {
    const res = await api.get(`/admin/courses/${id}`);
    return res.data?.data as Course;
  },

  async create(data: FormData) {
    const res = await api.post('/admin/courses', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },

  async update(id: number, data: FormData) {
    data.append('_method', 'PUT');
    const res = await api.post(`/admin/courses/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },

  async delete(id: number) {
    const res = await api.delete(`/admin/courses/${id}`);
    return res.data;
  },

  async duplicate(id: number) {
    const res = await api.post(`/admin/courses/${id}/duplicate`);
    return res.data;
  },

  async updateStatus(id: number, status: string) {
    const res = await api.post(`/admin/courses/${id}/update-status`, { status });
    return res.data;
  },

  async toggleArchive(id: number) {
    const res = await api.post(`/admin/courses/${id}/toggle-archive`);
    return res.data;
  },

  async bulkDelete(ids: number[]) {
    const res = await api.post('/admin/courses/bulk-delete', { ids });
    return res.data;
  },

  async bulkStatus(ids: number[], status: string) {
    const res = await api.post('/admin/courses/bulk-status', { ids, status });
    return res.data;
  }
};
