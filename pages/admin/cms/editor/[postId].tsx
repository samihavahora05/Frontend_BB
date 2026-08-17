import { AdminDashboardLayout } from "../../../../src/layout/AdminDashboardLayout";
import { RichTextEditor } from "../../../../src/components/ui/RichTextEditor";
import { ArrowLeft, Save, Eye, ImagePlus, Tag, Calendar, Globe } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function AdminBlogEditorPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState("Technology");
  const [tags, setTags] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [status, setStatus] = useState("Draft");

  const handleSave = () => {
    if (!title.trim()) { toast.error("Please add a title first."); return; }
    toast.success(`Post "${title}" saved as ${status}!`);
  };

  const handlePublish = () => {
    if (!title.trim()) { toast.error("Please add a title first."); return; }
    setStatus("Published");
    toast.success(`"${title}" is now LIVE!`);
  };

  return (
    <AdminDashboardLayout>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link href="/admin/cms/blogs" className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors">
              <ArrowLeft size={18} className="text-slate-600" />
            </Link>
            <div>
              <h1 className="text-xl font-black text-slate-800">Blog Editor</h1>
              <p className="text-xs font-medium text-slate-500">Write and publish rich content for your audience.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${status === "Published" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{status}</span>
            <button onClick={handleSave} className="h-10 px-4 rounded-xl border border-slate-200 text-slate-700 text-sm font-bold hover:bg-slate-50 transition-colors flex items-center gap-2">
              <Save size={15} /> Save Draft
            </button>
            <button onClick={handlePublish} className="h-10 px-5 rounded-xl bg-[#1B2A6B] text-white text-sm font-bold hover:bg-[#0d1635] transition-colors flex items-center gap-2 shadow-md">
              <Globe size={15} /> Publish
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Editor */}
          <div className="lg:col-span-2 space-y-4">
            {/* Cover Image */}
            {coverImage ? (
              <div className="relative rounded-2xl overflow-hidden h-52 group">
                <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button onClick={() => setCoverImage("")} className="bg-white text-slate-700 text-sm font-bold px-4 py-2 rounded-xl">Change Cover</button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => { const url = prompt("Enter cover image URL:"); if (url) setCoverImage(url); }}
                className="w-full h-36 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-2 text-slate-400 hover:border-[#C9A227] hover:text-[#C9A227] transition-colors"
              >
                <ImagePlus size={28} />
                <span className="text-sm font-bold">Add Cover Image</span>
              </button>
            )}

            {/* Title */}
            <input
              type="text"
              placeholder="Your post title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-3xl font-black text-slate-800 placeholder:text-slate-300 outline-none border-none bg-transparent py-2"
            />

            {/* Excerpt */}
            <textarea
              placeholder="Write a short excerpt or subtitle..."
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={2}
              className="w-full text-base text-slate-500 font-medium placeholder:text-slate-300 outline-none border-none bg-transparent resize-none"
            />

            <div className="border-t border-slate-100 pt-4">
              <RichTextEditor value={content} onChange={setContent} placeholder="Start writing your post..." minHeight="500px" />
            </div>
          </div>

          {/* Sidebar Settings */}
          <div className="space-y-4">
            {/* Publish Settings */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5">
              <h3 className="text-sm font-black text-slate-800 mb-4 flex items-center gap-2"><Calendar size={15} className="text-[#1B2A6B]"/> Publish Settings</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Status</label>
                  <select value={status} onChange={(e) => setStatus(e.target.value)} className="mt-1 w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none">
                    <option>Draft</option>
                    <option>Published</option>
                    <option>Scheduled</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Category</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} className="mt-1 w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none">
                    <option>Technology</option>
                    <option>Career</option>
                    <option>Design</option>
                    <option>Engineering</option>
                    <option>Data Science</option>
                    <option>Interview Tips</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5">
              <h3 className="text-sm font-black text-slate-800 mb-3 flex items-center gap-2"><Tag size={15} className="text-[#1B2A6B]"/> Tags</h3>
              <input
                type="text"
                placeholder="react, ux, career, ..."
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 outline-none focus:border-[#1B2A6B]"
              />
              <p className="text-xs text-slate-400 font-medium mt-2">Separate tags with commas.</p>
              {tags && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {tags.split(",").map((t, i) => t.trim() && (
                    <span key={i} className="text-xs font-bold bg-blue-50 text-[#1B2A6B] px-2.5 py-1 rounded-full">{t.trim()}</span>
                  ))}
                </div>
              )}
            </div>

            {/* SEO Preview */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5">
              <h3 className="text-sm font-black text-slate-800 mb-3 flex items-center gap-2"><Eye size={15} className="text-[#1B2A6B]"/> SEO Preview</h3>
              <div className="bg-slate-50 rounded-xl p-3 space-y-1">
                <p className="text-xs font-medium text-emerald-600">blueboxxda.in/blog/your-post-title</p>
                <p className="text-sm font-bold text-blue-700 line-clamp-1">{title || "Your Post Title Here"}</p>
                <p className="text-xs text-slate-500 line-clamp-2">{excerpt || "Your excerpt will appear here as the meta description for search engines."}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2">
              <button onClick={handlePublish} className="w-full h-11 rounded-xl bg-[#1B2A6B] text-white text-sm font-bold hover:bg-[#0d1635] transition-colors shadow-md flex items-center justify-center gap-2">
                <Globe size={15} /> Publish Now
              </button>
              <button onClick={handleSave} className="w-full h-11 rounded-xl border border-slate-200 text-slate-700 text-sm font-bold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                <Save size={15} /> Save Draft
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}
