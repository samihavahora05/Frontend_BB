import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { AdminDashboardLayout } from '../../../../src/layout/AdminDashboardLayout';
import { Save, RefreshCw, ArrowLeft, Upload, FileText, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { StudentService } from '../../../../src/lib/api/admin/StudentService';

export default function AddStudent() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '', last_name: '', email: '', phone: '', password: '', 
    date_of_birth: '', gender: '', student_type: '',
    company_name: '', job_title: '', identification_number: '',
    address_line_1: '', city: '', state: '', country: '', pin: '',
    course: '', department: '', semester: '', college_name: '',
    skills: '', bio: '', github_url: '', linkedin_url: '', portfolio_url: '',
    status: 'active'
  });
  
  const [files, setFiles] = useState<{ profile_photo: File | null; resume: File | null }>({
    profile_photo: null,
    resume: null
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [settings, setSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await StudentService.getSettings();
        setSettings(res.data || {});
      } catch (error) {
        console.error("Failed to fetch settings", error);
      }
    };
    fetchSettings();
  }, []);

  const isFieldVisible = (field: string) => {
    return settings[`show_${field}`] !== 'false';
  };

  const isFieldRequired = (field: string) => {
    return settings[`require_${field}`] === 'true';
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.first_name) newErrors.first_name = 'First Name is required';
    if (!formData.last_name) newErrors.last_name = 'Last Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    
    if (isFieldRequired('company') && !formData.company_name) newErrors.company_name = 'Company is required';
    if (isFieldRequired('gender') && !formData.gender) newErrors.gender = 'Gender is required';
    if (isFieldRequired('student_type') && !formData.student_type) newErrors.student_type = 'Student Type is required';
    if (isFieldRequired('identification_number') && !formData.identification_number) newErrors.identification_number = 'Identification Number is required';
    if (isFieldRequired('job_title') && !formData.job_title) newErrors.job_title = 'Job Title is required';
    if (isFieldRequired('date_of_birth') && !formData.date_of_birth) newErrors.date_of_birth = 'Date of Birth is required';
    if (isFieldRequired('phone') && !formData.phone) newErrors.phone = 'Phone is required';
    if (isFieldRequired('institute') && !formData.college_name) newErrors.college_name = 'Institute is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'profile_photo' | 'resume') => {
    if (e.target.files && e.target.files[0]) {
      setFiles({ ...files, [field]: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please fix the validation errors');
      return;
    }
    
    setIsLoading(true);
    try {
      const submitData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) submitData.append(key, value.toString());
      });
      
      if (files.profile_photo) submitData.append('profile_photo', files.profile_photo);
      if (files.resume) submitData.append('resume', files.resume);

      await StudentService.createStudent(submitData);
      toast.success('Student added successfully!');
      router.push('/admin/users/students');
    } catch (error: any) {
      if (error?.response?.data?.errors) {
        const firstError = Object.values(error.response.data.errors)[0] as string[];
        toast.error(firstError[0] || 'Validation failed');
        setErrors(error.response.data.errors);
      } else {
        toast.error(error?.response?.data?.message || 'Failed to add student');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    if(confirm('Are you sure you want to clear all fields?')) {
        setFormData({
            first_name: '', last_name: '', email: '', phone: '', password: '', 
            date_of_birth: '', gender: '', student_type: '',
            company_name: '', job_title: '', identification_number: '',
            address_line_1: '', city: '', state: '', country: '', pin: '',
            course: '', department: '', semester: '', college_name: '',
            skills: '', bio: '', github_url: '', linkedin_url: '', portfolio_url: '',
            status: 'active'
        });
        setFiles({ profile_photo: null, resume: null });
        setErrors({});
    }
  };

  return (
    <AdminDashboardLayout>
      <Head>
        <title>Add Student | Admin Panel</title>
      </Head>
      
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => router.back()} className="p-2 bg-white border border-gray-200 rounded-lg text-gray-500 hover:text-[#1B2A6B] hover:bg-gray-50 transition-colors">
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Add New Student</h1>
              <p className="text-sm text-gray-500">Create a new student profile in the system.</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
          <form onSubmit={handleSubmit}>
            <div className="p-6 md:p-8 space-y-8">
              
              {/* Basic Info Section */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-gray-700">First Name *</label>
                    <input type="text" value={formData.first_name} onChange={(e) => setFormData({...formData, first_name: e.target.value})} className={`w-full px-4 py-2.5 rounded-lg border ${errors.first_name ? 'border-red-300' : 'border-gray-200'} focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227] outline-none text-sm`} />
                    {errors.first_name && <p className="text-xs text-red-500">{errors.first_name}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-gray-700">Last Name *</label>
                    <input type="text" value={formData.last_name} onChange={(e) => setFormData({...formData, last_name: e.target.value})} className={`w-full px-4 py-2.5 rounded-lg border ${errors.last_name ? 'border-red-300' : 'border-gray-200'} focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227] outline-none text-sm`} />
                    {errors.last_name && <p className="text-xs text-red-500">{errors.last_name}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-gray-700">Email Address *</label>
                    <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className={`w-full px-4 py-2.5 rounded-lg border ${errors.email ? 'border-red-300' : 'border-gray-200'} focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227] outline-none text-sm`} />
                    {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                  </div>
                  {isFieldVisible('phone') && (
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-gray-700">Phone Number {isFieldRequired('phone') && '*'}</label>
                    <input type="text" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className={`w-full px-4 py-2.5 rounded-lg border ${errors.phone ? 'border-red-300' : 'border-gray-200'} focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227] outline-none text-sm`} />
                    {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
                  </div>
                  )}
                  {isFieldVisible('date_of_birth') && (
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-gray-700">Date of Birth {isFieldRequired('date_of_birth') && '*'}</label>
                    <input type="date" value={formData.date_of_birth} onChange={(e) => setFormData({...formData, date_of_birth: e.target.value})} className={`w-full px-4 py-2.5 rounded-lg border ${errors.date_of_birth ? 'border-red-300' : 'border-gray-200'} focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227] outline-none text-sm`} />
                    {errors.date_of_birth && <p className="text-xs text-red-500">{errors.date_of_birth}</p>}
                  </div>
                  )}
                  {isFieldVisible('gender') && (
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-gray-700">Gender {isFieldRequired('gender') && '*'}</label>
                    <select value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value})} className={`w-full px-4 py-2.5 rounded-lg border ${errors.gender ? 'border-red-300' : 'border-gray-200'} focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227] outline-none text-sm bg-white`}>
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.gender && <p className="text-xs text-red-500">{errors.gender}</p>}
                  </div>
                  )}
                </div>
              </div>

              {/* Profile Details */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">Professional & Academic</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {isFieldVisible('student_type') && (
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-gray-700">Student Type {isFieldRequired('student_type') && '*'}</label>
                    <select value={formData.student_type} onChange={(e) => setFormData({...formData, student_type: e.target.value})} className={`w-full px-4 py-2.5 rounded-lg border ${errors.student_type ? 'border-red-300' : 'border-gray-200'} focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227] outline-none text-sm bg-white`}>
                      <option value="">Select Type</option>
                      <option value="school">School Student</option>
                      <option value="college">College Student</option>
                      <option value="working">Working Professional</option>
                    </select>
                    {errors.student_type && <p className="text-xs text-red-500">{errors.student_type}</p>}
                  </div>
                  )}
                  {isFieldVisible('identification_number') && (
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-gray-700">Identification Number {isFieldRequired('identification_number') && '*'}</label>
                    <input type="text" value={formData.identification_number} onChange={(e) => setFormData({...formData, identification_number: e.target.value})} className={`w-full px-4 py-2.5 rounded-lg border ${errors.identification_number ? 'border-red-300' : 'border-gray-200'} focus:border-[#C9A227] outline-none text-sm`} />
                    {errors.identification_number && <p className="text-xs text-red-500">{errors.identification_number}</p>}
                  </div>
                  )}
                  {isFieldVisible('institute') && (
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-gray-700">College Name / University {isFieldRequired('institute') && '*'}</label>
                    <input type="text" value={formData.college_name} onChange={(e) => setFormData({...formData, college_name: e.target.value})} className={`w-full px-4 py-2.5 rounded-lg border ${errors.college_name ? 'border-red-300' : 'border-gray-200'} focus:border-[#C9A227] outline-none text-sm`} />
                    {errors.college_name && <p className="text-xs text-red-500">{errors.college_name}</p>}
                  </div>
                  )}
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-gray-700">Course / Degree</label>
                    <input type="text" value={formData.course} onChange={(e) => setFormData({...formData, course: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-[#C9A227] outline-none text-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-gray-700">Department</label>
                    <input type="text" value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-[#C9A227] outline-none text-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-gray-700">Semester</label>
                    <input type="number" value={formData.semester} onChange={(e) => setFormData({...formData, semester: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-[#C9A227] outline-none text-sm" />
                  </div>
                  {isFieldVisible('company') && (
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-gray-700">Company Name (If Working) {isFieldRequired('company') && '*'}</label>
                    <input type="text" value={formData.company_name} onChange={(e) => setFormData({...formData, company_name: e.target.value})} className={`w-full px-4 py-2.5 rounded-lg border ${errors.company_name ? 'border-red-300' : 'border-gray-200'} focus:border-[#C9A227] outline-none text-sm`} />
                    {errors.company_name && <p className="text-xs text-red-500">{errors.company_name}</p>}
                  </div>
                  )}
                  {isFieldVisible('job_title') && (
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-gray-700">Job Title {isFieldRequired('job_title') && '*'}</label>
                    <input type="text" value={formData.job_title} onChange={(e) => setFormData({...formData, job_title: e.target.value})} className={`w-full px-4 py-2.5 rounded-lg border ${errors.job_title ? 'border-red-300' : 'border-gray-200'} focus:border-[#C9A227] outline-none text-sm`} />
                    {errors.job_title && <p className="text-xs text-red-500">{errors.job_title}</p>}
                  </div>
                  )}
                </div>
              </div>

              {/* Location */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">Location Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-sm font-bold text-gray-700">Address Line</label>
                    <input type="text" value={formData.address_line_1} onChange={(e) => setFormData({...formData, address_line_1: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-[#C9A227] outline-none text-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-gray-700">City</label>
                    <input type="text" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-[#C9A227] outline-none text-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-gray-700">State</label>
                    <input type="text" value={formData.state} onChange={(e) => setFormData({...formData, state: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-[#C9A227] outline-none text-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-gray-700">Country</label>
                    <input type="text" value={formData.country} onChange={(e) => setFormData({...formData, country: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-[#C9A227] outline-none text-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-gray-700">PIN / Zip Code</label>
                    <input type="text" value={formData.pin} onChange={(e) => setFormData({...formData, pin: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-[#C9A227] outline-none text-sm" />
                  </div>
                </div>
              </div>

              {/* Bio & Social */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">Bio & Social Links</h3>
                <div className="space-y-6">
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-gray-700">Bio</label>
                    <textarea value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})} rows={3} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-[#C9A227] outline-none text-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-gray-700">Skills (Comma separated)</label>
                    <input type="text" value={formData.skills} onChange={(e) => setFormData({...formData, skills: e.target.value})} placeholder="e.g. React, Laravel, UI/UX" className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-[#C9A227] outline-none text-sm" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-gray-700">GitHub URL</label>
                      <input type="url" value={formData.github_url} onChange={(e) => setFormData({...formData, github_url: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-[#C9A227] outline-none text-sm" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-gray-700">LinkedIn URL</label>
                      <input type="url" value={formData.linkedin_url} onChange={(e) => setFormData({...formData, linkedin_url: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-[#C9A227] outline-none text-sm" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-gray-700">Portfolio URL</label>
                      <input type="url" value={formData.portfolio_url} onChange={(e) => setFormData({...formData, portfolio_url: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-[#C9A227] outline-none text-sm" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Security Section */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">Security & Access</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-gray-700">Password *</label>
                    <input type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className={`w-full px-4 py-2.5 rounded-lg border ${errors.password ? 'border-red-300' : 'border-gray-200'} focus:border-[#C9A227] outline-none text-sm`} />
                    {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-gray-700">Status</label>
                    <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-[#C9A227] outline-none text-sm bg-white">
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Uploads Section */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">Files & Documents</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-gray-700">Profile Image</label>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-400 overflow-hidden">
                        {files.profile_photo ? (
                          <img src={URL.createObjectURL(files.profile_photo)} alt="Profile" className="w-full h-full object-cover" />
                        ) : <ImageIcon size={24} />}
                      </div>
                      <div className="flex-1 relative border-2 border-dashed border-gray-200 rounded-xl px-4 py-4 hover:bg-gray-50 hover:border-[#C9A227]/50 transition-colors cursor-pointer text-center group">
                        <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'profile_photo')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                        <Upload size={20} className="mx-auto text-gray-400 group-hover:text-[#C9A227] mb-2" />
                        <p className="text-xs font-medium text-gray-500">{files.profile_photo ? files.profile_photo.name : 'Click to browse or drag image here'}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-gray-700">Resume (PDF, DOCX)</label>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-400">
                        <FileText size={24} />
                      </div>
                      <div className="flex-1 relative border-2 border-dashed border-gray-200 rounded-xl px-4 py-4 hover:bg-gray-50 hover:border-[#1B2A6B]/50 transition-colors cursor-pointer text-center group">
                        <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => handleFileChange(e, 'resume')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                        <Upload size={20} className="mx-auto text-gray-400 group-hover:text-[#1B2A6B] mb-2" />
                        <p className="text-xs font-medium text-gray-500">{files.resume ? files.resume.name : 'Click to browse or drag resume here'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
            
            {/* Form Actions */}
            <div className="p-6 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between sticky bottom-0 z-10 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
              <button 
                type="button" 
                onClick={handleReset}
                className="flex items-center gap-2 px-6 py-2.5 text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 font-bold rounded-lg shadow-sm transition-all"
              >
                <RefreshCw size={16} /> Reset Form
              </button>
              
              <button 
                type="submit" 
                disabled={isLoading}
                className="flex items-center gap-2 px-8 py-2.5 bg-[#C9A227] hover:bg-[#b08d22] text-white font-bold rounded-lg shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:hover:translate-y-0"
              >
                {isLoading ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />}
                {isLoading ? 'Saving...' : 'Save Student'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}
