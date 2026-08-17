import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { AdminDashboardLayout } from '../../../src/layout/AdminDashboardLayout';
import { 
  FileText, Save, RefreshCw, Copy, List, Plus, Trash2, X
} from 'lucide-react';
import toast from 'react-hot-toast';
import { SettingService } from '../../../src/lib/api/admin/SettingService';
import { RichTextEditor, RichTextEditorRef } from '../../../src/components/ui/RichTextEditor';

const DEFAULT_VARIABLES = [
  '{user_name}', '{user_email}', '{app_name}', '{app_url}', 
  '{otp_code}', '{reset_link}', '{course_name}', '{instructor_name}',
  '{certificate_url}', '{company_name}', '{job_title}', '{interview_date}'
];

export default function EmailTemplatePage() {
  const { data: templates = [], mutate, isLoading } = SettingService.useEmailTemplates();
  const [activeTemplate, setActiveTemplate] = useState<any>(null);
  
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const editorRef = React.useRef<RichTextEditorRef>(null);
  
  const [isSaving, setIsSaving] = useState(false);
  
  // Create Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  // Set the first template as active on load
  useEffect(() => {
    if (templates.length > 0 && !activeTemplate) {
      handleSelectTemplate(templates[0]);
    }
  }, [templates, activeTemplate]);

  const handleSelectTemplate = (template: any) => {
    setActiveTemplate(template);
    setSubject(template.subject || '');
    setBody(template.body || '');
  };

  const handleSave = async () => {
    if (!activeTemplate) return;
    
    setIsSaving(true);
    try {
      await SettingService.updateEmailTemplate(activeTemplate.id, {
        name: activeTemplate.name,
        subject,
        body
      });
      toast.success(`${activeTemplate.name} saved successfully!`);
      mutate();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save template');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDuplicate = async () => {
    if (!activeTemplate) return;
    try {
      await SettingService.createEmailTemplate({
        name: `${activeTemplate.name} (Copy)`,
        subject: subject,
        body: body
      });
      toast.success(`${activeTemplate.name} duplicated!`);
      mutate();
    } catch (err) {
      toast.error('Failed to duplicate template');
    }
  };

  const handleReset = () => {
    if (activeTemplate) {
      setSubject(activeTemplate.subject);
      setBody(activeTemplate.body);
      toast.success('Template reset to last saved state');
    }
  };
  
  const handleDelete = async () => {
    if (!activeTemplate) return;
    if (confirm(`Are you sure you want to delete ${activeTemplate.name}?`)) {
      try {
        await SettingService.deleteEmailTemplate(activeTemplate.id);
        toast.success(`${activeTemplate.name} deleted!`);
        setActiveTemplate(null);
        mutate();
      } catch (err) {
        toast.error('Failed to delete template');
      }
    }
  };

  const insertVariable = (variable: string) => {
    if (editorRef.current) {
      editorRef.current.insertContent(` ${variable} `);
      toast.success(`Inserted ${variable}`);
    } else {
      setBody(prev => prev + ' ' + variable);
      toast.success(`Inserted ${variable}`);
    }
  };

  const handleCreateTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTemplateName.trim()) return;
    
    setIsCreating(true);
    try {
      await SettingService.createEmailTemplate({
        name: newTemplateName.trim(),
        subject: 'New Email Subject',
        body: 'Write your email body here...'
      });
      toast.success('Template created!');
      setIsCreateModalOpen(false);
      setNewTemplateName('');
      mutate();
    } catch (err) {
      toast.error('Failed to create template');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <AdminDashboardLayout>
      <Head>
        <title>Email Templates | BlueBoxx DA</title>
      </Head>

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-[#0d1635] flex items-center gap-2">Email Templates</h1>
          <p className="text-slate-500 text-sm mt-1 font-semibold">Customize automated emails sent from the platform.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button onClick={handleSave} disabled={isSaving || !activeTemplate} className="flex items-center gap-2 bg-[#1B2A6B] hover:bg-[#121c47] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md transition-colors disabled:opacity-70">
            {isSaving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />} 
            Save Template
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Templates Sidebar */}
        <div className="w-full lg:w-72 shrink-0">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-200px)]">
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                <List size={16} className="text-[#1B2A6B]" /> All Templates
              </h2>
              <button onClick={() => setIsCreateModalOpen(true)} className="text-blue-600 hover:text-blue-800 p-1.5 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors shadow-sm">
                <Plus size={16}/>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto admin-scrollbar p-3 space-y-2">
              {isLoading ? (
                <div className="animate-pulse space-y-2 p-2">
                  {[...Array(5)].map((_, i) => <div key={i} className="h-10 bg-slate-100 rounded-xl w-full"></div>)}
                </div>
              ) : templates.length === 0 ? (
                <div className="text-center p-6 mt-4">
                  <div className="w-12 h-12 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FileText size={24} />
                  </div>
                  <p className="text-sm text-slate-500 font-semibold">No templates found.</p>
                  <button onClick={() => setIsCreateModalOpen(true)} className="mt-2 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors">Create your first template</button>
                </div>
              ) : (
                templates.map((template: any) => (
                  <button 
                    key={template.id}
                    onClick={() => handleSelectTemplate(template)}
                    className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTemplate?.id === template.id ? 'bg-[#1B2A6B] text-white shadow-md' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800 border border-transparent hover:border-slate-200'}`}
                  >
                    <FileText size={16} className={activeTemplate?.id === template.id ? 'text-white' : 'text-slate-400'} />
                    <span className="truncate">{template.name}</span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-200px)]">
          
          {activeTemplate ? (
            <>
              <div className="p-4 lg:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
                <h2 className="text-sm lg:text-lg font-black text-slate-800 flex items-center gap-2">
                  Editing: <span className="text-[#1B2A6B]">{activeTemplate.name}</span>
                </h2>
                <div className="flex gap-2">
                  <button onClick={handleDuplicate} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg tooltip border border-transparent hover:border-blue-100 transition-all" title="Duplicate">
                    <Copy size={18}/>
                  </button>
                  <button onClick={handleReset} className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg tooltip border border-transparent hover:border-amber-100 transition-all" title="Revert Changes">
                    <RefreshCw size={18}/>
                  </button>
                  <button onClick={handleDelete} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg tooltip border border-transparent hover:border-red-100 transition-all" title="Delete Template">
                    <Trash2 size={18}/>
                  </button>
                </div>
              </div>

              <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
                
                {/* Text Editor */}
                <div className="flex-1 flex flex-col p-6 overflow-y-auto">
                  <div className="mb-6">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2 block">Email Subject</label>
                    <input type="text" value={subject} onChange={e => setSubject(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-[#1B2A6B] transition-all" />
                  </div>
                  
                  <div className="flex-1 flex flex-col">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2 block">
                      Email Body
                    </label>
                    <RichTextEditor 
                      ref={editorRef}
                      value={body} 
                      onChange={(html) => setBody(html)} 
                      minHeight="400px"
                    />
                  </div>
                </div>

                {/* Variables Sidebar */}
                <div className="w-full lg:w-72 border-l border-slate-100 bg-slate-50 p-6 overflow-y-auto flex flex-col h-full shrink-0">
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-2">Dynamic Variables</h3>
                  <p className="text-xs text-slate-500 font-medium mb-6">Click any variable below to append it to your email body automatically.</p>
                  
                  <div className="flex flex-wrap gap-2">
                    {DEFAULT_VARIABLES.map(variable => (
                      <button 
                        key={variable}
                        onClick={() => insertVariable(variable)}
                        className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold font-mono text-[#1B2A6B] hover:border-[#1B2A6B] hover:bg-blue-50 transition-all shadow-sm flex items-center justify-center hover:scale-[1.02] active:scale-95"
                      >
                        {variable}
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-slate-400 bg-slate-50/50">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
                <FileText size={32} className="text-slate-300" />
              </div>
              <h3 className="text-xl font-black text-slate-800 mb-2">No Template Selected</h3>
              <p className="text-sm font-medium text-slate-500 max-w-sm">Select a template from the sidebar or create a new one to start editing your email contents.</p>
              <button onClick={() => setIsCreateModalOpen(true)} className="mt-6 bg-[#1B2A6B] text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md hover:bg-[#121c47] transition-colors flex items-center gap-2">
                <Plus size={16} /> Create Template
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Create Template Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setIsCreateModalOpen(false)}></div>
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md flex flex-col animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-3xl">
              <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
                <FileText size={24} className="text-[#1B2A6B]"/> Create Template
              </h2>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-slate-600 bg-white p-1.5 rounded-lg shadow-sm border border-slate-200 transition-colors"><X size={16}/></button>
            </div>
            
            <form onSubmit={handleCreateTemplate} className="p-6 space-y-6">
              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block">Template Name *</label>
                <input 
                  required 
                  autoFocus
                  type="text" 
                  value={newTemplateName} 
                  onChange={e => setNewTemplateName(e.target.value)} 
                  placeholder="e.g. Welcome Email" 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-[#1B2A6B] transition-all" 
                />
                <p className="text-xs text-slate-500 mt-2 font-medium">This name is for internal identification only.</p>
              </div>
              
              <div className="pt-2 flex gap-3">
                <button type="button" onClick={() => setIsCreateModalOpen(false)} className="flex-1 py-3 bg-white border border-slate-200 text-slate-700 font-bold text-sm rounded-xl hover:bg-slate-50 shadow-sm transition-colors">Cancel</button>
                <button type="submit" disabled={isCreating || !newTemplateName.trim()} className="flex-1 py-3 bg-[#1B2A6B] text-white font-bold text-sm rounded-xl hover:bg-[#121c47] shadow-md transition-colors disabled:opacity-70 flex justify-center items-center gap-2">
                  {isCreating ? <RefreshCw size={16} className="animate-spin" /> : <Plus size={16}/>}
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </AdminDashboardLayout>
  );
}
