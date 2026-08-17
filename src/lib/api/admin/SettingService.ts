import api from '../../axios';
import useSWR from 'swr';

const fetcher = (url: string) => api.get(url).then((res) => res.data.data);

export const SettingService = {
  // --- General Settings (Legacy) ---
  useSettings: () => {
    return useSWR('/admin/settings', fetcher);
  },

  updateSettings: async (group: string, settings: Record<string, any>) => {
    return await api.post('/admin/settings', { group, settings });
  },

  // --- Public Settings ---
  usePublicSettings: () => {
    return useSWR('/public/settings', fetcher);
  },

  // --- System Settings V2 (Enterprise Module) ---
  useSystemSettings: (group: string) => {
    return useSWR(`/admin/system-settings/${group}`, fetcher);
  },
  
  updateSystemSettings: async (group: string, settings: Record<string, any>) => {
    return await api.post(`/admin/system-settings/${group}`, { settings });
  },

  testSmtpConnection: async (email: string) => {
    return await api.post('/admin/system-settings/smtp/test', { email });
  },

  // --- Licenses ---
  useLicenses: (params?: any) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return useSWR(`/admin/system-licenses${qs}`, fetcher);
  },
  
  createLicense: async (data: any) => {
    return await api.post('/admin/system-licenses', data);
  },

  updateLicense: async (id: number, data: any) => {
    return await api.put(`/admin/system-licenses/${id}`, data);
  },

  deleteLicense: async (id: number) => {
    return await api.delete(`/admin/system-licenses/${id}`);
  },

  actionLicense: async (id: number, action: string) => {
    return await api.post(`/admin/system-licenses/${id}/action`, { action });
  },

  // --- Email Templates ---
  useEmailTemplates: (params?: any) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return useSWR(`/admin/system-email-templates${qs}`, fetcher);
  },

  createEmailTemplate: async (data: any) => {
    return await api.post('/admin/system-email-templates', data);
  },

  updateEmailTemplate: async (id: number, data: any) => {
    return await api.put(`/admin/system-email-templates/${id}`, data);
  },

  deleteEmailTemplate: async (id: number) => {
    return await api.delete(`/admin/system-email-templates/${id}`);
  },

  // --- API Credentials ---
  useApiCredentials: () => {
    return useSWR('/admin/system-api-credentials', fetcher);
  },

  updateApiCredential: async (provider: string, data: any) => {
    return await api.put(`/admin/system-api-credentials/${provider}`, data);
  },

  showApiSecret: async (provider: string, password: string) => {
    return await api.post(`/admin/system-api-credentials/${provider}/show-secret`, { password });
  },

  testApiConnection: async (provider: string) => {
    return await api.post(`/admin/system-api-credentials/${provider}/test`);
  },

  deleteApiCredential: async (provider: string) => {
    return await api.delete(`/admin/system-api-credentials/${provider}`);
  }
};
