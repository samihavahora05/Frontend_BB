import Head from "next/head";
import { useRouter } from "next/router";
import useSWR from "swr";
import api from "../../lib/axios";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  type?: string;
  keywords?: string;
  schema?: Record<string, any> | Record<string, any>[];
  useDynamic?: boolean;
  robots?: string;
}

// Master Page SEO Configuration Dictionary
const DEFAULT_PAGE_SEO: Record<string, { title: string; description: string; keywords: string }> = {
  "/": {
    title: "BlueBoxx | Leading Digital Marketing & IT Training Institute in Vadodara",
    description: "BlueBoxx is a leading digital marketing institute in Vadodara offering UI/UX, web development & marketing courses with practical training and career support.",
    keywords: "digital marketing institute vadodara, BlueBoxx DA, UI/UX design vadodara, web development vadodara, IT training institute vadodara, best computer classes vadodara",
  },
  "/courses": {
    title: "Online Digital Marketing, Web & Graphic Courses in Vadodara | BlueBoxx",
    description: "Explore online courses in Vadodara including digital marketing, web development & graphic design with practical learning and certification at BlueBoxx.",
    keywords: "online courses vadodara, digital marketing course vadodara, web development course vadodara, graphic design course vadodara, certified IT courses",
  },
  "/classes": {
    title: "Live Interactive Classes in Vadodara | Web & Marketing | BlueBoxx",
    description: "Join live classes in Vadodara for web development, graphic design & marketing with hands-on training and expert mentors at BlueBoxx.",
    keywords: "live classes vadodara, live web development classes, graphic design live training, interactive digital marketing classes vadodara, live coding sessions",
  },
  "/virtual-classes": {
    title: "Live Interactive Classes in Vadodara | Web & Marketing | BlueBoxx",
    description: "Join live classes in Vadodara for web development, graphic design & marketing with hands-on training and expert mentors at BlueBoxx.",
    keywords: "live classes vadodara, live web development classes, graphic design live training, interactive digital marketing classes vadodara, live coding sessions",
  },
  "/services": {
    title: "Career Training Services & Skill Acceleration in Vadodara | BlueBoxx",
    description: "BlueBoxx offers career training services in Vadodara including internships, mentorship, live sessions and skill-based learning for real-world success.",
    keywords: "career training services vadodara, professional IT mentorship, internship training, corporate digital training vadodara, job placement support",
  },
  "/community": {
    title: "Skill Development Platform & Tech Learners Network in India | BlueBoxx",
    description: "Join a leading skill development platform in India with hands-on projects, expert mentorship and career-focused training programs at BlueBoxx.",
    keywords: "skill development platform india, student community vadodara, IT learners platform, career growth tech community, peer learning india",
  },
  "/our-learners": {
    title: "Skill Development Platform & Tech Learners Network in India | BlueBoxx",
    description: "Join a leading skill development platform in India with hands-on projects, expert mentorship and career-focused training programs at BlueBoxx.",
    keywords: "skill development platform india, student community vadodara, IT learners platform, career growth tech community, peer learning india",
  },
  "/about": {
    title: "About BlueBoxx | Digital Training Institute in India",
    description: "BlueBoxx is a digital training institute in India offering skill-based education, mentorship and a learn-work-earn model for career growth.",
    keywords: "digital training institute india, learn work earn model, tech education vadodara, IT career mentorship india, practical skills academy",
  },
  "/internships": {
    title: "Digital Marketing & Tech Internships in Vadodara with Stipend | BlueBoxx",
    description: "Apply for digital marketing internship in Vadodara with live projects, real campaigns, mentorship and stipend opportunities at BlueBoxx.",
    keywords: "digital marketing internship vadodara, web development internship, IT student internship vadodara, paid tech internship with stipend, live project training",
  },
  "/internship": {
    title: "Digital Marketing & Tech Internships in Vadodara with Stipend | BlueBoxx",
    description: "Apply for digital marketing internship in Vadodara with live projects, real campaigns, mentorship and stipend opportunities at BlueBoxx.",
    keywords: "digital marketing internship vadodara, web development internship, IT student internship vadodara, paid tech internship with stipend, live project training",
  },
  "/contact": {
    title: "Contact BlueBoxx | Digital Marketing Institute in Vadodara",
    description: "Contact BlueBoxx Vadodara for course details, fees, demo classes and career guidance. Call or visit our institute today.",
    keywords: "contact digital marketing institute vadodara, IT training center address vadodara, book demo class vadodara, BlueBoxx phone number, career counselling center",
  },
  "/colleges": {
    title: "Career Counselling & Top Degree Programs in Vadodara | BlueBoxx",
    description: "Get career counselling in Vadodara and apply for top degree programs with expert guidance and academic support at BlueBoxx.",
    keywords: "career counselling vadodara, college admission guidance, higher education degrees vadodara, academic career support, college counselling",
  },
  "/signup": {
    title: "Join Industry-Demand Digital Courses in India | BlueBoxx",
    description: "Join BlueBoxx and start learning industry-demand digital courses with expert guidance, practical training and career growth opportunities.",
    keywords: "join digital courses india, enroll in IT training, student registration BlueBoxx, start digital marketing course, learn tech skills online",
  },
  "/join-us": {
    title: "Join Industry-Demand Digital Courses in India | BlueBoxx",
    description: "Join BlueBoxx and start learning industry-demand digital courses with expert guidance, practical training and career growth opportunities.",
    keywords: "join digital courses india, enroll in IT training, student registration BlueBoxx, start digital marketing course, learn tech skills online",
  },
};

function generateFallbackTitle(path: string) {
  if (!path || path === "/") return "BlueBoxx | Leading Digital Marketing & IT Training Institute in Vadodara";
  const segments = path.split("?")[0].split("/").filter(Boolean);
  const lastSegment = segments[segments.length - 1];
  if (!lastSegment) return "BlueBoxx | Leading Digital Marketing & IT Training Institute in Vadodara";
  
  const formatted = lastSegment
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
    
  return `${formatted} | BlueBoxx`;
}

export function SEO({
  title,
  description,
  image = "https://blueboxx.in/og-image.jpg",
  type = "website",
  keywords,
  schema,
  useDynamic = false,
  robots
}: SEOProps) {
  const router = useRouter();
  const canonicalUrl = `https://blueboxx.in${router.asPath}`;
  const currentPath = router.asPath.split('?')[0];

  // Lookup Path Specific Default SEO
  const pathConfig = DEFAULT_PAGE_SEO[currentPath] || {
    title: generateFallbackTitle(currentPath),
    description: "BlueBoxx offers premium training in Full Stack Development, AI/ML, Data Science, Graphic Design, and Digital Marketing with 100% placement assistance.",
    keywords: "BlueBoxx, IT training institute vadodara, digital marketing vadodara",
  };

  // Fetch dynamic overrides from Admin Dashboard if enabled
  const { data: dynamicSeo } = useSWR(
    useDynamic ? `/public/seo?path=${currentPath}` : null,
    (url) => api.get(url).then(res => res.data).catch(() => null),
    { revalidateOnFocus: false, dedupingInterval: 60000 }
  );

  const activeTitle = dynamicSeo?.title || title || pathConfig.title;
  const activeDesc = dynamicSeo?.description || description || pathConfig.description;
  const activeKeywords = dynamicSeo?.keywords || keywords || pathConfig.keywords;
  const activeImage = dynamicSeo?.og_image || image;
  const activeCanonical = dynamicSeo?.canonical_url || canonicalUrl;
  const activeRobots = robots || dynamicSeo?.robots || "index, follow";

  const defaultSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "BlueBoxx",
    "alternateName": "Blueboxx DA",
    "url": "https://blueboxx.in",
    "logo": "https://blueboxx.in/logo.png",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Vadodara",
      "addressRegion": "Gujarat",
      "addressCountry": "IN"
    },
    "sameAs": [
      "https://www.instagram.com/blueboxx.in",
      "https://www.linkedin.com/company/blueboxx"
    ]
  };

  let schemaData = schema ? (Array.isArray(schema) ? [defaultSchema, ...schema] : [defaultSchema, schema]) : [defaultSchema];
  if (dynamicSeo?.schema_json) {
    const dynamicSchema = Array.isArray(dynamicSeo.schema_json) ? dynamicSeo.schema_json : [dynamicSeo.schema_json];
    schemaData = [...schemaData, ...dynamicSchema];
  }

  return (
    <Head>
      {/* Standard Meta Tags */}
      <title>{activeTitle}</title>
      <meta key="title" name="title" content={activeTitle} />
      <meta key="description" name="description" content={activeDesc} />
      <meta key="keywords" name="keywords" content={activeKeywords} />
      <link key="canonical" rel="canonical" href={activeCanonical} />
      
      {/* Open Graph / Facebook */}
      <meta key="og:type" property="og:type" content={type} />
      <meta key="og:url" property="og:url" content={activeCanonical} />
      <meta key="og:title" property="og:title" content={activeTitle} />
      <meta key="og:description" property="og:description" content={activeDesc} />
      <meta key="og:image" property="og:image" content={activeImage} />
      <meta key="og:site_name" property="og:site_name" content="BlueBoxx" />

      {/* Twitter */}
      <meta key="twitter:card" property="twitter:card" content="summary_large_image" />
      <meta key="twitter:url" property="twitter:url" content={activeCanonical} />
      <meta key="twitter:title" property="twitter:title" content={activeTitle} />
      <meta key="twitter:description" property="twitter:description" content={activeDesc} />
      <meta key="twitter:image" property="twitter:image" content={activeImage} />

      {/* Search Engine Robots & Googlebot */}
      <meta key="theme-color" name="theme-color" content="#1B2A6B" />
      <meta key="robots" name="robots" content={activeRobots} />
      <meta key="googlebot" name="googlebot" content={activeRobots} />
      
      {/* Favicons */}
      <link rel="icon" href="/Boxxlogo.png" type="image/png" />
      <link rel="shortcut icon" href="/Boxxlogo.png" type="image/png" />
      <link rel="apple-touch-icon" href="/Boxxlogo.png" />
      
      {/* Structured JSON-LD Data for Google Search Rich Snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
    </Head>
  );
}
