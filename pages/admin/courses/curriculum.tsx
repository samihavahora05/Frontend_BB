import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { AdminDashboardLayout } from '../../../src/layout/AdminDashboardLayout';
import { 
  Plus, Edit2, Trash2, ArrowUp, ArrowDown, FileText, PlaySquare, 
  AlignLeft, HelpCircle, FileCheck, Folder, ChevronDown, ChevronRight, X, Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { CourseService, Course } from '../../../src/lib/api/admin/CourseService';
import { CourseCurriculumService, Module, Lesson } from '../../../src/lib/api/admin/CourseCurriculumService';

export default function CourseCurriculumPage() {
  const router = useRouter();
  const { courseId } = router.query;
  const cId = courseId ? parseInt(courseId as string) : undefined;

  const [course, setCourse] = useState<Course | null>(null);
  
  // Fetch course
  useEffect(() => {
    if (cId) {
      CourseService.get(cId).then(setCourse).catch(() => toast.error('Failed to load course details'));
    }
  }, [cId]);

  // Fetch Curriculum
  const { data: modules, isLoading, mutate } = CourseCurriculumService.useCurriculum(cId);

  // UI State
  const [expandedModules, setExpandedModules] = useState<Set<number>>(new Set());
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  
  // Edit State
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [activeModuleIdForLesson, setActiveModuleIdForLesson] = useState<number | null>(null);

  // Form State - Module
  const [moduleTitle, setModuleTitle] = useState('');
  
  // Form State - Lesson
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonType, setLessonType] = useState('Video');
  const [lessonUrl, setLessonUrl] = useState('');
  const [lessonContent, setLessonContent] = useState('');
  const [lessonDuration, setLessonDuration] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleModule = (id: number) => {
    const newSet = new Set(expandedModules);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setExpandedModules(newSet);
  };

  // --- MODULE ACTIONS ---
  const handleOpenAddModule = () => {
    setEditingModule(null);
    setModuleTitle('');
    setIsModuleModalOpen(true);
  };

  const handleOpenEditModule = (mod: Module) => {
    setEditingModule(mod);
    setModuleTitle(mod.title);
    setIsModuleModalOpen(true);
  };

  const handleSaveModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cId || !moduleTitle.trim()) return;
    setIsSubmitting(true);
    try {
      if (editingModule) {
        await CourseCurriculumService.updateModule(editingModule.id, { title: moduleTitle });
        toast.success('Module updated');
      } else {
        await CourseCurriculumService.createModule(cId, { title: moduleTitle });
        toast.success('Module created');
      }
      setIsModuleModalOpen(false);
      mutate();
    } catch (e) {
      toast.error('Failed to save module');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteModule = async (id: number) => {
    if (!confirm('Are you sure you want to delete this module and ALL its lessons?')) return;
    try {
      await CourseCurriculumService.deleteModule(id);
      toast.success('Module deleted');
      mutate();
    } catch (e) {
      toast.error('Failed to delete module');
    }
  };

  const handleMoveModule = async (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === modules.length - 1)) return;
    const newModules = [...modules];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newModules[index], newModules[targetIndex]] = [newModules[targetIndex], newModules[index]];
    
    // Optimistic update
    mutate(newModules, false);
    try {
      const orderedIds = newModules.map(m => m.id);
      await CourseCurriculumService.reorderModules(orderedIds);
      mutate();
    } catch (e) {
      toast.error('Failed to reorder modules');
      mutate(); // revert
    }
  };

  // --- LESSON ACTIONS ---
  const handleOpenAddLesson = (modId: number) => {
    setEditingLesson(null);
    setActiveModuleIdForLesson(modId);
    setLessonTitle('');
    setLessonType('Video');
    setLessonUrl('');
    setLessonContent('');
    setLessonDuration('');
    setIsLessonModalOpen(true);
    setExpandedModules(prev => new Set(prev).add(modId));
  };

  const handleOpenEditLesson = (modId: number, lesson: Lesson) => {
    setEditingLesson(lesson);
    setActiveModuleIdForLesson(modId);
    setLessonTitle(lesson.title);
    setLessonType(lesson.type);
    setLessonUrl(lesson.video_url || '');
    setLessonContent(lesson.content || '');
    setLessonDuration(lesson.duration_minutes ? lesson.duration_minutes.toString() : '');
    setIsLessonModalOpen(true);
  };

  const handleSaveLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeModuleIdForLesson || !lessonTitle.trim()) return;
    setIsSubmitting(true);
    const data = {
      title: lessonTitle,
      type: lessonType,
      video_url: lessonUrl,
      content: lessonContent,
      duration_minutes: lessonDuration ? parseInt(lessonDuration) : null
    };

    try {
      if (editingLesson) {
        await CourseCurriculumService.updateLesson(editingLesson.id, data);
        toast.success('Lesson updated');
      } else {
        await CourseCurriculumService.createLesson(activeModuleIdForLesson, data);
        toast.success('Lesson added');
      }
      setIsLessonModalOpen(false);
      mutate();
    } catch (e) {
      toast.error('Failed to save lesson');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteLesson = async (id: number) => {
    if (!confirm('Delete this lesson?')) return;
    try {
      await CourseCurriculumService.deleteLesson(id);
      toast.success('Lesson deleted');
      mutate();
    } catch (e) {
      toast.error('Failed to delete lesson');
    }
  };

  const handleMoveLesson = async (modId: number, lessonIndex: number, direction: 'up' | 'down') => {
    const mod = modules.find(m => m.id === modId);
    if (!mod || !mod.lessons) return;
    if ((direction === 'up' && lessonIndex === 0) || (direction === 'down' && lessonIndex === mod.lessons.length - 1)) return;
    
    const newLessons = [...mod.lessons];
    const targetIndex = direction === 'up' ? lessonIndex - 1 : lessonIndex + 1;
    [newLessons[lessonIndex], newLessons[targetIndex]] = [newLessons[targetIndex], newLessons[lessonIndex]];
    
    try {
      const orderedIds = newLessons.map(l => l.id);
      await CourseCurriculumService.reorderLessons(orderedIds);
      mutate();
    } catch (e) {
      toast.error('Failed to reorder lessons');
    }
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'Video': return <PlaySquare size={16} className="text-blue-500" />;
      case 'PDF': return <FileText size={16} className="text-red-500" />;
      case 'Quiz': return <HelpCircle size={16} className="text-amber-500" />;
      case 'Assignment': return <FileCheck size={16} className="text-indigo-500" />;
      default: return <AlignLeft size={16} className="text-slate-500" />;
    }
  };

  if (!cId) return null;

  return (
    <AdminDashboardLayout>
      <Head>
        <title>Curriculum Builder | BlueBoxx DA</title>
      </Head>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <button onClick={() => router.push('/admin/courses')} className="text-[#1B2A6B] text-sm font-bold hover:underline mb-1 flex items-center gap-1">
            &larr; Back to Courses
          </button>
          <h1 className="text-2xl font-black text-[#0d1635] flex items-center gap-2">Curriculum Builder</h1>
          <p className="text-slate-500 text-sm mt-1 font-semibold">{course?.title || 'Loading course...'}</p>
        </div>
        
        <button onClick={handleOpenAddModule} className="flex items-center gap-2 bg-[#1B2A6B] hover:bg-[#121c47] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all">
          <Plus size={16} /> Add Module
        </button>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 min-h-[500px]">
        {isLoading ? (
          <div className="flex justify-center items-center h-48">
            <Loader2 className="animate-spin text-[#1B2A6B]" size={32} />
          </div>
        ) : modules.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Folder size={32} />
            </div>
            <h3 className="text-lg font-black text-slate-800 mb-1">No modules found</h3>
            <p className="text-sm font-medium text-slate-500 mb-6">Start building your course curriculum by adding the first module.</p>
            <button onClick={handleOpenAddModule} className="inline-flex items-center gap-2 bg-[#1B2A6B] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md">
              <Plus size={16} /> Add Module
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {modules.map((mod, index) => {
              const isExpanded = expandedModules.has(mod.id);
              return (
                <div key={mod.id} className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
                  {/* Module Header */}
                  <div className="bg-slate-50 border-b border-slate-100 p-4 flex items-center justify-between group">
                    <div className="flex items-center gap-3 flex-1 cursor-pointer" onClick={() => toggleModule(mod.id)}>
                      <button className="text-slate-400 hover:text-slate-700 transition-colors">
                        {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                      </button>
                      <div>
                        <h3 className="text-base font-black text-slate-800">Module {index + 1}: {mod.title}</h3>
                        <p className="text-xs font-semibold text-slate-500 mt-0.5">{mod.lessons?.length || 0} Lessons</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleMoveModule(index, 'up')} disabled={index === 0} className="p-1.5 text-slate-400 hover:text-[#1B2A6B] hover:bg-slate-100 rounded disabled:opacity-30 tooltip" title="Move Up"><ArrowUp size={16} /></button>
                      <button onClick={() => handleMoveModule(index, 'down')} disabled={index === modules.length - 1} className="p-1.5 text-slate-400 hover:text-[#1B2A6B] hover:bg-slate-100 rounded disabled:opacity-30 tooltip" title="Move Down"><ArrowDown size={16} /></button>
                      <div className="w-px h-4 bg-slate-300 mx-1"></div>
                      <button onClick={() => handleOpenAddLesson(mod.id)} className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded tooltip" title="Add Lesson"><Plus size={16} /></button>
                      <button onClick={() => handleOpenEditModule(mod)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded tooltip" title="Edit Module"><Edit2 size={16} /></button>
                      <button onClick={() => handleDeleteModule(mod.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded tooltip" title="Delete Module"><Trash2 size={16} /></button>
                    </div>
                  </div>

                  {/* Lessons List */}
                  {isExpanded && (
                    <div className="bg-white p-2">
                      {!mod.lessons || mod.lessons.length === 0 ? (
                        <div className="text-center py-6">
                          <p className="text-sm font-semibold text-slate-400 mb-3">No lessons in this module.</p>
                          <button onClick={() => handleOpenAddLesson(mod.id)} className="text-xs font-bold text-[#1B2A6B] hover:underline">
                            + Add First Lesson
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-1 pl-8 pr-2">
                          {mod.lessons.map((lesson, lIndex) => (
                            <div key={lesson.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all group/lesson">
                              <div className="flex items-center gap-3">
                                {getLessonIcon(lesson.type)}
                                <div>
                                  <div className="text-sm font-bold text-slate-800">{lesson.title}</div>
                                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mt-0.5">
                                    <span className="uppercase tracking-wider">{lesson.type}</span>
                                    {lesson.duration_minutes && (
                                      <>
                                        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                        <span>{lesson.duration_minutes} mins</span>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-1 opacity-0 group-hover/lesson:opacity-100 transition-opacity">
                                <button onClick={() => handleMoveLesson(mod.id, lIndex, 'up')} disabled={lIndex === 0} className="p-1.5 text-slate-400 hover:text-[#1B2A6B] hover:bg-slate-100 rounded disabled:opacity-30"><ArrowUp size={14} /></button>
                                <button onClick={() => handleMoveLesson(mod.id, lIndex, 'down')} disabled={lIndex === mod.lessons.length - 1} className="p-1.5 text-slate-400 hover:text-[#1B2A6B] hover:bg-slate-100 rounded disabled:opacity-30"><ArrowDown size={14} /></button>
                                <div className="w-px h-3 bg-slate-300 mx-1"></div>
                                <button onClick={() => handleOpenEditLesson(mod.id, lesson)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded"><Edit2 size={14} /></button>
                                <button onClick={() => handleDeleteLesson(lesson.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"><Trash2 size={14} /></button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* MODULE MODAL */}
      {isModuleModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-black text-slate-800">{editingModule ? 'Edit Module' : 'Add New Module'}</h3>
              <button onClick={() => setIsModuleModalOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-200 rounded-lg"><X size={20} /></button>
            </div>
            <form onSubmit={handleSaveModule} className="p-6">
              <div className="mb-4">
                <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2">Module Title <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  value={moduleTitle} 
                  onChange={e => setModuleTitle(e.target.value)} 
                  required
                  placeholder="e.g. Introduction to Data Science" 
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-[#1B2A6B]" 
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => setIsModuleModalOpen(false)} className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-xl transition-all">Cancel</button>
                <button type="submit" disabled={isSubmitting || !moduleTitle.trim()} className="flex-1 py-2.5 bg-[#1B2A6B] hover:bg-[#121c47] text-white text-sm font-bold rounded-xl shadow-md transition-all flex justify-center items-center">
                  {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : 'Save Module'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LESSON MODAL */}
      {isLessonModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
              <h3 className="text-lg font-black text-slate-800">{editingLesson ? 'Edit Lesson' : 'Add New Lesson'}</h3>
              <button onClick={() => setIsLessonModalOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-200 rounded-lg"><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSaveLesson} className="p-6 overflow-y-auto admin-scrollbar">
              <div className="mb-4">
                <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2">Lesson Title <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  value={lessonTitle} 
                  onChange={e => setLessonTitle(e.target.value)} 
                  required
                  placeholder="e.g. Setting up your environment" 
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-[#1B2A6B]" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2">Lesson Type <span className="text-red-500">*</span></label>
                  <select 
                    value={lessonType} 
                    onChange={e => setLessonType(e.target.value)} 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-[#1B2A6B]"
                  >
                    <option value="Video">Video</option>
                    <option value="PDF">PDF</option>
                    <option value="Text">Text</option>
                    <option value="Quiz">Quiz</option>
                    <option value="Assignment">Assignment</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2">Duration (mins)</label>
                  <input 
                    type="number" 
                    value={lessonDuration} 
                    onChange={e => setLessonDuration(e.target.value)} 
                    placeholder="e.g. 15" 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-[#1B2A6B]" 
                  />
                </div>
              </div>

              {(lessonType === 'Video' || lessonType === 'PDF') && (
                <div className="mb-4">
                  <label className="flex items-center justify-between text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2">
                    <span>{lessonType} URL <span className="text-red-500">*</span></span>
                    <a href="/admin/media" target="_blank" className="text-[#1B2A6B] hover:underline normal-case tracking-normal">Open Media Manager ↗</a>
                  </label>
                  <input 
                    type="text" 
                    value={lessonUrl} 
                    onChange={e => setLessonUrl(e.target.value)} 
                    required={lessonType === 'Video' || lessonType === 'PDF'}
                    placeholder="Paste the URL from Media Manager" 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-[#1B2A6B]" 
                  />
                  <p className="text-xs text-slate-500 mt-1.5 font-medium">Upload your file in the Media Manager, copy the Link, and paste it here.</p>
                </div>
              )}

              {(lessonType === 'Text' || lessonType === 'Quiz' || lessonType === 'Assignment') && (
                <div className="mb-4">
                  <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2">Content Details <span className="text-red-500">*</span></label>
                  <textarea 
                    value={lessonContent} 
                    onChange={e => setLessonContent(e.target.value)} 
                    required
                    rows={4}
                    placeholder={`Enter ${lessonType.toLowerCase()} content or instructions...`}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-[#1B2A6B] resize-none" 
                  />
                </div>
              )}

              <div className="flex gap-3 mt-8 shrink-0">
                <button type="button" onClick={() => setIsLessonModalOpen(false)} className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-xl transition-all">Cancel</button>
                <button type="submit" disabled={isSubmitting || !lessonTitle.trim()} className="flex-1 py-2.5 bg-[#1B2A6B] hover:bg-[#121c47] text-white text-sm font-bold rounded-xl shadow-md transition-all flex justify-center items-center">
                  {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : 'Save Lesson'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminDashboardLayout>
  );
}
