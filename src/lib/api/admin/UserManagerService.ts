import api from '../../axios';
import useSWR from 'swr';

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export const UserManagerService = {
  // Roles & Permissions
  useRoles: () => {
    return useSWR('/admin/roles', fetcher);
  },

  useRoleAuditLogs: (roleId?: number) => {
    return useSWR(roleId ? `/admin/roles/audit?id=${roleId}` : null, fetcher);
  },

  useAllAuditLogs: () => {
    return useSWR('/admin/roles/audit', fetcher);
  },

  createRole: async (data: { name: string; description?: string; permissions?: string[] }) => {
    return await api.post('/admin/roles', data);
  },

  updateRole: async (id: number, data: { name?: string; description?: string; status?: string; permissions?: string[] }) => {
    return await api.put(`/admin/roles/${id}`, data);
  },

  deleteRole: async (id: number) => {
    return await api.delete(`/admin/roles/${id}`);
  },

  cloneRole: async (id: number, data: { name?: string; description?: string }) => {
    return await api.post(`/admin/roles/${id}/clone`, data);
  },

  assignUsersToRole: async (id: number, userIds: number[]) => {
    return await api.post(`/admin/roles/${id}/users`, { user_ids: userIds });
  },

  removeUserFromRole: async (roleId: number, userId: number) => {
    return await api.delete(`/admin/roles/${roleId}/users/${userId}`);
  },

  importRoles: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return await api.post('/admin/roles/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  // Role Requests
  useRoleRequests: () => {
    return useSWR('/admin/role-requests', fetcher);
  },

  approveRoleRequest: async (id: number) => {
    return await api.post(`/admin/role-requests/${id}/approve`);
  },

  rejectRoleRequest: async (id: number, notes: string) => {
    return await api.post(`/admin/role-requests/${id}/reject`, { notes });
  },

  exportRoles: async () => {
    try {
      const response = await api.get('/admin/roles/export', { responseType: 'blob' });
      const blob = new Blob([response.data], { type: 'text/csv' });
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `roles_export_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Export failed', error);
      throw error;
    }
  },

  exportRoleAudit: async (id?: number) => {
    try {
      const url = id ? `/admin/roles/audit/export?id=${id}` : '/admin/roles/audit/export';
      const response = await api.get(url, { responseType: 'blob' });
      const blob = new Blob([response.data], { type: 'text/csv' });
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `role_audit_logs_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Export failed', error);
      throw error;
    }
  },

  exportUsers: async (params: Record<string, any> = {}) => {
    const query = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v !== '' && v != null))
    ).toString();
    const url = `/admin/users/export${query ? '?' + query : ''}`;
    
    try {
      const response = await api.get(url, { responseType: 'blob' });
      const blob = new Blob([response.data], { type: 'text/csv' });
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `users_export_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Export failed', error);
      throw error;
    }
  },

  // Delete Requests
  useDeleteRequests: () => {
    return useSWR('/admin/delete-requests', fetcher);
  },

  approveDeleteRequest: async (id: number) => {
    return await api.post(`/admin/delete-requests/${id}/approve`);
  },

  rejectDeleteRequest: async (id: number, notes: string) => {
    return await api.post(`/admin/delete-requests/${id}/reject`, { notes });
  },

  exportDeleteRequests: async () => {
    try {
      const response = await api.get('/admin/delete-requests/export', { responseType: 'blob' });
      const blob = new Blob([response.data], { type: 'text/csv' });
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `delete_requests_export_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Export failed', error);
      throw error;
    }
  }
};
