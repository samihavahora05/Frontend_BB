import api from '../../axios';
import useSWR from 'swr';

const fetcher = (url: string) => api.get(url).then(res => res.data);

export const BlogService = {
  useBlogs: (params: Record<string, any> = {}) => {
    const query = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v !== '' && v != null))
    ).toString();
    
    const { data, error, mutate, isLoading } = useSWR(`/admin/blogs${query ? '?' + query : ''}`, fetcher);
    
    return {
      data: data?.data || [],
      meta: data || {},
      isLoading,
      isError: !!error,
      mutate,
    };
  },

  getBlog: async (id: number | string) => {
    const res = await api.get(`/admin/blogs/${id}`);
    return res.data;
  },

  createBlog: async (formData: FormData) => {
    const res = await api.post(`/admin/blogs`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },

  updateBlog: async (id: number | string, formData: FormData) => {
    // Laravel requires POST with _method=PUT for multipart/form-data
    formData.append('_method', 'PUT');
    const res = await api.post(`/admin/blogs/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },

  deleteBlog: async (id: number | string) => {
    const res = await api.delete(`/admin/blogs/${id}`);
    return res.data;
  },

  actionBlog: async (id: number | string, action: string) => {
    const res = await api.post(`/admin/blogs/${id}/action`, { action });
    return res.data;
  },

  useCategories: () => {
    const { data, error, mutate, isLoading } = useSWR(`/admin/blog-categories`, fetcher);
    return { data: data?.data || [], error, mutate, isLoading };
  },

  createCategory: async (data: FormData | any) => {
    const res = await api.post(`/admin/blog-categories`, data);
    return res.data;
  },

  updateCategory: async (id: number | string, data: FormData | any) => {
    if (data instanceof FormData) {
      data.append('_method', 'PUT');
      const res = await api.post(`/admin/blog-categories/${id}`, data);
      return res.data;
    }
    const res = await api.put(`/admin/blog-categories/${id}`, data);
    return res.data;
  },

  deleteCategory: async (id: number | string) => {
    const res = await api.delete(`/admin/blog-categories/${id}`);
    return res.data;
  },

  uploadContentImage: async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    const res = await api.post(`/admin/blogs/upload-image`, formData);
    return res.data.url;
  }
};
