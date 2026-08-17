import api from '../../axios';
import useSWR from 'swr';

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export const AnalyticsService = {
  useSummary: () => {
    const { data, error, isLoading } = useSWR('/admin/analytics/summary', fetcher);
    return { data: data?.data, isLoading, isError: !!error };
  },

  useTabStats: (tab: string) => {
    const { data, error, isLoading } = useSWR(`/admin/analytics/tab-stats?tab=${tab}`, fetcher);
    return { data: data?.data, isLoading, isError: !!error };
  },

  useChartData: (tab: string, metric: string) => {
    const { data, error, isLoading } = useSWR(`/admin/analytics/chart-data?tab=${tab}&metric=${metric}`, fetcher);
    return { data: data?.data, isLoading, isError: !!error };
  },

  useLeaderboards: () => {
    const { data, error, isLoading } = useSWR('/admin/analytics/leaderboards', fetcher);
    return { data: data?.data, isLoading, isError: !!error };
  },

  useRecentActivity: () => {
    const { data, error, isLoading } = useSWR('/admin/analytics/recent-activity', fetcher);
    return { data: data?.data, isLoading, isError: !!error };
  }
};
