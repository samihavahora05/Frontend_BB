import useSWR from 'swr';
import api from '../../axios';
import toast from 'react-hot-toast';

export const NotificationService = {
  useNotifications: (isAuthenticated: boolean = false) => {
    const { data, error, mutate } = useSWR(
      // Only fetch if the user is authenticated — prevents 401s on public pages
      isAuthenticated ? '/admin/notifications' : null,
      async (url) => {
        const res = await api.get(url);
        return res.data;
      },
      {
        refreshInterval: isAuthenticated ? 30000 : 0, // only poll when logged in
        revalidateOnFocus: false,
      }
    );

    const notifications = data?.data || [];
    const unreadCount = notifications.filter((n: any) => !n.read_at).length;

    const markAllRead = async () => {
      try {
        await api.put('/admin/notifications/read-all');
        mutate(
          { ...data, data: notifications.map((n: any) => ({ ...n, read_at: new Date().toISOString() })) },
          false
        );
        toast.success('All notifications marked as read');
        mutate();
      } catch (err) {
        toast.error('Failed to mark notifications as read');
      }
    };

    const markAsRead = async (id: string) => {
      try {
        await api.put(`/admin/notifications/${id}/read`);
        mutate(
          { 
            ...data, 
            data: notifications.map((n: any) => n.id === id ? { ...n, read_at: new Date().toISOString() } : n) 
          },
          false
        );
      } catch (err) {
        console.error('Failed to mark notification as read');
      }
    };

    return {
      notifications,
      unreadCount,
      isLoading: isAuthenticated && !error && !data,
      isError: error,
      markAllRead,
      markAsRead,
      mutate
    };
  },
  
  useBadges: (isAuthenticated: boolean = false) => {
    const { data, error, mutate } = useSWR(
      isAuthenticated ? '/admin/notifications/badges' : null,
      async (url) => {
        const res = await api.get(url);
        return res.data;
      },
      {
        refreshInterval: isAuthenticated ? 60000 : 0, // poll every 60s
        revalidateOnFocus: false,
      }
    );

    return {
      badges: data?.badges || {},
      isLoading: isAuthenticated && !error && !data,
      isError: error,
      mutate
    };
  }
};
