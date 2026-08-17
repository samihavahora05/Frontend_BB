import api from '../../axios';
import useSWR from 'swr';

export interface CourseQuestion {
  id: number;
  course_id: number;
  student_id: number;
  title: string;
  question: string;
  status: 'Pending' | 'Answered' | 'Resolved' | 'Closed';
  is_pinned: boolean;
  is_reported: boolean;
  reported_reason: string | null;
  resolved_at: string | null;
  closed_at: string | null;
  created_at: string;
  answers_count: number;
  student: any;
  course: any;
  answers?: any[];
}

export const CourseQAService = {
  useQuestions(params?: { search?: string; status?: string; per_page?: number; page?: number }) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          searchParams.append(key, String(value));
        }
      });
    }
    const queryString = searchParams.toString();
    const url = `/admin/course-qa${queryString ? `?${queryString}` : ''}`;
    
    const { data, error, mutate, isLoading } = useSWR(url, async (u) => {
      const res = await api.get(u);
      return res.data;
    });

    return {
      data: (data?.data as CourseQuestion[]) || [],
      meta: data || {},
      isLoading,
      isError: error,
      mutate,
    };
  },

  useStats() {
    const { data, error, mutate, isLoading } = useSWR('/admin/course-qa/stats', async (u) => {
      const res = await api.get(u);
      return res.data?.data;
    });

    return {
      data: data || { total: 0, pending: 0, answered: 0, resolved: 0, reported: 0, active: 0 },
      isLoading,
      isError: error,
      mutate,
    };
  },

  async getQuestion(id: number) {
    const res = await api.get(`/admin/course-qa/${id}`);
    return res.data?.data as CourseQuestion;
  },

  async reply(id: number, content: string) {
    const res = await api.post(`/admin/course-qa/${id}/reply`, { content });
    return res.data;
  },

  async updateStatus(id: number, status: string) {
    const res = await api.put(`/admin/course-qa/${id}/status`, { status });
    return res.data;
  },

  async togglePin(id: number) {
    const res = await api.put(`/admin/course-qa/${id}/pin`);
    return res.data;
  },

  async markSpam(id: number) {
    const res = await api.put(`/admin/course-qa/${id}/spam`);
    return res.data;
  },

  async delete(id: number) {
    const res = await api.delete(`/admin/course-qa/${id}`);
    return res.data;
  },

  async bulkDelete(ids: number[]) {
    const res = await api.post('/admin/course-qa/bulk-delete', { ids });
    return res.data;
  }
};
