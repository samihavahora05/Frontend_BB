import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { ArrowLeft, Save, Loader2, CheckCircle2, Layout, Type, Image as ImageIcon, Plus, Settings2, Trash2, Eye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SEO } from "../../../../src/components/seo/SEO";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Italic, List, ListOrdered, Heading1, Heading2, Strikethrough } from 'lucide-react';

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-1 p-2 bg-slate-100 border border-slate-200 rounded-t-lg">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={`p-1.5 rounded ${editor.isActive('bold') ? 'bg-slate-300 text-slate-800' : 'text-slate-600 hover:bg-slate-200'}`}
      >
        <Bold size={14} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={`p-1.5 rounded ${editor.isActive('italic') ? 'bg-slate-300 text-slate-800' : 'text-slate-600 hover:bg-slate-200'}`}
      >
        <Italic size={14} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={`p-1.5 rounded ${editor.isActive('strike') ? 'bg-slate-300 text-slate-800' : 'text-slate-600 hover:bg-slate-200'}`}
      >
        <Strikethrough size={14} />
      </button>
      <div className="w-px h-6 bg-slate-300 mx-1"></div>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`p-1.5 rounded ${editor.isActive('heading', { level: 1 }) ? 'bg-slate-300 text-slate-800' : 'text-slate-600 hover:bg-slate-200'}`}
      >
        <Heading1 size={14} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-1.5 rounded ${editor.isActive('heading', { level: 2 }) ? 'bg-slate-300 text-slate-800' : 'text-slate-600 hover:bg-slate-200'}`}
      >
        <Heading2 size={14} />
      </button>
      <div className="w-px h-6 bg-slate-300 mx-1"></div>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-1.5 rounded ${editor.isActive('bulletList') ? 'bg-slate-300 text-slate-800' : 'text-slate-600 hover:bg-slate-200'}`}
      >
        <List size={14} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-1.5 rounded ${editor.isActive('orderedList') ? 'bg-slate-300 text-slate-800' : 'text-slate-600 hover:bg-slate-200'}`}
      >
        <ListOrdered size={14} />
      </button>
    </div>
  );
};

const MOCK_PAGES_DB: Record<string, any> = {
  home: {
    title: 'Homepage',
    hero: {
      heading: "Unlock Your Core Potential",
      subheading: "Join thousands of students and companies bridging the gap between education and global hiring standards.",
      ctaText: "Explore Cohorts",
      backgroundImage: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop"
    },
    features: [
      { id: 1, title: "Industry Led Curriculum", description: "Learn directly from professionals." },
      { id: 2, title: "Guaranteed Placements", description: "We help you land your dream job." }
    ],
    contentHtml: `
      <h2>Welcome to BlueBoxx</h2>
      <p>This is the homepage content. It's designed to convert visitors into students.</p>
    `,
    seoTitle: 'Homepage | BlueBoxx',
    seoDescription: "Join thousands of students and companies bridging the gap between education and global hiring standards."
  },
  about: {
    title: 'About Us',
    hero: {
      heading: "Our Mission & Vision",
      subheading: "Discover the story behind BlueBoxx and our commitment to quality education.",
      ctaText: "Join Our Team",
      backgroundImage: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=800&auto=format&fit=crop"
    },
    features: [
      { id: 1, title: "Founded in 2020", description: "Started with a vision to revolutionize learning." },
      { id: 2, title: "Global Reach", description: "Students from over 50 countries." }
    ],
    contentHtml: `
      <h2>Our Story</h2>
      <p>We started BlueBoxx to make premium IT training accessible to everyone.</p>
    `,
    seoTitle: 'About Us | BlueBoxx',
    seoDescription: "Discover the story behind BlueBoxx and our commitment to quality education."
  },
  courses: {
    title: 'Courses Hub',
    hero: {
      heading: "Explore Premium Courses",
      subheading: "Master AI, Web Development, and Design with our expert-led cohorts.",
      ctaText: "View All Courses",
      backgroundImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop"
    },
    features: [
      { id: 1, title: "Live Classes", description: "Interact with mentors in real-time." },
      { id: 2, title: "Hands-on Projects", description: "Build real-world applications." }
    ],
    contentHtml: `
      <h2>Featured Categories</h2>
      <ul>
        <li>Artificial Intelligence & Machine Learning</li>
        <li>Full Stack Web Development</li>
        <li>UI/UX Design</li>
      </ul>
    `,
    seoTitle: 'Courses Hub | BlueBoxx',
    seoDescription: "Master AI, Web Development, and Design with our expert-led cohorts."
  },
  jobs: {
    title: 'Job Portal',
    hero: {
      heading: "Find Your Dream Job",
      subheading: "Connect with top tech companies hiring BlueBoxx graduates.",
      ctaText: "Browse Jobs",
      backgroundImage: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=800&auto=format&fit=crop"
    },
    features: [
      { id: 1, title: "Top Recruiters", description: "Hiring partners from Fortune 500." },
      { id: 2, title: "Resume Building", description: "Get your resume reviewed by experts." }
    ],
    contentHtml: `
      <h2>Recent Openings</h2>
      <p>Check out the latest job postings from our partners.</p>
    `,
    seoTitle: 'Job Portal | BlueBoxx',
    seoDescription: "Connect with top tech companies hiring BlueBoxx graduates."
  },
  contact: {
    title: 'Contact Us',
    hero: {
      heading: "Get in Touch",
      subheading: "We're here to help. Reach out to our support team anytime.",
      ctaText: "Send Message",
      backgroundImage: "https://images.unsplash.com/photo-1534536281715-e28d76689b4d?q=80&w=800&auto=format&fit=crop"
    },
    features: [
      { id: 1, title: "24/7 Support", description: "Always here when you need us." },
      { id: 2, title: "Global Offices", description: "Visit us in Vadodara, India." }
    ],
    contentHtml: `
      <h2>Contact Information</h2>
      <p>Email: support@blueboxx.in</p>
      <p>Phone: +91 12345 67890</p>
    `,
    seoTitle: 'Contact Us | BlueBoxx',
    seoDescription: "We're here to help. Reach out to our support team anytime."
  },
  privacy: {
    title: 'Privacy Policy',
    hero: {
      heading: "Privacy & Data Policy",
      subheading: "How we protect your data and privacy at BlueBoxx.",
      ctaText: "Read Terms",
      backgroundImage: "https://images.unsplash.com/photo-1550565118-3a14e8d0386f?q=80&w=800&auto=format&fit=crop"
    },
    features: [
      { id: 1, title: "Secure Data", description: "Your data is encrypted and safe." },
      { id: 2, title: "No Spam", description: "We respect your inbox." }
    ],
    contentHtml: `
      <h2>Privacy Policy Highlights</h2>
      <p>We do not share your personal data with third parties without your consent.</p>
    `,
    seoTitle: 'Privacy Policy | BlueBoxx',
    seoDescription: "How we protect your data and privacy at BlueBoxx."
  },
  'tpl-1': {
    title: 'Standard Landing Page (Template)',
    hero: {
      heading: "[Template] Landing Page Hero",
      subheading: "A highly converting subtitle goes here.",
      ctaText: "Call to Action",
      backgroundImage: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop"
    },
    features: [
      { id: 1, title: "Feature One", description: "Highlight a key benefit." },
      { id: 2, title: "Feature Two", description: "Highlight another key benefit." }
    ],
    contentHtml: `
      <h2>Main Value Proposition</h2>
      <p>Detailed explanation of your product or service.</p>
    `,
    seoTitle: 'Standard Landing Page | Template',
    seoDescription: "Template for a standard landing page."
  },
  'tpl-2': {
    title: 'Blog Post Layout (Template)',
    hero: {
      heading: "[Template] Blog Post Title",
      subheading: "By Author Name • 5 min read",
      ctaText: "Subscribe",
      backgroundImage: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=800&auto=format&fit=crop"
    },
    features: [
      { id: 1, title: "Key Takeaway 1", description: "Summarize the first point." },
      { id: 2, title: "Key Takeaway 2", description: "Summarize the second point." }
    ],
    contentHtml: `
      <h2>Introduction</h2>
      <p>Begin your blog post here.</p>
      <h2>Main Content</h2>
      <p>Add paragraphs and images.</p>
    `,
    seoTitle: 'Blog Post Layout | Template',
    seoDescription: "Template for a blog post layout."
  },
  'tpl-3': {
    title: 'Contact Form Page (Template)',
    hero: {
      heading: "[Template] Let's Talk",
      subheading: "Fill out the form below to reach us.",
      ctaText: "Scroll to Form",
      backgroundImage: "https://images.unsplash.com/photo-1528747045269-390fe33c19f2?q=80&w=800&auto=format&fit=crop"
    },
    features: [
      { id: 1, title: "Fast Response", description: "We reply within 24 hours." },
      { id: 2, title: "Expert Support", description: "Talk to domain experts." }
    ],
    contentHtml: `
      <h2>Contact Form Placement</h2>
      <p>[Contact form component will be injected here]</p>
    `,
    seoTitle: 'Contact Form Page | Template',
    seoDescription: "Template for a contact form page."
  },
};

const DEFAULT_PAGE = {
  title: 'Custom Page',
  hero: {
    heading: "New Custom Page",
    subheading: "Add your subtitle here.",
    ctaText: "Action Button",
    backgroundImage: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop"
  },
  features: [
    { id: 1, title: "Feature One", description: "Describe the feature." }
  ],
  contentHtml: `<h2>Start building your page</h2>`,
  seoTitle: 'Custom Page | BlueBoxx',
  seoDescription: "Description of the new custom page."
};

export default function AdminPageEditor() {
  const router = useRouter();
  const { page } = router.query;
  const pageId = typeof page === 'string' ? page : 'home';

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState("content");

  // Load from DB or use Default
  const [pageData, setPageData] = useState(() => MOCK_PAGES_DB[pageId] || DEFAULT_PAGE);
  const [editorKey, setEditorKey] = useState(0);

  // Sync state when pageId changes
  useEffect(() => {
    if (pageId) {
      setPageData(MOCK_PAGES_DB[pageId] || {
        ...DEFAULT_PAGE,
        title: pageId.replace(/-/g, ' '),
        seoTitle: pageId.replace(/-/g, ' ') + ' | BlueBoxx'
      });
      setEditorKey(prev => prev + 1); // Force editor remount with new content
    }
  }, [pageId]);

  const editor = useEditor({
    key: editorKey,
    extensions: [StarterKit],
    content: pageData.contentHtml,
    onUpdate: ({ editor }) => {
      setPageData(prev => ({ ...prev, contentHtml: editor.getHTML() }));
    },
  });

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1500);
  };

  const updateHero = (field: string, value: string) => {
    setPageData(prev => ({
      ...prev,
      hero: { ...prev.hero, [field]: value }
    }));
  };

  const addFeature = () => {
    setPageData(prev => ({
      ...prev,
      features: [...prev.features, { id: Date.now(), title: "New Feature", description: "Feature description" }]
    }));
  };

  const removeFeature = (id: number) => {
    setPageData(prev => ({
      ...prev,
      features: prev.features.filter(f => f.id !== id)
    }));
  };

  const updateFeature = (id: number, field: string, value: string) => {
    setPageData(prev => ({
      ...prev,
      features: prev.features.map(f => f.id === id ? { ...f, [field]: value } : f)
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <SEO title={`Editing: ${pageData.title} | Admin CMS`} />
      {/* Top Navbar */}
      <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-30 flex items-center justify-between px-4 shadow-sm shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push('/admin/cms')} className="p-2 text-slate-400 hover:text-slate-800 bg-slate-50 rounded-lg transition-colors">
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded">Editor</span>
              <h1 className="text-sm font-black text-slate-800">{pageData.title}</h1>
            </div>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">/{pageId === 'home' ? '' : pageId}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex bg-slate-100 p-1 rounded-lg">
            <button className="px-3 py-1.5 text-xs font-bold bg-white shadow-sm rounded-md text-slate-700">Desktop</button>
            <button className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-700">Mobile</button>
          </div>
          
          <button className="px-4 py-2 rounded-xl text-sm font-bold border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2">
            <Eye size={16} /> Preview
          </button>
          
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className={`px-5 py-2 rounded-xl text-sm font-bold shadow-md transition-all flex items-center gap-2 ${
              saveSuccess ? 'bg-emerald-500 text-white hover:bg-emerald-600' : 'bg-[#1B2A6B] text-white hover:bg-[#0d1635]'
            }`}
          >
            {isSaving ? <Loader2 size={16} className="animate-spin" /> : 
             saveSuccess ? <CheckCircle2 size={16} /> : 
             <Save size={16} />}
            {isSaving ? 'Saving...' : saveSuccess ? 'Saved!' : 'Publish'}
          </button>
        </div>
      </header>

      {/* Editor Main Area */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar - Controls */}
        <div className="w-80 bg-white border-r border-slate-200 flex flex-col shrink-0 overflow-y-auto custom-scrollbar">
          
          {/* Tabs */}
          <div className="flex border-b border-slate-100 shrink-0">
            {[
              { id: 'content', icon: Layout, label: 'Content' },
              { id: 'settings', icon: Settings2, label: 'Settings' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold border-b-2 transition-all ${
                  activeTab === tab.id ? 'border-[#C9A227] text-[#1B2A6B]' : 'border-transparent text-slate-400 hover:text-slate-600 bg-slate-50'
                }`}
              >
                <tab.icon size={14} /> {tab.label}
              </button>
            ))}
          </div>

          <div className="p-4 space-y-6">
            {activeTab === 'content' && (
              <>
                {/* Section 1: Hero */}
                <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
                  <div className="px-4 py-3 bg-slate-100 border-b border-slate-200 flex items-center justify-between cursor-pointer">
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                      <Layout size={14} className="text-[#1B2A6B]" /> Hero Section
                    </h3>
                  </div>
                  <div className="p-4 space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Heading</label>
                      <input 
                        type="text" 
                        value={pageData.hero.heading}
                        onChange={(e) => updateHero('heading', e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-800 focus:border-[#1B2A6B] focus:ring-1 focus:ring-[#1B2A6B] outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Subheading</label>
                      <textarea 
                        rows={3}
                        value={pageData.hero.subheading}
                        onChange={(e) => updateHero('subheading', e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-800 focus:border-[#1B2A6B] focus:ring-1 focus:ring-[#1B2A6B] outline-none resize-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Button Text</label>
                      <input 
                        type="text" 
                        value={pageData.hero.ctaText}
                        onChange={(e) => updateHero('ctaText', e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-800 focus:border-[#1B2A6B] focus:ring-1 focus:ring-[#1B2A6B] outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Background Image</label>
                      <div className="relative group cursor-pointer" onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = 'image/*';
                        input.onchange = (e: any) => {
                          if (e.target.files && e.target.files[0]) {
                            const url = URL.createObjectURL(e.target.files[0]);
                            updateHero('backgroundImage', url);
                          }
                        };
                        input.click();
                      }}>
                        <div className="aspect-[2/1] bg-slate-200 rounded-lg overflow-hidden border border-slate-300 relative">
                          <img src={pageData.hero.backgroundImage} alt="Hero BG" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-white text-xs font-bold flex items-center gap-2"><ImageIcon size={14} /> Change Image</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 2: Features List */}
                <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
                  <div className="px-4 py-3 bg-slate-100 border-b border-slate-200 flex items-center justify-between cursor-pointer">
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                      <Type size={14} className="text-[#1B2A6B]" /> Features List
                    </h3>
                  </div>
                  <div className="p-4 space-y-3">
                    {pageData.features.map((feature, idx) => (
                      <div key={feature.id} className="p-3 bg-white border border-slate-200 rounded-lg relative group">
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => removeFeature(feature.id)} className="text-rose-500 hover:bg-rose-50 p-1 rounded"><Trash2 size={12} /></button>
                        </div>
                        <p className="text-xs font-bold text-slate-800 mb-1">Item {idx + 1}</p>
                        <input 
                          type="text" 
                          value={feature.title} 
                          onChange={(e) => updateFeature(feature.id, 'title', e.target.value)}
                          className="w-full text-sm font-semibold outline-none border-b border-transparent focus:border-slate-300 mb-1" 
                        />
                        <textarea 
                          value={feature.description}
                          onChange={(e) => updateFeature(feature.id, 'description', e.target.value)}
                          className="w-full text-[10px] text-slate-500 outline-none resize-none"
                          rows={2}
                        />
                      </div>
                    ))}
                    <button onClick={addFeature} className="w-full py-2 border-2 border-dashed border-slate-300 rounded-lg text-xs font-bold text-slate-500 hover:bg-slate-100 hover:border-slate-400 transition-colors flex items-center justify-center gap-2">
                      <Plus size={14} /> Add Feature
                    </button>
                  </div>
                </div>

                {/* Section 3: Rich Text Editor */}
                <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
                  <div className="px-4 py-3 bg-slate-100 border-b border-slate-200 flex items-center justify-between cursor-pointer">
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                      <Type size={14} className="text-[#1B2A6B]" /> Page Content
                    </h3>
                  </div>
                  <div className="p-4">
                    <MenuBar editor={editor} />
                    <div className="bg-white border border-t-0 border-slate-200 rounded-b-lg p-3 min-h-[150px] prose prose-sm prose-slate max-w-none focus:outline-none tiptap-editor">
                      <EditorContent editor={editor} />
                    </div>
                  </div>
                </div>

                {/* Add New Section Button */}
                <button className="w-full py-3 bg-[#1B2A6B]/5 text-[#1B2A6B] rounded-xl text-sm font-black border border-[#1B2A6B]/20 hover:bg-[#1B2A6B]/10 transition-colors flex items-center justify-center gap-2">
                  <Plus size={16} /> Add New Block
                </button>
              </>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Page Name (Internal)</label>
                  <input type="text" value={pageData.title} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold outline-none" readOnly />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">URL Slug</label>
                  <div className="flex items-center">
                    <span className="px-3 py-2 bg-slate-100 border border-r-0 border-slate-200 rounded-l-lg text-sm text-slate-500 font-mono">/</span>
                    <input type="text" value={pageId === 'home' ? '' : pageId} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-r-lg text-sm font-semibold outline-none" readOnly />
                  </div>
                </div>
                <div className="space-y-1.5 mt-6">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">SEO Title</label>
                  <input 
                    type="text" 
                    value={pageData.seoTitle} 
                    onChange={(e) => setPageData(prev => ({ ...prev, seoTitle: e.target.value }))}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold outline-none" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">SEO Description</label>
                  <textarea 
                    rows={3} 
                    value={pageData.seoDescription}
                    onChange={(e) => setPageData(prev => ({ ...prev, seoDescription: e.target.value }))}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold outline-none resize-none" 
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Area - Live Preview Canvas */}
        <div className="flex-1 bg-slate-300/30 overflow-y-auto p-4 md:p-8 flex items-start justify-center custom-scrollbar">
          {/* Mock Browser/Device Canvas */}
          <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden min-h-[800px] flex flex-col">
            {/* Mock Browser Bar */}
            <div className="h-8 bg-slate-100 border-b border-slate-200 flex items-center px-4 gap-2">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-400"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
              </div>
              <div className="ml-4 flex-1 flex justify-center">
                <div className="bg-white text-[10px] text-slate-400 font-mono px-4 py-0.5 rounded-full border border-slate-200 shadow-sm">
                  blueboxx.in/{pageId === 'home' ? '' : pageId}
                </div>
              </div>
            </div>

            {/* Live Render Area */}
            <div className="flex-1 bg-white relative">
              
              {/* HERO RENDER */}
              <div className="relative h-[500px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[#0d1635]">
                  <img src={pageData.hero.backgroundImage} alt="BG" className="w-full h-full object-cover opacity-30 mix-blend-overlay" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d1635] via-transparent to-transparent"></div>
                </div>
                
                <div className="relative z-10 text-center px-4 max-w-3xl">
                  <span className="inline-block px-3 py-1 bg-white border border-white/20 rounded-full text-[10px] font-bold text-white uppercase tracking-widest mb-6 backdrop-blur-md">
                    {pageData.title}
                  </span>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight mb-6 drop-shadow-lg">
                    {pageData.hero.heading}
                  </h1>
                  <p className="text-lg text-slate-300 font-medium mb-10 max-w-2xl mx-auto drop-shadow">
                    {pageData.hero.subheading}
                  </p>
                  <button className="px-8 py-4 bg-[#C9A227] text-[#0d1635] rounded-xl font-black text-lg hover:bg-white transition-colors shadow-xl shadow-[#C9A227]/20">
                    {pageData.hero.ctaText}
                  </button>
                </div>
              </div>

              {/* FEATURES RENDER */}
              <div className="py-20 px-8 bg-white max-w-5xl mx-auto">
                <div className="text-center mb-16">
                  <h2 className="text-3xl font-black text-slate-800">Why choose us</h2>
                  <div className="w-20 h-1 bg-[#C9A227] mx-auto mt-4 rounded-full"></div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                  {pageData.features.map(feature => (
                    <div key={feature.id} className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-shadow">
                      <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                        <CheckCircle2 size={24} />
                      </div>
                      <h3 className="text-xl font-black text-slate-800 mb-3">{feature.title}</h3>
                      <p className="text-slate-500 font-medium">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* RICH TEXT CONTENT RENDER */}
              <div className="py-20 px-8 bg-slate-50 max-w-5xl mx-auto">
                <div className="prose prose-slate max-w-3xl mx-auto" dangerouslySetInnerHTML={{ __html: pageData.contentHtml }} />
              </div>

            </div>
          </div>
        </div>

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb { background: #94a3b8; }
      `}} />
    </div>
  );
}
