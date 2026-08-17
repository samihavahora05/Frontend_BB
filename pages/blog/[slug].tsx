import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { MainLayout } from "../../src/layout/MainLayout";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock, Share2, Heart, MessageSquare, Loader2 } from "lucide-react";
import api from "../../src/lib/axios";
import { Button } from "../../src/components/ui/Button";
import { Badge } from "../../src/components/ui/Badge";
import Link from "next/link";
import { SEO } from "../../src/components/seo/SEO";
import { useAuth } from "../../src/context/AuthContext";
import toast from "react-hot-toast";

export default function BlogDetailsPage() {
  const router = useRouter();
  const { slug } = router.query;
  const [blog, setBlog] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [commentsCount, setCommentsCount] = useState(0);
  const [comments, setComments] = useState<any[]>([]);
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (slug) {
      const fetchBlog = async () => {
        try {
          setIsLoading(true);
          const res = await api.get(`/public/blogs/${slug}`);
          if (res.data.success) {
            const data = res.data.data;
            setBlog(data);
            setIsLiked(data.is_liked || false);
            setLikesCount(data.likes_count || 0);
            setCommentsCount(data.comments_count || 0);
            setComments(data.comments || []);
          }
        } catch (error) {
          console.error("Failed to fetch blog", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchBlog();
    }
  }, [slug]);

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to like this article");
      return;
    }
    
    // Optimistic update
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
    
    try {
      const res = await api.post(`/blogs/${blog.id}/like`);
      // Update with actual count from server just in case
      if (res.data.likes_count !== undefined) {
        setLikesCount(res.data.likes_count);
      }
    } catch (err) {
      // Revert on error
      setIsLiked(isLiked);
      setLikesCount(likesCount);
      toast.error("Failed to like article");
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error("Please login to comment");
      return;
    }
    if (!commentText.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await api.post(`/blogs/${blog.id}/comments`, { content: commentText });
      toast.success("Comment added!");
      setCommentText("");
      setCommentsCount(prev => prev + 1);
      // Add the new comment to the list
      if (res.data.data) {
        setComments(prev => [res.data.data, ...prev]);
      }
    } catch (err) {
      toast.error("Failed to post comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="pt-32 pb-16 min-h-[70vh] flex justify-center items-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#1B2A6B]" />
        </div>
      </MainLayout>
    );
  }

  if (!blog) {
    return (
      <MainLayout>
        <div className="pt-32 pb-16 min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#0F172A] mb-6">Article Not Found</h1>
            <p className="text-[#64748B] max-w-2xl mx-auto mb-10 text-lg">We couldn't find the article you're looking for.</p>
            <Link href="/blog">
              <Button variant="primary" className="gap-2"><ArrowLeft size={16} /> Back to Blog</Button>
            </Link>
          </motion.div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <SEO 
        title={`${blog.meta_title || blog.title} | BlueBoxx`} 
        description={blog.meta_description || "Read this article on BlueBoxx."} 
        image={blog.og_image ? `${process.env.NEXT_PUBLIC_BACKEND_URL || 'https://backend.blueboxx.in'}/storage/${blog.og_image}` : (blog.thumbnail ? `${process.env.NEXT_PUBLIC_BACKEND_URL || 'https://backend.blueboxx.in'}/storage/${blog.thumbnail}` : '')}
      />
      
      {/* Hero Section */}
      <div className="pt-24 pb-12 bg-[#0d1635] text-white relative overflow-hidden border-b border-white/10">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 right-0 w-[50%] h-[100%] rounded-full bg-[#1B2A6B]/50 blur-[120px] pointer-events-none" 
        />
        <div className="container mx-auto px-4 max-w-4xl relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {blog.categories && blog.categories.map((c: any) => (
                <Badge key={c.id} variant="secondary" className="bg-white/10 hover:bg-white/20 text-white border-none">{c.name}</Badge>
              ))}
            </div>
            
            <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight max-w-3xl mx-auto">
              {blog.title}
            </h1>
            
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-semibold text-slate-300">
              <div className="flex items-center gap-2">
                <img src={blog.author?.avatar || `https://ui-avatars.com/api/?name=${blog.author?.name || 'A'}`} alt={blog.author?.name} className="w-8 h-8 rounded-full border border-white/20" />
                <span className="text-white">{blog.author?.name}</span>
              </div>
              <div className="flex items-center gap-2"><Calendar size={16}/> {blog.published_at}</div>
              <div className="flex items-center gap-2"><Clock size={16}/> {blog.reading_time || 5} min read</div>
              <div className="flex items-center gap-2"><MessageSquare size={16}/> {commentsCount}</div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="py-12 bg-slate-50 min-h-screen">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-[#1B2A6B] mb-8 transition-colors">
            <ArrowLeft size={16} /> Back to all articles
          </Link>

          {/* Thumbnail */}
          {blog.thumbnail && (
            <div className="mb-12 rounded-3xl overflow-hidden shadow-lg border border-slate-200">
              <img src={`${process.env.NEXT_PUBLIC_BACKEND_URL || 'https://backend.blueboxx.in'}/storage/${blog.thumbnail}`} alt={blog.title} className="w-full h-auto max-h-[500px] object-cover" />
            </div>
          )}

          {/* Content */}
          <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-100 prose prose-lg prose-slate max-w-none prose-headings:font-extrabold prose-headings:text-slate-900 prose-a:text-[#1B2A6B] hover:prose-a:text-[#C9A227] prose-img:rounded-xl">
            <div dangerouslySetInnerHTML={{ __html: blog.content }} />
          </div>

          {/* Tags & Actions */}
          <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex flex-wrap gap-2">
              {blog.tags && blog.tags.map((t: any) => (
                <span key={t.id} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-sm font-semibold">#{t.name}</span>
              ))}
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                onClick={handleLike}
                className={`gap-2 border-slate-200 transition-colors ${isLiked ? 'text-rose-500 border-rose-200 bg-rose-50' : 'text-slate-600 hover:text-rose-500 hover:bg-rose-50 hover:border-rose-200'}`}
              >
                <Heart size={18} fill={isLiked ? "currentColor" : "none"} /> 
                {likesCount > 0 ? likesCount : 'Like'}
              </Button>
              <Button variant="outline" className="gap-2 border-slate-200 text-slate-600 hover:text-[#1B2A6B]" onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast.success("Link copied!");
              }}>
                <Share2 size={18} /> Share
              </Button>
            </div>
          </div>

          {/* Comments Section */}
          <div className="mt-12 bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="text-2xl font-extrabold text-slate-900 mb-8 flex items-center gap-3">
              <MessageSquare className="text-[#1B2A6B]" /> Comments ({commentsCount})
            </h3>

            {/* Comment Form */}
            <div className="mb-10">
              {isAuthenticated ? (
                <form onSubmit={handleCommentSubmit} className="flex flex-col gap-4">
                  <textarea 
                    rows={4}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Share your thoughts..."
                    className="w-full p-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1B2A6B] resize-none"
                    required
                  />
                  <div className="flex justify-end">
                    <Button variant="primary" disabled={isSubmitting || !commentText.trim()}>
                      {isSubmitting ? <Loader2 size={18} className="animate-spin mr-2" /> : null}
                      Post Comment
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 text-center">
                  <p className="text-slate-600 mb-4 font-medium">Join the conversation and share your thoughts.</p>
                  <Link href="/login">
                    <Button variant="outline" className="border-slate-300">Login to Comment</Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Comments List */}
            <div className="space-y-6">
              {comments.length > 0 ? (
                comments.map((comment: any) => (
                  <div key={comment.id} className="flex gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors">
                    <div className="shrink-0">
                      <img 
                        src={`https://ui-avatars.com/api/?name=${comment.user?.first_name || 'U'}&background=random`} 
                        alt={comment.user?.first_name} 
                        className="w-10 h-10 rounded-full" 
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-baseline justify-between mb-1">
                        <h4 className="font-bold text-slate-900">
                          {comment.user?.first_name} {comment.user?.last_name}
                        </h4>
                        <span className="text-xs font-semibold text-slate-400">
                          {new Date(comment.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      <p className="text-slate-700 leading-relaxed text-sm whitespace-pre-wrap">{comment.content}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-500 font-medium">
                  No comments yet. Be the first to share your thoughts!
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </MainLayout>
  );
}
