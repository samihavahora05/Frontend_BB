import { useState, useEffect } from "react";
import { MainLayout } from "../src/layout/MainLayout";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight, Search } from "lucide-react";
import { Card, CardContent } from "../src/components/ui/Card";
import { Badge } from "../src/components/ui/Badge";
import { Button } from "../src/components/ui/Button";
import { Input } from "../src/components/ui/Input";
import { Pagination } from "../src/components/ui/Pagination";
import Link from "next/link";
import Image from "next/image";
import useSWR from "swr";
import api from "../src/lib/axios";
import toast from "react-hot-toast";

// Simple debounce hook for local use
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  
  // Fetch categories using SWR
  const categoryFetcher = (url: string) => api.get(url).then(res => res.data.data);
  const { data: categories = [], isLoading: categoriesLoading } = useSWR("/public/blog-categories", categoryFetcher, {
    revalidateOnFocus: false,
  });

  // Fetch blogs using SWR
  const params: any = {
    page: currentPage,
    per_page: 9,
  };
  if (debouncedSearchQuery) params.search = debouncedSearchQuery;
  if (activeCategory !== "All") {
    const cat = categories.find((c: any) => c.name === activeCategory);
    if (cat) params.category = cat.slug;
  }

  const blogFetcher = (url: string) => api.get(url, { params }).then(res => res.data);
  const { data: blogsData, isLoading: blogsLoading } = useSWR(
    categoriesLoading ? null : ['/public/blogs', currentPage, debouncedSearchQuery, activeCategory, categories.length], 
    ([url]) => blogFetcher(url), 
    {
      revalidateOnFocus: false,
      keepPreviousData: true,
    }
  );

  const isLoading = categoriesLoading || blogsLoading;

  const blogs = blogsData?.data || [];
  const totalPages = blogsData?.pagination?.last_page || 1;

  const featuredBlog = blogs.length > 0 && activeCategory === "All" && currentPage === 1 ? blogs[0] : null;
  const remainingBlogs = featuredBlog ? blogs.slice(1) : blogs;

  return (
    <MainLayout>
      {/* Hero Section */}
      <div className="pt-24 pb-12 bg-[#0d1635] text-white relative overflow-hidden border-b border-white/10">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 right-0 w-[50%] h-[100%] rounded-full bg-[#1B2A6B]/50 blur-[120px] pointer-events-none" 
        />
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="flex flex-col lg:flex-row justify-between items-end gap-8 mb-12">
            <div className="max-w-2xl">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight"
              >
                Insights & <span className="text-[#C9A227]">Resources</span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.1 }}
                className="text-slate-300 text-lg"
              >
                Expert advice, technical tutorials, and career guidance from industry leaders.
              </motion.p>
            </div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="w-full lg:w-80">
              <Input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<Search size={18}/>} 
                placeholder="Search articles..." 
                className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus-visible:ring-[#C9A227]" 
              />
            </motion.div>
          </div>

          {/* Categories */}
          <div className="flex overflow-x-auto pb-4 gap-2 scrollbar-hide">
            {["All", ...categories.map((c: any) => c.name)].map(cat => (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setCurrentPage(1); }}
                className={`px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                  activeCategory === cat 
                    ? "bg-[#1B2A6B] text-white shadow-md shadow-[#1B2A6B]/20" 
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-12 bg-transparent min-h-screen">
        <div className="container mx-auto px-4 max-w-7xl">
          
          {isLoading ? (
            <div className="space-y-12">
              <div className="animate-pulse bg-white rounded-2xl border border-slate-200 overflow-hidden h-[400px] flex flex-col lg:flex-row">
                <div className="w-full lg:w-1/2 h-full bg-slate-200"></div>
                <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center space-y-4">
                  <div className="h-6 bg-slate-200 rounded w-1/4"></div>
                  <div className="h-10 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-200 rounded w-full"></div>
                  <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                  <div className="flex gap-4 pt-4">
                    <div className="w-6 h-6 rounded-full bg-slate-200"></div>
                    <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="animate-pulse bg-white rounded-2xl border border-slate-200 overflow-hidden h-[350px]">
                    <div className="w-full h-44 bg-slate-200"></div>
                    <div className="p-6 space-y-4">
                      <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                      <div className="h-4 bg-slate-200 rounded w-full"></div>
                      <div className="pt-4 mt-6 border-t border-slate-100 flex justify-between">
                        <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                        <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* Featured Article */}
              {featuredBlog && (
                <div className="mb-16">
                  <h2 className="text-xl font-extrabold text-slate-900 mb-6">Featured Article</h2>
                  <Card className="overflow-hidden group hover:shadow-xl hover:border-[#1B2A6B]/30 transition-all duration-300">
                    <div className="flex flex-col lg:flex-row h-full">
                      <div className="w-full lg:w-1/2 aspect-[16/9] lg:aspect-auto relative overflow-hidden bg-slate-200">
                        <Image src={featuredBlog.thumbnail ? `${process.env.NEXT_PUBLIC_BACKEND_URL || 'https://backend.blueboxx.in'}/storage/${featuredBlog.thumbnail}` : "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80"} alt="Featured" fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="(max-width: 1024px) 100vw, 50vw" />
                      </div>
                      <CardContent className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
                        <Badge variant="secondary" className="w-fit mb-4">{featuredBlog.categories?.[0] || "Blog"}</Badge>
                        <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-4 group-hover:text-[#1B2A6B] transition-colors leading-tight">
                          {featuredBlog.title}
                        </h3>
                        <p className="text-slate-600 mb-6 leading-relaxed text-lg line-clamp-3">
                          {featuredBlog.excerpt}
                        </p>
                        <div className="flex items-center gap-6 text-sm font-semibold text-slate-500 mb-8">
                          <div className="flex items-center gap-2">
                            <img src={featuredBlog.author?.avatar || `https://ui-avatars.com/api/?name=${featuredBlog.author?.name || 'A'}`} alt={featuredBlog.author?.name} className="w-6 h-6 rounded-full" />
                            {featuredBlog.author?.name}
                          </div>
                          <div className="flex items-center gap-2"><Calendar size={16}/> {featuredBlog.published_at}</div>
                        </div>
                        <Link href={`/blog/${featuredBlog.slug}`}>
                          <Button variant="primary" className="w-fit gap-2">Read Full Article <ArrowRight size={16}/></Button>
                        </Link>
                      </CardContent>
                    </div>
                  </Card>
                </div>
              )}

              {/* Grid */}
              {remainingBlogs.length > 0 ? (
                <div className="mb-12">
                  <h2 className="text-xl font-extrabold text-slate-900 mb-6">Latest Articles</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {remainingBlogs.map((blog: any) => (
                    <Card key={blog.id} className="overflow-hidden group hover:shadow-lg hover:border-[#1B2A6B]/30 transition-all duration-300 flex flex-col">
                      <div className="relative aspect-[16/9] overflow-hidden bg-slate-200">
                        <Image src={blog.thumbnail ? `${process.env.NEXT_PUBLIC_BACKEND_URL || 'https://backend.blueboxx.in'}/storage/${blog.thumbnail}` : "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80"} alt={blog.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                        <Badge variant="secondary" className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm border-none text-slate-900 shadow-sm">{blog.categories?.[0] || "Blog"}</Badge>
                      </div>
                      <CardContent className="p-6 flex-1 flex flex-col">
                        <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-[#1B2A6B] transition-colors leading-tight line-clamp-2">
                          <Link href={`/blog/${blog.slug}`}>
                            {blog.title}
                          </Link>
                        </h3>
                        <p className="text-slate-600 mb-6 text-sm line-clamp-2 leading-relaxed">
                          {blog.excerpt}
                        </p>
                        <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500 mb-4">
                          <div className="flex items-center gap-2"><Calendar size={14}/> {blog.published_at}</div>
                          <div className="flex items-center gap-2"><Clock size={14}/> {blog.reading_time || 5} min read</div>
                        </div>
                        <Link href={`/blog/${blog.slug}`}>
                          <Button variant="primary" className="w-full gap-2 justify-center">Read Full Article <ArrowRight size={16}/></Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
              ) : (
                !featuredBlog && (
                  <div className="py-20 text-center bg-white rounded-2xl border border-slate-200 shadow-sm mb-12">
                    <Search size={48} className="mx-auto text-slate-300 mb-4" />
                    <h3 className="text-xl font-bold text-slate-800 mb-2">No articles found</h3>
                    <p className="text-slate-500">Try adjusting your search or category filter to find what you're looking for.</p>
                  </div>
                )
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mb-24">
                  <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                </div>
              )}
            </>
          )}

          {/* Newsletter CTA */}
          <div className="bg-[#0d1635] rounded-3xl p-10 md:p-16 text-center text-white relative overflow-hidden border border-white/10 shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#1B2A6B]/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl font-extrabold mb-4">Never miss an update.</h2>
              <p className="text-slate-300 mb-8">Subscribe to our newsletter for the latest tech news, interview tips, and exclusive course discounts directly in your inbox.</p>
              <form onSubmit={async (e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const email = (form.elements.namedItem('email') as HTMLInputElement).value;
                if(!email) return;
                try {
                  const res = await api.post('/public/newsletter/subscribe', { 
                    email: email,
                  });
                  if(res.data.success) toast.success("Subscribed successfully!");
                  form.reset();
                } catch (err: any) {
                  toast.error(err.response?.data?.message || "Subscription failed");
                }
              }} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <Input type="email" name="email" required placeholder="Enter your email address" className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus-visible:ring-[#C9A227] py-3" />
                <Button type="submit" variant="secondary" className="py-3">Subscribe</Button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </MainLayout>
  );
}
