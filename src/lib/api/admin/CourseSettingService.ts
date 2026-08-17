import api from '../../axios';
import useSWR from 'swr';

export interface CourseSetting {
  id: number;
  course_approval_required: boolean;
  hide_reviews: boolean;
  expiry_email_days: number | null;
  created_at: string;
  updated_at: string;
}

export const CourseSettingService = {
  useSettings() {
    const { data, error, mutate, isLoading } = useSWR('/admin/course-settings', async (url) => {
      const res = await api.get(url);
      return res.data?.data as CourseSetting;
    });

    return {
      data,
      isLoading,
      isError: error,
      mutate,
    };
  },

  async update(data: { course_approval_required: boolean; hide_reviews: boolean; expiry_email_days: number | null }) {
    const res = await api.put('/admin/course-settings', data);
    return res.data;
  },
};
