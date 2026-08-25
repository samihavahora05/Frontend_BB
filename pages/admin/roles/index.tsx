import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { AdminDashboardLayout } from '../../../src/layout/AdminDashboardLayout';
import { 
  Shield, Check, X, ShieldAlert, Plus, Download, Upload, Search, Filter, 
  Users, UserCog, UserCheck, GraduationCap, Building2, Building, Briefcase,
  MonitorPlay, Megaphone, Headset, Banknote, HelpCircle, FileText, Settings,
  AlertTriangle, Copy, Trash2, Edit2, History, ChevronRight, CheckCircle2, XCircle,
  MoreVertical, RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';

// --- MOCK DATA ---
const MODULES = [
  "General", "Dashboard", "Users", "Students", "Experts", "Companies", 
  "Colleges", "Courses", "Jobs", "Internships", "Certificates", "Payments", 
  "Orders", "Blogs", "Media Manager", "Reports", "CRM", "Notifications", 
  "Website CMS", "Settings", "Security", "API Access"
];

const PERMISSION_TYPES = [
  "View", "Create", "Edit", "Delete", "Approve", "Reject", "Import", 
  "Export", "Publish", "Assign", "Manage Settings"
];

const ICONS: Record<string, any> = {
  "Super Admin": Shield, "Admin": ShieldAlert, "Employee": Users,
  "Student": GraduationCap, "Expert": UserCheck, "Company": Building2,
  "College": Building, "Intern": UserCog, "Job Seeker": Briefcase,
  "Mentor": MonitorPlay, "Support": Headset, "Content Manager": FileText,
  "HR": Users, "Finance": Banknote, "Marketing": Megaphone,
  "default": HelpCircle
};

import { UserManagerService } from '../../../src/lib/api/admin/UserManagerService';

export default function AdminRolesPage() {
  const { data: rolesData, mutate: mutateRoles, isLoading: rolesLoading } = UserManagerService.useRoles();
  const { data: roleRequestsData, mutate: mutateRoleRequests } = UserManagerService.useRoleRequests();
  const [selectedRole, setSelectedRole] = useState<any | null>(null);
  const [searchRole, setSearchRole] = useState('');
  const [activeTab, setActiveTab] = useState<'Permissions'|'Users'|'Requests'|'Audit'>('Permissions');
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  // User Assignment State
  const [userAssignmentSearch, setUserAssignmentSearch] = useState('');
  const [isAssignUserModalOpen, setIsAssignUserModalOpen] = useState(false);
  const [assignSearchQ, setAssignSearchQ] = useState('');
  const [assignUserResults, setAssignUserResults] = useState<any[]>([]);
  const [isAssigning, setIsAssigning] = useState(false);

  // Role Requests State
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectNotes, setRejectNotes] = useState('');
  const [selectedRequestId, setSelectedRequestId] = useState<number | null>(null);
  
  // Modals
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDesc, setNewRoleDesc] = useState('');
  const [cloneRoleId, setCloneRoleId] = useState<string>('');

  const roles = rolesData || [];

  // Update selected role when data changes
  useEffect(() => {
    if (roles.length > 0 && !selectedRole) {
      setSelectedRole(roles[0]);
    } else if (roles.length > 0 && selectedRole) {
      const updated = roles.find((r: any) => r.id === selectedRole.id);
      if (updated) setSelectedRole(updated);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roles]);

  const { data: auditLogsData } = UserManagerService.useRoleAuditLogs(activeTab === 'Audit' ? selectedRole?.id : undefined);
  const auditLogs = auditLogsData || [];

  const filteredRoles = roles.filter((r: any) => r.name.toLowerCase().includes(searchRole.toLowerCase()));

  // Map permissions from array to nested object for UI
  const getMappedPermissions = (role: any) => {
    const perms: any = {};
    MODULES.forEach(m => {
      perms[m] = {};
      PERMISSION_TYPES.forEach(pt => perms[m][pt] = false);
    });
    if (role?.permissions) {
      role.permissions.forEach((p: any) => {
        const parts = p.name.split('_');
        const action = parts[0];
        const moduleNameStr = parts.slice(1).join('_');
        
        // Find matching UI labels
        const uiModule = MODULES.find(m => m.toLowerCase().replace(/\s+/g, '_') === moduleNameStr);
        const uiAction = PERMISSION_TYPES.find(pt => pt.toLowerCase() === action);
        
        if (uiModule && uiAction) {
          perms[uiModule][uiAction] = true;
        }
      });
    }
    return perms;
  };

  // Convert nested UI object back to flat array for API
  const getFlatPermissions = (permsObj: any) => {
    const flat: string[] = [];
    Object.keys(permsObj).forEach(module => {
      Object.keys(permsObj[module]).forEach(action => {
        if (permsObj[module][action]) {
          flat.push(`${action.toLowerCase()}_${module.toLowerCase().replace(/\s+/g, '_')}`);
        }
      });
    });
    return flat;
  };

  // --- Handlers ---
  const handleTogglePermission = async (moduleName: string, permType: string) => {
    if (!selectedRole) return;
    
    // Optimistic UI update
    const currentPerms = getMappedPermissions(selectedRole);
    const isGranted = currentPerms[moduleName][permType];
    currentPerms[moduleName][permType] = !isGranted;
    
    const flatPerms = getFlatPermissions(currentPerms);
    
    try {
      await UserManagerService.updateRole(selectedRole.id, { permissions: flatPerms });
      mutateRoles();
      toast.success(`${permType} permission for ${moduleName} ${!isGranted ? 'granted' : 'revoked'}.`);
    } catch (error: any) {
      toast.error('Failed to update permissions');
    }
  };

  const handleToggleAllModule = async (moduleName: string, state: boolean) => {
    if (!selectedRole) return;
    
    const currentPerms = getMappedPermissions(selectedRole);
    PERMISSION_TYPES.forEach(pt => currentPerms[moduleName][pt] = state);
    const flatPerms = getFlatPermissions(currentPerms);
    
    try {
      await UserManagerService.updateRole(selectedRole.id, { permissions: flatPerms });
      mutateRoles();
      toast.success(`All permissions for ${moduleName} ${state ? 'granted' : 'revoked'}.`);
    } catch (error: any) {
      toast.error('Failed to update permissions');
    }
  };

  const handleDeleteRole = async () => {
    if (!selectedRole) return;
    if (selectedRole.name === 'Super Admin' || selectedRole.name === 'Admin') {
      toast.error('Cannot delete core system roles.');
      setIsDeleteModalOpen(false);
      return;
    }
    if (selectedRole.users_count > 0) {
      toast.error(`Cannot delete role. There are ${selectedRole.users_count} active users assigned to it.`);
      setIsDeleteModalOpen(false);
      return;
    }
    
    try {
      await UserManagerService.deleteRole(selectedRole.id);
      setIsDeleteModalOpen(false);
      setSelectedRole(null);
      mutateRoles();
      toast.success('Role deleted successfully.');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete role');
    }
  };

  const handleDuplicate = async () => {
    if (!selectedRole) return;
    try {
      await UserManagerService.cloneRole(selectedRole.id, {
        name: `${selectedRole.name} (Copy)`
      });
      mutateRoles();
      toast.success('Role duplicated successfully.');
    } catch (error: any) {
      toast.error('Failed to duplicate role');
    }
  };

  const handleCreateRole = async () => {
    if (!newRoleName) return toast.error('Role name is required');
    try {
      if (cloneRoleId) {
        await UserManagerService.cloneRole(Number(cloneRoleId), { name: newRoleName, description: newRoleDesc });
      } else {
        await UserManagerService.createRole({ name: newRoleName, description: newRoleDesc });
      }
      setIsCreateModalOpen(false);
      setNewRoleName('');
      setNewRoleDesc('');
      setCloneRoleId('');
      mutateRoles();
      toast.success('Role created successfully.');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create role');
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    let toastId: string | undefined;
    try {
      toastId = toast.loading('Importing roles...');
      await UserManagerService.importRoles(file);
      toast.success('Roles imported successfully!', { id: toastId });
      mutateRoles();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to import roles', { id: toastId });
    }
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // --- User Assignment & Request Handlers ---
  const handleSearchUsers = async (q: string) => {
    setAssignSearchQ(q);
    if (q.length < 2) {
      setAssignUserResults([]);
      return;
    }
    try {
      // Assuming api from axios is imported. Wait, api is not imported here.
      // Let's import it at the top or fetch via UserManagerService if possible.
      // We will use standard fetch since this is just a quick search, or add api to imports.
      const res = await (await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://backend.blueboxx.in/api'}/admin/users?search=${q}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })).json();
      setAssignUserResults(res.data || []);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAssignUser = async (userId: number) => {
    if (!selectedRole) return;
    setIsAssigning(true);
    try {
      await UserManagerService.assignUsersToRole(selectedRole.id, [userId]);
      toast.success('User assigned successfully!');
      mutateRoles();
      setIsAssignUserModalOpen(false);
      setAssignSearchQ('');
      setAssignUserResults([]);
    } catch (e) {
      toast.error('Failed to assign user');
    } finally {
      setIsAssigning(false);
    }
  };

  const handleApproveRequest = async (id: number) => {
    try {
      await UserManagerService.approveRoleRequest(id);
      toast.success('Request approved successfully');
      mutateRoleRequests();
      mutateRoles();
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Failed to approve request');
    }
  };

  const handleRejectRequest = async () => {
    if (!selectedRequestId || !rejectNotes) return toast.error('Notes are required to reject');
    try {
      await UserManagerService.rejectRoleRequest(selectedRequestId, rejectNotes);
      toast.success('Request rejected');
      setIsRejectModalOpen(false);
      setRejectNotes('');
      setSelectedRequestId(null);
      mutateRoleRequests();
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Failed to reject request');
    }
  };

  // --- Render Helpers ---
  const RoleIcon = ({ name }: { name: string }) => {
    const Icon = ICONS[name] || ICONS['default'];
    return <Icon size={18} />;
  };

  return (
    <AdminDashboardLayout>
      <Head>
        <title>Roles & Permissions | BlueBoxx DA</title>
      </Head>

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-[#0d1635] flex items-center gap-2">
            <ShieldAlert size={28} className="text-[#C9A227]"/> Roles & Permissions
          </h1>
          <p className="text-gray-500 text-sm mt-1 font-semibold">Manage user roles, permissions, and access control across the platform.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            accept=".csv" 
            className="hidden" 
          />
          <button onClick={() => {
            const toastId = toast.loading('Exporting roles...');
            UserManagerService.exportRoles().then(() => toast.success('Export successful', { id: toastId })).catch(() => toast.error('Export failed', { id: toastId }));
          }} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 shadow-sm transition-all"><Download size={16}/> Export Roles</button>
          <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 shadow-sm transition-all"><Upload size={16}/> Import Permissions</button>
          <button onClick={() => setIsCreateModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-[#1B2A6B] hover:bg-[#121c47] text-white rounded-lg text-sm font-black shadow-md transition-all"><Plus size={16}/> Create New Role</button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0"><Shield size={24}/></div>
          <div><p className="text-xs font-black text-gray-400 uppercase tracking-widest">Total Roles</p><h2 className="text-2xl font-black text-gray-800">{roles.length}</h2></div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0"><CheckCircle2 size={24}/></div>
          <div><p className="text-xs font-black text-gray-400 uppercase tracking-widest">Total Permissions</p><h2 className="text-2xl font-black text-gray-800">{MODULES.length * PERMISSION_TYPES.length}</h2></div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shrink-0"><Users size={24}/></div>
          <div><p className="text-xs font-black text-gray-400 uppercase tracking-widest">Active Users</p><h2 className="text-2xl font-black text-gray-800">{roles.reduce((acc: number, r: any) => acc + (r.users_count || 0), 0)}</h2></div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center shrink-0"><AlertTriangle size={24}/></div>
          <div><p className="text-xs font-black text-gray-400 uppercase tracking-widest">Pending Requests</p><h2 className="text-2xl font-black text-gray-800">0</h2></div>
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-280px)] min-h-[600px]">
        
        {/* Left Panel - Roles List */}
        <div className="w-full lg:w-80 flex flex-col bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden shrink-0">
          <div className="p-4 border-b border-gray-100 bg-gray-50/50">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search roles..." 
                value={searchRole}
                onChange={e => setSearchRole(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-[#1B2A6B]" 
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto admin-scrollbar p-2 space-y-1">
            {rolesLoading && <div className="p-4 text-center text-sm text-gray-400">Loading roles...</div>}
            {filteredRoles.map((role: any) => (
              <button
                key={role.id}
                onClick={() => setSelectedRole(role)}
                className={`w-full text-left flex items-center gap-3 p-3 rounded-xl transition-all ${
                  selectedRole?.id === role.id 
                    ? 'bg-[#1B2A6B] text-white shadow-md' 
                    : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${selectedRole?.id === role.id ? 'bg-white/20' : 'bg-slate-100 text-[#1B2A6B]'}`}>
                  <RoleIcon name={role.name} />
                </div>
                <div className="flex-1 overflow-hidden">
                  <h3 className={`text-sm font-bold truncate ${selectedRole?.id === role.id ? 'text-white' : 'text-slate-800'}`}>{role.name}</h3>
                  <p className={`text-[11px] font-semibold truncate ${selectedRole?.id === role.id ? 'text-blue-100' : 'text-slate-400'}`}>
                    {role.users_count} Users • {role.status || 'Active'}
                  </p>
                </div>
                {selectedRole?.id === role.id && <ChevronRight size={16} className="opacity-70" />}
              </button>
            ))}
            {!rolesLoading && filteredRoles.length === 0 && (
              <div className="p-6 text-center text-sm font-semibold text-gray-400">No roles found.</div>
            )}
          </div>
        </div>

        {/* Right Panel - Role Configurations */}
        {selectedRole ? (
          <div className="flex-1 flex flex-col bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden animate-in fade-in duration-300">
            
            {/* Header Details */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-blue-50 text-[#1B2A6B] rounded-2xl flex items-center justify-center shadow-sm">
                    <RoleIcon name={selectedRole.name} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
                      {selectedRole.name}
                      <span className={`px-2 py-0.5 rounded text-[10px] uppercase tracking-widest font-black ${selectedRole.status === 'Active' || !selectedRole.status ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                        {selectedRole.status || 'Active'}
                      </span>
                    </h2>
                    <p className="text-sm font-medium text-slate-500 mt-1">{selectedRole.description}</p>
                  </div>
                </div>
                
                {/* Actions Dropdown */}
                <div className="relative group">
                  <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors">
                    <MoreVertical size={18} />
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 overflow-hidden">
                    <button onClick={handleDuplicate} className="w-full text-left px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-2"><Copy size={14}/> Duplicate Role</button>
                    <button onClick={() => toast.success('Rename functionality to be implemented')} className="w-full text-left px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-2"><Edit2 size={14}/> Rename</button>
                    <div className="border-t border-gray-100"></div>
                    <button onClick={() => setIsDeleteModalOpen(true)} className="w-full text-left px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 flex items-center gap-2"><Trash2 size={14}/> Delete Role</button>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-6 text-xs font-bold text-slate-500">
                <span>Created Date: <span className="text-slate-800">{new Date(selectedRole.created_at).toLocaleDateString()}</span></span>
                <span>Last Updated: <span className="text-slate-800">{new Date(selectedRole.updated_at).toLocaleDateString()}</span></span>
                <span>Users Assigned: <span className="text-[#1B2A6B]">{selectedRole.users_count}</span></span>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-100 px-2 bg-gray-50/50">
              {['Permissions', 'Users', 'Requests', 'Audit'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`px-6 py-3.5 text-sm font-black transition-all border-b-2 ${
                    activeTab === tab 
                      ? 'border-[#1B2A6B] text-[#1B2A6B]' 
                      : 'border-transparent text-slate-400 hover:text-slate-700'
                  }`}
                >
                  {tab === 'Permissions' ? 'Permission Matrix' : tab === 'Users' ? 'User Assignment' : tab === 'Requests' ? 'Role Requests' : 'Audit Logs'}
                </button>
              ))}
            </div>

            {/* Tab Contents */}
            <div className="flex-1 overflow-y-auto admin-scrollbar bg-slate-50">
              
              {activeTab === 'Permissions' && (
                <div className="p-6">
                  <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                    {/* Matrix Header */}
                    <div className="flex bg-slate-100 border-b border-gray-200 sticky top-0 z-10">
                      <div className="w-48 p-4 font-black text-xs text-slate-500 uppercase tracking-widest shrink-0 border-r border-gray-200">Modules</div>
                      <div className="flex-1 flex overflow-x-auto admin-scrollbar">
                        {PERMISSION_TYPES.map(pt => (
                          <div key={pt} className="w-24 p-4 font-black text-[10px] text-slate-500 uppercase tracking-widest text-center shrink-0 border-r border-gray-200 last:border-0 truncate">
                            {pt}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Matrix Body */}
                    <div>
                      {MODULES.map(module => {
                        const currentPerms = getMappedPermissions(selectedRole);
                        return (
                        <div key={module} className="flex border-b border-gray-100 hover:bg-slate-50 transition-colors last:border-0 group">
                          <div className="w-48 p-4 border-r border-gray-100 shrink-0 flex items-center justify-between">
                            <span className="text-sm font-bold text-slate-800">{module}</span>
                            <button 
                              onClick={() => {
                                const allGranted = PERMISSION_TYPES.every(pt => currentPerms[module][pt]);
                                handleToggleAllModule(module, !allGranted);
                              }}
                              className="text-[10px] font-bold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              Toggle All
                            </button>
                          </div>
                          <div className="flex-1 flex overflow-x-auto admin-scrollbar">
                            {PERMISSION_TYPES.map(pt => {
                              const isGranted = currentPerms[module][pt] || false;
                              return (
                                <div key={pt} className="w-24 p-4 border-r border-gray-100 shrink-0 flex items-center justify-center last:border-0">
                                  <label className="relative inline-flex items-center cursor-pointer">
                                    <input 
                                      type="checkbox" 
                                      className="sr-only peer"
                                      checked={isGranted}
                                      onChange={() => handleTogglePermission(module, pt)}
                                    />
                                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#1B2A6B]"></div>
                                  </label>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )})}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'Users' && (
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-black text-slate-800">Users with role: {selectedRole.name}</h3>
                    <div className="flex gap-2">
                      <div className="relative">
                        <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                          type="text" 
                          placeholder="Filter users..."
                          value={userAssignmentSearch}
                          onChange={e => setUserAssignmentSearch(e.target.value)}
                          className="pl-8 pr-3 py-1.5 border border-gray-200 bg-white rounded-lg text-xs font-bold text-gray-700 outline-none focus:ring-1 focus:ring-[#1B2A6B]"
                        />
                      </div>
                      <button onClick={() => setIsAssignUserModalOpen(true)} className="px-3 py-1.5 bg-[#1B2A6B] text-white rounded-lg text-xs font-bold flex items-center gap-1"><Plus size={14}/> Assign User</button>
                    </div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50 border-b border-gray-200 text-xs font-black text-slate-500 uppercase tracking-wider">
                        <tr>
                          <th className="p-4">User</th>
                          <th className="p-4">Email</th>
                          <th className="p-4">Status</th>
                          <th className="p-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedRole.users?.filter((u: any) => 
                          (u.name || u.first_name + ' ' + u.last_name).toLowerCase().includes(userAssignmentSearch.toLowerCase()) || 
                          u.email.toLowerCase().includes(userAssignmentSearch.toLowerCase())
                        ).map((u: any) => (
                          <tr key={u.id} className="border-b border-gray-100 last:border-0 hover:bg-slate-50">
                            <td className="p-4 font-bold text-[#1B2A6B]">{u.name || u.first_name + ' ' + u.last_name}</td>
                            <td className="p-4 font-semibold text-gray-600">{u.email}</td>
                            <td className="p-4">
                              <span className={`px-2 py-1 rounded text-[10px] font-black uppercase ${u.status==='active'?'bg-emerald-100 text-emerald-700':'bg-red-100 text-red-700'}`}>{u.status}</span>
                            </td>
                            <td className="p-4 flex gap-2">
                              <button onClick={async () => {
                                try {
                                  await UserManagerService.removeUserFromRole(selectedRole.id, u.id);
                                  mutateRoles();
                                  toast.success('User removed from role');
                                } catch(e) {
                                  toast.error('Failed to remove user');
                                }
                              }} className="text-xs font-bold text-red-600 hover:underline">Remove</button>
                            </td>
                          </tr>
                        ))}
                        {(!selectedRole.users || selectedRole.users.length === 0) && (
                          <tr><td colSpan={4} className="p-8 text-center text-gray-400 font-bold">No users assigned to this role.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'Requests' && (
                <div className="p-6">
                  <h3 className="text-lg font-black text-slate-800 mb-4">Pending Role Requests</h3>
                  <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50 border-b border-gray-200 text-xs font-black text-slate-500 uppercase tracking-wider">
                        <tr>
                          <th className="p-4">User</th>
                          <th className="p-4">Requested Role</th>
                          <th className="p-4">Reason</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {roleRequestsData?.map((req: any) => (
                          <tr key={req.id} className="border-b border-gray-100 last:border-0 hover:bg-slate-50">
                            <td className="p-4">
                              <div className="font-bold text-[#1B2A6B]">{req.user?.first_name} {req.user?.last_name}</div>
                              <div className="text-xs text-gray-500">{req.user?.email}</div>
                            </td>
                            <td className="p-4 font-bold text-gray-700">{req.requested_role?.name}</td>
                            <td className="p-4 text-xs text-gray-600 max-w-[200px] truncate" title={req.reason}>{req.reason || 'No reason provided'}</td>
                            <td className="p-4">
                              <span className={`px-2 py-1 rounded text-[10px] font-black uppercase ${
                                req.status === 'pending' ? 'bg-amber-100 text-amber-700' : 
                                req.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                              }`}>{req.status}</span>
                            </td>
                            <td className="p-4 text-right">
                              {req.status === 'pending' && (
                                <div className="flex gap-2 justify-end">
                                  <button onClick={() => handleApproveRequest(req.id)} className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold">Approve</button>
                                  <button onClick={() => { setSelectedRequestId(req.id); setIsRejectModalOpen(true); }} className="px-3 py-1.5 border border-gray-200 hover:bg-red-50 text-red-600 rounded-lg text-xs font-bold">Reject</button>
                                </div>
                              )}
                              {req.status === 'rejected' && req.notes && (
                                <div className="text-xs text-gray-500 mt-1">Note: {req.notes}</div>
                              )}
                            </td>
                          </tr>
                        ))}
                        {(!roleRequestsData || roleRequestsData.length === 0) && (
                          <tr><td colSpan={5} className="p-8 text-center text-gray-400 font-bold">No role requests found.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'Audit' && (
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-black text-slate-800">Security Audit Logs</h3>
                    <button onClick={() => {
                      const toastId = toast.loading('Exporting audit logs...');
                      UserManagerService.exportRoleAudit(selectedRole?.id).then(() => toast.success('Export successful', { id: toastId })).catch(() => toast.error('Export failed', { id: toastId }));
                    }} className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 bg-white rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50 shadow-sm"><Download size={14}/> Export CSV</button>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50 border-b border-gray-200 text-xs font-black text-slate-500 uppercase tracking-wider">
                        <tr>
                          <th className="p-4">Date / Time</th>
                          <th className="p-4">User</th>
                          <th className="p-4">Action Taken</th>
                        </tr>
                      </thead>
                      <tbody>
                        {auditLogs.map((a: any) => (
                          <tr key={a.id} className="border-b border-gray-100 last:border-0 hover:bg-slate-50">
                            <td className="p-4 font-semibold text-gray-500 whitespace-nowrap">{new Date(a.created_at).toLocaleString()}</td>
                            <td className="p-4 font-bold text-[#1B2A6B]">{a.admin?.first_name} {a.admin?.last_name}</td>
                            <td className="p-4 font-semibold text-gray-600">
                              <span className="uppercase text-xs font-bold text-gray-400">{a.action}</span>
                            </td>
                          </tr>
                        ))}
                        {auditLogs.length === 0 && (
                          <tr><td colSpan={3} className="p-8 text-center text-gray-400 font-bold">No audit logs found for this role.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 rounded-2xl border border-gray-200 border-dashed text-slate-400">
            <ShieldAlert size={48} className="mb-4 opacity-50"/>
            <h3 className="text-lg font-black">No Role Selected</h3>
            <p className="text-sm font-semibold">Select a role from the left panel to view and configure permissions.</p>
          </div>
        )}

      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 text-center animate-in zoom-in-95">
            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={32} />
            </div>
            <h3 className="text-xl font-black text-slate-800 mb-2">Delete Role?</h3>
            <p className="text-sm font-semibold text-slate-500 mb-6">
              Are you sure you want to delete the <span className="font-bold text-slate-800">{selectedRole.name}</span> role? This action cannot be undone and will affect {selectedRole.users_count} users.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all">Cancel</button>
              <button onClick={handleDeleteRole} className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl shadow-md transition-all">Delete Role</button>
            </div>
          </div>
        </div>
      )}

      {/* Create Role Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
              <h3 className="font-black text-slate-800 text-lg">Create New Role</h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1 block">Role Name *</label>
                <input type="text" value={newRoleName} onChange={(e) => setNewRoleName(e.target.value)} placeholder="e.g. Content Editor" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#1B2A6B] outline-none text-sm font-semibold" />
              </div>
              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1 block">Description</label>
                <textarea value={newRoleDesc} onChange={(e) => setNewRoleDesc(e.target.value)} rows={3} placeholder="Describe the role's purpose..." className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#1B2A6B] outline-none text-sm font-semibold resize-none" />
              </div>
              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1 block">Clone Permissions From</label>
                <select value={cloneRoleId} onChange={(e) => setCloneRoleId(e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#1B2A6B] outline-none text-sm font-bold text-slate-700">
                  <option value="">None (Start Blank)</option>
                  {roles.map((r: any) => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button onClick={() => setIsCreateModalOpen(false)} className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">Cancel</button>
              <button onClick={handleCreateRole} className="px-6 py-2 text-sm font-black bg-[#1B2A6B] text-white hover:bg-[#121c47] rounded-lg shadow-md transition-all">Create Role</button>
            </div>
          </div>
        </div>
      )}

      {/* Assign User Modal */}
      {isAssignUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsAssignUserModalOpen(false)} />
          <div className="bg-white rounded-3xl border border-slate-200 w-full max-w-lg shadow-2xl p-6 z-50 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-black text-slate-800">Assign User to {selectedRole?.name}</h2>
              <button onClick={() => setIsAssignUserModalOpen(false)} className="text-slate-400 hover:text-slate-600 bg-slate-100 p-1.5 rounded-xl">
                <X size={18} />
              </button>
            </div>
            
            <div className="relative mb-4">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search user by name or email..." 
                value={assignSearchQ}
                onChange={e => handleSearchUsers(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#1B2A6B] focus:border-transparent outline-none transition-all"
              />
            </div>

            <div className="max-h-[300px] overflow-y-auto border border-gray-100 rounded-xl admin-scrollbar">
              {assignUserResults.map(u => (
                <div key={u.id} className="flex justify-between items-center p-3 border-b border-gray-100 last:border-0 hover:bg-slate-50">
                  <div>
                    <div className="text-sm font-bold text-slate-800">{u.name || u.first_name + ' ' + u.last_name}</div>
                    <div className="text-xs text-gray-500">{u.email}</div>
                  </div>
                  <button 
                    disabled={isAssigning}
                    onClick={() => handleAssignUser(u.id)}
                    className="px-3 py-1.5 bg-[#1B2A6B] text-white rounded-lg text-xs font-bold disabled:opacity-50"
                  >
                    Assign
                  </button>
                </div>
              ))}
              {assignSearchQ.length > 1 && assignUserResults.length === 0 && (
                <div className="p-4 text-center text-sm font-bold text-gray-400">No users found.</div>
              )}
              {assignSearchQ.length <= 1 && (
                <div className="p-4 text-center text-sm font-bold text-gray-400">Type at least 2 characters to search.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reject Request Modal */}
      {isRejectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsRejectModalOpen(false)} />
          <div className="bg-white rounded-3xl border border-slate-200 w-full max-w-md shadow-2xl p-6 z-50 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-black text-slate-800">Reject Role Request</h2>
              <button onClick={() => setIsRejectModalOpen(false)} className="text-slate-400 hover:text-slate-600 bg-slate-100 p-1.5 rounded-xl">
                <X size={18} />
              </button>
            </div>
            
            <div className="mb-4">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Rejection Reason</label>
              <textarea 
                value={rejectNotes}
                onChange={e => setRejectNotes(e.target.value)}
                placeholder="Why is this request being rejected?"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 min-h-[100px]"
              />
            </div>
            
            <div className="flex justify-end gap-3">
              <button onClick={() => setIsRejectModalOpen(false)} className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-50">Cancel</button>
              <button onClick={handleRejectRequest} className="px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700">Reject Request</button>
            </div>
          </div>
        </div>
      )}
    </AdminDashboardLayout>
  );
}
