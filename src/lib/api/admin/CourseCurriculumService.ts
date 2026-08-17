import useSWR from 'swr';
import api from '../../axios';

export interface Lesson {
  id: number;
  module_id: number;
  title: string;
  type: string;
  content: string | null;
  video_url: string | null;
  duration_minutes: number | null;
  order: number;
}

export interface Module {
  id: number;
  course_id: number;
  title: string;
  order: number;
  lessons: Lesson[];
}

export const CourseCurriculumService = {
  useCurriculum(courseId: number | undefined) {
    const { data, error, mutate, isLoading } = useSWR(
      courseId ? `/admin/courses/${courseId}/curriculum` : null,
      (url: string) => api.get(url).then(res => res.data.data)
    );

    return {
      data: data as Module[] || [],
      isLoading,
      error,
      mutate
    };
  },

  // Modules
  createModule: async (courseId: number, data: { title: string }) => {
    const res = await api.post(`/admin/courses/${courseId}/curriculum/modules`, data);
    return res.data.data;
  },
  
  updateModule: async (moduleId: number, data: { title: string }) => {
    const res = await api.put(`/admin/curriculum/modules/${moduleId}`, data);
    return res.data.data;
  },
  
  deleteModule: async (moduleId: number) => {
    await api.delete(`/admin/curriculum/modules/${moduleId}`);
  },
  
  reorderModules: async (orderedIds: number[]) => {
    await api.put(`/admin/curriculum/modules/reorder`, { ordered_ids: orderedIds });
  },

  // Lessons
  createLesson: async (moduleId: number, data: any) => {
    const res = await api.post(`/admin/curriculum/modules/${moduleId}/lessons`, data);
    return res.data.data;
  },
  
  updateLesson: async (lessonId: number, data: any) => {
    const res = await api.put(`/admin/curriculum/lessons/${lessonId}`, data);
    return res.data.data;
  },
  
  deleteLesson: async (lessonId: number) => {
    await api.delete(`/admin/curriculum/lessons/${lessonId}`);
  },
  
  reorderLessons: async (orderedIds: number[]) => {
    await api.put(`/admin/curriculum/lessons/reorder`, { ordered_ids: orderedIds });
  }
};
