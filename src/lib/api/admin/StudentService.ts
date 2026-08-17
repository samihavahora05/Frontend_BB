import api from '../../axios';
import useSWR from 'swr';

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export const StudentService = {
  useStudents: (params: Record<string, any> = {}) => {
    const query = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v !== '' && v != null))
    ).toString();
    const url = `/admin/students${query ? '?' + query : ''}`;
    
    const { data, error, mutate, isLoading } = useSWR(url, fetcher, { keepPreviousData: true });
    
    return {
      data: data?.data || [],
      meta: data?.meta || {},
      isLoading,
      isError: !!error,
      mutate
    };
  },

  getStudentDetails: async (id: string | number) => {
    const response = await api.get(`/admin/students/${id}`);
    return response.data;
  },

  createStudent: async (data: FormData) => {
    // We expect FormData because of file uploads
    const response = await api.post('/admin/students', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  updateStudent: async (id: string | number, data: FormData) => {
    // For Laravel to process PUT with FormData, append _method='PUT'
    data.append('_method', 'PUT');
    const response = await api.post(`/admin/students/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  deleteStudent: async (id: string | number) => {
    const response = await api.delete(`/admin/students/${id}`);
    return response.data;
  },

  suspendStudent: async (id: string | number) => {
    const response = await api.put(`/admin/students/${id}/suspend`);
    return response.data;
  },

  activateStudent: async (id: string | number) => {
    const response = await api.put(`/admin/students/${id}/activate`);
    return response.data;
  },

  bulkDelete: async (ids: number[]) => {
    const response = await api.post(`/admin/students/bulk-delete`, { ids });
    return response.data;
  },

  bulkUpdateStatus: async (ids: number[], status: string) => {
    const response = await api.post(`/admin/students/bulk-status`, { ids, status });
    return response.data;
  },

  importStudents: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/admin/students/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  exportCSV: async (params: Record<string, any> = {}) => {
    const query = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v !== '' && v != null))
    ).toString();
    const url = `/admin/students/export${query ? '?' + query : ''}`;
    
    try {
      const response = await api.get(url, { responseType: 'blob' });
      const blob = new Blob([response.data], { type: 'text/csv' });
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `students_export_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Export failed', error);
      throw error;
    }
  },

  getSettings: async () => {
    const response = await api.get('/admin/students/settings');
    return response.data;
  },

  updateSettings: async (settings: Record<string, any>) => {
    const response = await api.post('/admin/students/settings', { settings });
    return response.data;
  }
};

