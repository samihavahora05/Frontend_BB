import useSWR from 'swr';
import api from '../../axios';

export const MessageService = {
  useUnreadSummary: (isAuthenticated: boolean = false) => {
    const { data, error, mutate } = useSWR(
      // Only fetch if the user is authenticated — prevents 401s on public pages
      isAuthenticated ? '/messages/unread' : null,
      async (url) => {
        const res = await api.get(url);
        return res.data;
      },
      {
        refreshInterval: isAuthenticated ? 30000 : 0, // only poll when logged in
        revalidateOnFocus: false,
      }
    );

    return {
      data: data?.data || { unread_count: 0, messages: [] },
      isLoading: isAuthenticated && !error && !data,
      isError: error,
      mutate
    };
  }
};
