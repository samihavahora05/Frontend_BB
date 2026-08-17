import api from '../axios';
import useSWR from 'swr';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface CourseSummary {
  id: number;
  slug: string;
  title: string;
  short_description: string;
  thumbnail: string | null;
  price: number;
  discount_price: number | null;
  course_type: 'Free' | 'Paid';
  language: string;
  duration: string;
  is_featured: boolean;
  category: { id: number; name: string; slug: string } | null;
  level: { id: number; name: string } | null;
  enrolled_count: number;
}

export interface CourseDetail extends CourseSummary {
  description: string;
  preview_video_url: string | null;
  duration_hours: number;
  total_lessons: number;
  total_minutes: number;
  curriculum: Array<{
    id: number;
    title: string;
    order: number;
    lessons: Array<{
      id: number;
      title: string;
      type: string;
      duration_minutes: number;
    }>;
  }>;
}

export interface CourseFilters {
  search?: string;
  category?: string;
  level?: string;
  type?: 'free' | 'paid';
  min_price?: number;
  max_price?: number;
  featured?: boolean;
  sort?: 'newest' | 'oldest' | 'price_low' | 'price_high';
  page?: number;
  per_page?: number;
}

// ─── Public Course Service ────────────────────────────────────────────────────

export const PublicCourseService = {
  /**
   * SWR hook for course listing with filters
   */
  useCourses(filters: CourseFilters = {}) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') {
        params.append(k, String(v));
      }
    });
    const key = `/public/courses?${params.toString()}`;
    const { data, error, isLoading, mutate } = useSWR(key, (url) =>
      api.get(url).then((r) => r.data)
    );
    return {
      courses: (data?.data ?? []) as CourseSummary[],
      pagination: data?.pagination ?? null,
      error,
      isLoading,
      mutate,
    };
  },

  /**
   * SWR hook for a single course detail page
   */
  useCourse(slug: string | null) {
    const { data, error, isLoading } = useSWR(
      slug ? `/public/courses/${slug}` : null,
      (url) => api.get(url).then((r) => r.data.data)
    );
    return { course: (data ?? null) as CourseDetail | null, error, isLoading };
  },

  /**
   * SWR hook for enrollment status (requires user to be logged in)
   */
  useEnrollStatus(slug: string | null) {
    const { data, error, isLoading, mutate } = useSWR(
      slug ? `/public/courses/${slug}/enroll-status` : null,
      (url) => api.get(url).then((r) => r.data)
    );
    return {
      isEnrolled: data?.is_enrolled ?? false,
      status: data?.status ?? null,
      error,
      isLoading,
      mutate,
    };
  },

  /**
   * SWR hook for featured courses (homepage hero/carousel)
   */
  useFeaturedCourses() {
    const { data, error, isLoading } = useSWR('/public/featured-courses', (url) =>
      api.get(url).then((r) => r.data.data)
    );
    return { courses: (data ?? []) as CourseSummary[], error, isLoading };
  },

  /**
   * SWR hook for all course categories (filter sidebar)
   */
  useCategories() {
    const { data, error } = useSWR('/public/course-categories', (url) =>
      api.get(url).then((r) => r.data.data)
    );
    return { categories: data ?? [], error };
  },

  /**
   * SWR hook for all course levels (filter sidebar)
   */
  useLevels() {
    const { data, error } = useSWR('/public/course-levels', (url) =>
      api.get(url).then((r) => r.data.data)
    );
    return { levels: data ?? [], error };
  },
};
