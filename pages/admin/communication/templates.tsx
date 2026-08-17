import React, { useState } from "react";
import { AdminDashboardLayout } from "../../../src/layout/AdminDashboardLayout";
import { 
  FileText, Search, Edit3, Eye, Check, ChevronRight 
} from "lucide-react";
import toast from "react-hot-toast";

const TEMPLATES = [
  { id: "welcome", name: "Welcome Email", subject: "Welcome to [App_Name]!" },
  { id: "reset_pwd", name: "Password Reset", subject: "Reset your password" },
  { id: "course_enroll", name: "Course Enrollment", subject: "You're enrolled in [Course_Name]" },
  { id: "purchase_receipt", name: "Purchase Receipt", subject: "Your receipt for [Order_ID]" },
  { id: "admin_alert", name: "Admin Alert", subject: "New Activity Alert" },
];

export default function EmailTemplatesPage() {
  const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[0]);
  const [subject, setSubject] = useState(TEMPLATES[0].subject);
  const [body, setBody] = useState(`Hi [User_Name],\n\nWelcome to our platform. We're excited to have you on board!\n\nBest,\nThe Team`);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Template saved successfully!");
    }, 800);
  };

  return (
    <AdminDashboardLayout>
      <div className="p-6 h-full flex flex-col">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="w-6 h-6 text-indigo-600" />
            Email Templates
          </h1>
          <p className="text-gray-500 mt-1">
            Manage system-generated email templates and content.
          </p>
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px]">
          {/* Templates List Sidebar */}
          <div className="lg:col-span-4 bg-white border border-gray-200 rounded-xl flex flex-col overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text"
                  placeholder="Search templates..."
                  className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.id}
                  onClick={() => {
                    setSelectedTemplate(tmpl);
                    setSubject(tmpl.subject);
                  }}
                  className={`w-full text-left p-3 rounded-lg flex items-center justify-between transition-colors ${
                    selectedTemplate.id === tmpl.id 
                      ? 'bg-indigo-50 text-indigo-700 font-medium' 
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <div className="truncate">
                    <p className="truncate text-sm">{tmpl.name}</p>
                  </div>
                  <ChevronRight className={`w-4 h-4 flex-shrink-0 ${selectedTemplate.id === tmpl.id ? 'opacity-100' : 'opacity-0'}`} />
                </button>
              ))}
            </div>
          </div>

          {/* Editor Area */}
          <div className="lg:col-span-8 bg-white border border-gray-200 rounded-xl flex flex-col">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="font-bold text-gray-900">Edit: {selectedTemplate.name}</h2>
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                {isSaving ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : (
                  <Check className="w-4 h-4" />
                )}
                Save Template
              </button>
            </div>
            
            <div className="p-6 space-y-6 flex-1">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Subject
                </label>
                <input 
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-gray-900"
                />
              </div>
              
              <div className="flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Email Body
                  </label>
                  <div className="text-xs text-gray-500 flex gap-2">
                    Variables: <code className="bg-gray-100 px-1 rounded">[User_Name]</code> <code className="bg-gray-100 px-1 rounded">[Link]</code>
                  </div>
                </div>
                <textarea 
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="w-full h-96 p-4 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm text-gray-800 resize-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}
