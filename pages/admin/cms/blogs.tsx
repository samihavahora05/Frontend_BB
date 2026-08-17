import { AdminDashboardLayout } from "../../../src/layout/AdminDashboardLayout";
import { AnimatedContent } from "../../../src/components/reactbits/AnimatedContent";
import { Plus, Search, Filter, Edit3, Trash2, Eye, MessageCircle, Heart, Share2, MoreHorizontal } from "lucide-react";
import { Button } from "../../../src/components/ui/Button";
import { Badge } from "../../../src/components/ui/Badge";
import { useState } from "react";
import { useRouter } from "next/router";
import { BlogService } from "../../../src/lib/api/admin/BlogService";
import toast from "react-hot-toast";

export default function AdminBlogsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All Statuses");
  const router = useRouter();

  const { data: blogs, isLoading, mutate } = BlogService.useBlogs({ search, status });

  const handleDelete = async (id: number) => {
    if (confirm("Delete this blog post?")) {
      try {
        await BlogService.deleteBlog(id);
        toast.success("Blog deleted");
        mutate();
      } catch (err) {
        toast.error("Failed to delete");
      }
    }
  };

  const handleAction = async (id: number, action: string) => {
    try {
      await BlogService.actionBlog(id, action);
      toast.success(`Blog ${action}ed successfully`);
      mutate();
    } catch (err) {
      toast.error(`Failed to ${action} blog`);
    }
  };

  const statuses = ["All Statuses", "Published", "Draft", "Archived"];

  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        <AnimatedContent direction="up" delay={0.1} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Blog Management</h1>
            <p className="text-slate-500 text-sm">Write, publish, and manage content for your platform's blog.</p>
          </div>
          <Button variant="primary" className="shadow-md gap-2" onClick={() => router.push('/admin/cms/blog-editor/new')}>
            <Plus size={18}/> Write New Post
          </Button>
        </AnimatedContent>

        <AnimatedContent direction="up" delay={0.2} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4">
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
            {statuses.map(s => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-colors ${
                  status === s ? "bg-[#1B2A6B] text-white" : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search posts by title or author..." 
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-[#1B2A6B] outline-none transition-all"
            />
          </div>
        </AnimatedContent>

        <AnimatedContent direction="up" delay={0.3} className="grid grid-cols-1 gap-4">
          {isLoading ? (
            <div className="p-8 text-center text-slate-500 font-medium">Loading blogs...</div>
          ) : blogs.length === 0 ? (
            <div className="p-8 text-center text-slate-500 font-medium">No blog posts found.</div>
          ) : blogs.map((blog: any) => (
            <div key={blog.id} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row gap-6 hover:shadow-md hover:border-[#1B2A6B]/30 transition-all group">
               <div className="w-full sm:w-48 h-32 rounded-xl overflow-hidden shrink-0 border border-slate-100">
                  <img src={blog.thumbnail} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
               </div>
               
               <div className="flex-1 flex flex-col justify-between">
                   <div>
                    <div className="flex items-center gap-3 mb-1">
                      <Badge variant={blog.status === 'published' ? 'success' : 'secondary'}>{blog.status}</Badge>
                      <span className="text-xs font-semibold text-slate-400">{new Date(blog.created_at).toLocaleDateString()}</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#1B2A6B] transition-colors mb-1 cursor-pointer">
                      {blog.title}
                    </h3>
                    <p className="text-sm font-medium text-slate-500 mb-4">By <span className="text-slate-700 font-bold">{blog.author?.first_name || 'Admin'}</span></p>
                  </div>
                  
                  <div className="flex flex-wrap items-center justify-between gap-4">
                     <div className="flex items-center gap-4 text-xs font-semibold text-slate-500">
                       <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md"><Eye size={14}/> {blog.views_count}</span>
                       <span className="flex items-center gap-1.5 bg-rose-50 text-rose-600 px-2 py-1 rounded-md"><Heart size={14} fill="currentColor"/> {blog.likes_count}</span>
                       <span className="flex items-center gap-1.5 bg-blue-50 text-blue-600 px-2 py-1 rounded-md"><MessageCircle size={14}/> {blog.comments_count}</span>
                     </div>
                     
                     <div className="flex items-center gap-2 relative group/dropdown">
                        <Button variant="outline" className="h-8 text-xs font-bold gap-1.5 border-slate-200 bg-white" onClick={() => router.push(`/admin/cms/blog-editor/${blog.id}`)}><Edit3 size={14}/> Edit</Button>
                        <button onClick={() => handleDelete(blog.id)} className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition-colors"><Trash2 size={14}/></button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-[#1B2A6B] hover:bg-slate-50 transition-colors"><MoreHorizontal size={14}/></button>
                        
                        <div className="absolute right-0 top-full mt-2 w-36 bg-white border border-slate-200 rounded-xl shadow-lg opacity-0 invisible group-hover/dropdown:opacity-100 group-hover/dropdown:visible transition-all z-10 py-1">
                          <button onClick={() => handleAction(blog.id, 'duplicate')} className="w-full text-left px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50">Duplicate</button>
                          {blog.status !== 'published' && <button onClick={() => handleAction(blog.id, 'publish')} className="w-full text-left px-4 py-2 text-sm font-semibold text-emerald-600 hover:bg-slate-50">Publish</button>}
                          {blog.status === 'published' && <button onClick={() => handleAction(blog.id, 'draft')} className="w-full text-left px-4 py-2 text-sm font-semibold text-amber-600 hover:bg-slate-50">Unpublish</button>}
                          <button onClick={() => handleAction(blog.id, 'archive')} className="w-full text-left px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50">Archive</button>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          ))}
        </AnimatedContent>
      </div>
    </AdminDashboardLayout>
  );
}
