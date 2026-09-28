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
    title: "Blueboxx DA | Leading IT Training & Digital Media Institute in Vadodara",
    description: "Blueboxx DA is Gujarat's premier IT institute offering practical courses in Full Stack Web Development, UI/UX Design, AI/ML, and Digital Marketing with 100% placement support.",
    keywords: "Blueboxx DA, IT training institute vadodara, web development classes vadodara, UI UX design course, digital marketing training vadodara, best computer institute",
  },
  "/services": {
    title: "Digital Solutions, Web Development & AI Automation Services | Blueboxx DA",
    description: "Explore Blueboxx DA enterprise services including custom web development, mobile applications, CRM/ERP platforms, LMS systems, and AI business automation solutions.",
    keywords: "web development company vadodara, custom CRM development, ERP solutions gujarat, AI automation services, LMS platform development, IT outsourcing india",
  },
  "/about": {
    title: "About Us | Blueboxx DA - Creative Production & EdTech Innovation",
    description: "Founded in 2015 in Vadodara, Blueboxx DA empowers students and enterprises through our Learn-Work-Earn model, industry mentorship, and cutting-edge digital production.",
    keywords: "About Blueboxx DA, IT institute history, creative production house vadodara, Ankush Dubey, Learn Work Earn model",
  },
  "/courses": {
    title: "Certified Professional IT & Design Courses | Blueboxx DA",
    description: "Master high-demand tech skills with industry-designed courses in Full Stack, MERN, Python AI, Graphic Design, and Performance Marketing at Blueboxx DA.",
    keywords: "certified IT courses, full stack developer course, MERN stack training vadodara, graphic design course, python AI machine learning",
  },
  "/internships": {
    title: "Industry Internships with Stipend & Live Projects | Blueboxx DA",
    description: "Gain hands-on corporate experience with paid internships at Blueboxx DA. Work on live enterprise client projects with 1-on-1 expert mentor guidance.",
    keywords: "IT internships vadodara, paid digital marketing internship, web development internship with stipend, live project training vadodara",
  },
  "/contact": {
    title: "Contact Blueboxx DA | Admissions & Enterprise Inquiries",
    description: "Get in touch with Blueboxx DA for course counseling, admissions, corporate training, or enterprise project development. Located at India Bulls Mega Mall, Vadodara.",
    keywords: "contact Blueboxx DA, IT institute address vadodara, admission helpline, corporate training inquiry, demo class booking",
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
      <title key="page-title">{activeTitle}</title>
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
      <meta key="robots" name="robots" content={activeRobots === "index, follow" ? "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" : activeRobots} />
      <meta key="googlebot" name="googlebot" content={activeRobots === "index, follow" ? "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" : activeRobots} />
      <meta key="bingbot" name="bingbot" content={activeRobots === "index, follow" ? "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" : activeRobots} />
      <meta key="google-extended" name="google-extended" content="index, follow" />
      
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
