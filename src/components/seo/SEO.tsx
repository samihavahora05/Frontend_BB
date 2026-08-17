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

export function SEO({
  title = "Blueboxx DA | Premium IT Training Institute & EdTech Platform",
  description = "Blueboxx DA offers premium training in Full Stack Development, AI/ML, Data Science, Graphic Design, and Digital Marketing with 100% placement assistance.",
  image = "https://blueboxx.in/og-image.jpg",
  type = "website",
  keywords = "Blueboxx DA, Blueboxx Vadodara, Best IT Training Institute in Vadodara",
  schema,
  useDynamic = false,
  robots
}: SEOProps) {
  const router = useRouter();
  const canonicalUrl = `https://blueboxx.in${router.asPath}`;
  const currentPath = router.asPath.split('?')[0];

  // Fetch dynamic overrides from Admin Dashboard if available
  const { data: dynamicSeo } = useSWR(
    useDynamic ? `/public/seo?path=${currentPath}` : null,
    (url) => api.get(url).then(res => res.data).catch(() => null),
    { revalidateOnFocus: false, dedupingInterval: 60000 }
  );

  const activeTitle = dynamicSeo?.title || title;
  const activeDesc = dynamicSeo?.description || description;
  const activeKeywords = dynamicSeo?.keywords || keywords;
  const activeImage = dynamicSeo?.og_image || image;
  const activeCanonical = dynamicSeo?.canonical_url || canonicalUrl;
  const activeRobots = robots || dynamicSeo?.robots || "index, follow";

  const defaultSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "Blueboxx DA",
    "url": "https://blueboxx.in",
    "logo": "https://blueboxx.in/logo.png"
  };

  let schemaData = schema ? (Array.isArray(schema) ? [defaultSchema, ...schema] : [defaultSchema, schema]) : [defaultSchema];
  if (dynamicSeo?.schema_json) {
    const dynamicSchema = Array.isArray(dynamicSeo.schema_json) ? dynamicSeo.schema_json : [dynamicSeo.schema_json];
    schemaData = [...schemaData, ...dynamicSchema];
  }

  return (
    <Head>
      <title>{activeTitle}</title>
      <meta key="title" name="title" content={activeTitle} />
      <meta key="description" name="description" content={activeDesc} />
      <meta key="keywords" name="keywords" content={activeKeywords} />
      <link key="canonical" rel="canonical" href={activeCanonical} />
      
      <meta key="og:type" property="og:type" content={type} />
      <meta key="og:url" property="og:url" content={activeCanonical} />
      <meta key="og:title" property="og:title" content={activeTitle} />
      <meta key="og:description" property="og:description" content={activeDesc} />
      <meta key="og:image" property="og:image" content={activeImage} />
      <meta key="og:site_name" property="og:site_name" content="Blueboxx DA" />

      <meta key="twitter:card" property="twitter:card" content="summary_large_image" />
      <meta key="twitter:url" property="twitter:url" content={activeCanonical} />
      <meta key="twitter:title" property="twitter:title" content={activeTitle} />
      <meta key="twitter:description" property="twitter:description" content={activeDesc} />
      <meta key="twitter:image" property="twitter:image" content={activeImage} />

      <meta key="theme-color" name="theme-color" content="#1B2A6B" />
      <meta key="robots" name="robots" content={activeRobots} />
      <meta key="googlebot" name="googlebot" content={activeRobots} />
      
      <link rel="icon" href="/favicon.ico" />
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
    </Head>
  );
}
