import api from '../../axios';
import useSWR from 'swr';

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export const DashboardService = {
  /**
   * Fetch aggregated summary for the admin dashboard using SWR
   */
  useDashboardSummary: () => {
    return useSWR('/admin/dashboard/summary', fetcher, {
      revalidateOnFocus: false, // Don't spam the API when switching tabs
      refreshInterval: 60000,   // Refresh every minute
      fallbackData: { 
        success: true, 
        data: { 
          total_students: 0, 
          total_experts: 0, 
          courses: { total: 0 } 
        } 
      }
    });
  },

  useDashboardCharts: (period: string = 'this_month') => {
    return useSWR(`/admin/dashboard/charts?period=${period}`, fetcher);
  },

  useTopCourses: () => {
    return useSWR('/admin/dashboard/top/courses', fetcher);
  },

  useRecentEnrollments: () => {
    return useSWR('/admin/dashboard/recent/enrollments', fetcher);
  },
  
  useActivityFeed: () => {
    return useSWR('/admin/dashboard/feed', fetcher);
  }
};
