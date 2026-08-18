import { AdminDashboardLayout } from "../../../../src/layout/AdminDashboardLayout";
import { AnimatedContent } from "../../../../src/components/reactbits/AnimatedContent";
import { RichTextEditor } from "../../../../src/components/ui/RichTextEditor";
import { Button } from "../../../../src/components/ui/Button";
import { ArrowLeft, Save, Image as ImageIcon, Send, Settings, Hash, Layout, Calendar, Video, ToggleLeft, Link2 } from "lucide-react";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { BlogService } from "../../../../src/lib/api/admin/BlogService";
import Link from "next/link";

export default function BlogEditorPage() {
  const router = useRouter();
  const { id } = router.query;
  const isNew = id === 'new';

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [tags, setTags] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [excerpt, setExcerpt] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [allowComments, setAllowComments] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isTrending, setIsTrending] = useState(false);
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [metaKeywords, setMetaKeywords] = useState("");
  const [status, setStatus] = useState("draft");
  const [visibility, setVisibility] = useState("public");
  const [canonicalUrl, setCanonicalUrl] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");

  const [isSaving, setIsSaving] = useState(false);
  const [showSettings, setShowSettings] = useState(true); // Toggle sidebar on smaller screens

  // Load actual categories
  const { data: categories } = BlogService.useCategories();

  const loadBlog = React.useCallback(async () => {
    try {
      const { data } = await BlogService.getBlog(id as string);
      setTitle(data.title || "");
      setContent(data.content || "");
      setCategoryId(data.category_id || "");
      setTags(data.tags ? data.tags.join(", ") : "");
      if (data.thumbnail) setPreviewImage(data.thumbnail);
      setExcerpt(data.excerpt || "");
      setVideoUrl(data.video_url || "");
      setAllowComments(data.allow_comments ?? true);
      setIsFeatured(data.is_featured ?? false);
      setIsTrending(data.is_trending ?? false);
      setMetaTitle(data.meta_title || "");
      setMetaDescription(data.meta_description || "");
      setCanonicalUrl(data.canonical_url || "");
      setMetaKeywords(data.meta_keywords ? data.meta_keywords.join(", ") : "");
      setStatus(data.status || "draft");
      setVisibility(data.visibility || "public");
      setScheduledAt(data.scheduled_at ? new Date(data.scheduled_at).toISOString().slice(0, 16) : "");
    } catch (error) {
      toast.error("Failed to load blog");
    }
  }, [id]);

  useEffect(() => {
    if (!isNew && id) {
      loadBlog();
    }
  }, [id, isNew, loadBlog]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnail(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSave = async (targetPublishStatus: 'Published' | 'Draft' | 'Scheduled') => {
    if (!title) return toast.error("Title is required");
    if (!categoryId) return toast.error("Category is required");
    
    setIsSaving(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("category_id", categoryId);
    
    // Format status to match Laravel validation: draft, published, archived
    let finalStatus = targetPublishStatus.toLowerCase();
    if (finalStatus === 'scheduled') {
      finalStatus = 'draft';
    }
    formData.append("status", finalStatus || status);
    formData.append("visibility", visibility);
    
    if (tags) {
      tags.split(",").map(t => t.trim()).filter(Boolean).forEach(t => formData.append("tags[]", t));
    }
    if (thumbnail) formData.append("thumbnail", thumbnail);
    if (excerpt) formData.append("excerpt", excerpt);
    if (videoUrl) formData.append("video_url", videoUrl);
    formData.append("allow_comments", allowComments ? "1" : "0");
    formData.append("is_featured", isFeatured ? "1" : "0");
    formData.append("is_trending", isTrending ? "1" : "0");
    if (metaTitle) formData.append("meta_title", metaTitle);
    if (metaDescription) formData.append("meta_description", metaDescription);
    if (metaKeywords) formData.append("meta_keywords", metaKeywords);
    if (canonicalUrl) formData.append("canonical_url", canonicalUrl);
    if (targetPublishStatus === 'Scheduled' && scheduledAt) {
      formData.append("scheduled_at", scheduledAt);
    }

    try {
      if (isNew) {
        await BlogService.createBlog(formData);
        toast.success("Blog created successfully!");
        router.push("/admin/cms/blogs");
      } else {
        await BlogService.updateBlog(id as string, formData);
        toast.success("Blog updated successfully!");
      }
    } catch (error) {
      toast.error("Failed to save blog");
    } finally {
      setIsSaving(false);
    }
  };

  // Generate a clean permalink
  const permalink = `/blog/${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || 'untitled-post'}`;

  return (
    <AdminDashboardLayout>
      <div className="max-w-[1400px] mx-auto h-full flex flex-col">
        {/* Top Navbar - Notion Style */}
        <div className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-20 px-6 py-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <Link href="/admin/cms/blogs" className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors">
              <ArrowLeft size={16} />
            </Link>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-slate-800">{isNew ? "Drafting New Post" : "Editing Post"}</span>
              <span className="text-xs font-medium text-slate-400 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span> Unsaved changes
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowSettings(!showSettings)}
              className={`lg:hidden w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${showSettings ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
            >
              <Settings size={18} />
            </button>
            <Button 
              variant="outline" 
              onClick={() => handleSave("Draft")}
              disabled={isSaving}
              className="hidden sm:flex border-slate-200 text-slate-600 hover:bg-slate-50 font-bold"
            >
              <Save size={16} className="mr-2" /> Save Draft
            </Button>
            <Button 
              onClick={() => handleSave(scheduledAt ? "Scheduled" : "Published")}
              disabled={isSaving}
              className="bg-[#1B2A6B] hover:bg-[#121c47] text-white shadow-md font-bold"
            >
              <Send size={16} className="mr-2" /> {scheduledAt ? "Schedule" : "Publish"}
            </Button>
          </div>
        </div>

        <AnimatedContent className="flex-1 overflow-y-auto">
          <div className="flex flex-col lg:flex-row h-full">
            
            {/* Main Editor Area - Distraction Free */}
            <div className={`flex-1 p-6 lg:p-12 transition-all duration-300 ${showSettings ? 'lg:pr-8' : ''}`}>
              <div className="max-w-4xl mx-auto space-y-8">
                
                {/* Minimal Title Input */}
                <div className="group relative">
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Post Title..."
                    className="w-full text-4xl lg:text-5xl font-black text-slate-800 placeholder-slate-300 bg-transparent border-none outline-none resize-none focus:ring-0 p-0 leading-tight"
                  />
                  {title && (
                    <div className="absolute -bottom-6 left-0 flex items-center gap-1.5 text-xs font-medium text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link2 size={12} />
                      <span>{permalink}</span>
                    </div>
                  )}
                </div>

                {/* The Tiptap Editor */}
                <div className="mt-8">
                  <RichTextEditor 
                    value={content} 
                    onChange={setContent} 
                    placeholder="Press '/' for commands or start writing your amazing story..."
                    onImageUpload={BlogService.uploadContentImage}
                  />
                </div>
              </div>
            </div>

            {/* Right Sidebar - Settings (Slide-over on mobile, sticky on desktop) */}
            <div className={`
              ${showSettings ? 'block' : 'hidden'} 
              w-full lg:w-[380px] bg-slate-50/50 border-l border-slate-200 p-6 lg:p-8 shrink-0
              lg:block lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto
            `}>
              <div className="space-y-8 max-w-sm mx-auto">
                
                {/* Publishing Info */}
                <div>
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Layout size={14} /> Organization
                  </h3>
                  <div className="space-y-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Category</label>
                      <select 
                        value={categoryId} 
                        onChange={(e) => setCategoryId(e.target.value)} 
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-[#1B2A6B]/20 focus:border-[#1B2A6B] outline-none transition-all"
                      >
                        <option value="">Select Category</option>
                        {categories?.map((cat: any) => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Tags</label>
                      <div className="relative">
                        <Hash size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                          type="text" 
                          value={tags}
                          onChange={(e) => setTags(e.target.value)}
                          placeholder="React, Nextjs..." 
                          className="w-full pl-9 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-[#1B2A6B]/20 focus:border-[#1B2A6B] outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Media */}
                <div>
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <ImageIcon size={14} /> Media
                  </h3>
                  <div className="space-y-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Cover Image</label>
                      <label className="w-full aspect-video bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400 hover:text-[#1B2A6B] hover:bg-indigo-50/50 hover:border-indigo-200 transition-all cursor-pointer relative overflow-hidden group">
                        {previewImage ? (
                          <>
                            <img src={previewImage} alt="Preview" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <span className="text-white text-xs font-bold px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-lg">Change Cover</span>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center mb-2">
                              <ImageIcon size={20} className="text-slate-400" />
                            </div>
                            <span className="text-xs font-bold text-slate-500">Upload Cover Image</span>
                          </>
                        )}
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                      </label>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Video Link <span className="text-slate-400 font-medium">(Optional)</span></label>
                      <div className="relative">
                        <Video size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                          type="url" 
                          value={videoUrl}
                          onChange={(e) => setVideoUrl(e.target.value)}
                          placeholder="YouTube URL..."
                          className="w-full pl-9 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-[#1B2A6B]/20 focus:border-[#1B2A6B] outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Scheduling */}
                <div>
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Calendar size={14} /> Scheduling
                  </h3>
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <input 
                      type="datetime-local" 
                      value={scheduledAt}
                      onChange={(e) => setScheduledAt(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-[#1B2A6B]/20 focus:border-[#1B2A6B] outline-none transition-all"
                    />
                  </div>
                </div>

                {/* SEO Settings */}
                <div>
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Search size={14} /> Search Engine
                  </h3>
                  <div className="space-y-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Meta Title</label>
                      <input 
                        type="text" 
                        value={metaTitle}
                        onChange={(e) => setMetaTitle(e.target.value)}
                        placeholder="SEO Title..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-[#1B2A6B]/20 focus:border-[#1B2A6B] outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Meta Description</label>
                      <textarea 
                        value={metaDescription}
                        onChange={(e) => setMetaDescription(e.target.value)}
                        rows={3}
                        placeholder="SEO Description..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-[#1B2A6B]/20 focus:border-[#1B2A6B] outline-none transition-all resize-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Meta Keywords</label>
                      <input 
                        type="text" 
                        value={metaKeywords}
                        onChange={(e) => setMetaKeywords(e.target.value)}
                        placeholder="Keyword 1, Keyword 2..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-[#1B2A6B]/20 focus:border-[#1B2A6B] outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Visibility</label>
                      <select 
                        value={visibility}
                        onChange={(e) => setVisibility(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-[#1B2A6B]/20 focus:border-[#1B2A6B] outline-none transition-all"
                      >
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                        <option value="unlisted">Unlisted</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Short Excerpt</label>
                      <textarea 
                        value={excerpt}
                        onChange={(e) => setExcerpt(e.target.value)}
                        rows={2}
                        placeholder="Snippet for blog cards..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-[#1B2A6B]/20 focus:border-[#1B2A6B] outline-none transition-all resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Settings Toggles */}
                <div>
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <ToggleLeft size={14} /> Preferences
                  </h3>
                  <div className="space-y-1 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
                    <label className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors group">
                      <span className="text-sm font-bold text-slate-700">Allow Comments</span>
                      <div className={`w-10 h-6 rounded-full transition-colors relative ${allowComments ? 'bg-[#1B2A6B]' : 'bg-slate-200'}`}>
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${allowComments ? 'left-5' : 'left-1'}`}></div>
                      </div>
                      <input type="checkbox" checked={allowComments} onChange={(e) => setAllowComments(e.target.checked)} className="hidden" />
                    </label>
                    <label className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors group">
                      <span className="text-sm font-bold text-slate-700">Feature Post</span>
                      <div className={`w-10 h-6 rounded-full transition-colors relative ${isFeatured ? 'bg-[#1B2A6B]' : 'bg-slate-200'}`}>
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${isFeatured ? 'left-5' : 'left-1'}`}></div>
                      </div>
                      <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} className="hidden" />
                    </label>
                    <label className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors group">
                      <span className="text-sm font-bold text-slate-700">Trending</span>
                      <div className={`w-10 h-6 rounded-full transition-colors relative ${isTrending ? 'bg-[#1B2A6B]' : 'bg-slate-200'}`}>
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${isTrending ? 'left-5' : 'left-1'}`}></div>
                      </div>
                      <input type="checkbox" checked={isTrending} onChange={(e) => setIsTrending(e.target.checked)} className="hidden" />
                    </label>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </AnimatedContent>
      </div>
    </AdminDashboardLayout>
  );
}

// Dummy icon for Search
const Search = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);
