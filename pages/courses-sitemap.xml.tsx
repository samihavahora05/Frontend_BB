import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.blueboxx.in';
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://backend.blueboxx.in/api';
  const now = new Date().toISOString();

  let courseUrls: string[] = [];

  // Always include main courses listing
  courseUrls.push(`  <url>
    <loc>${baseUrl}/courses</loc>
    <lastmod>${now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`);

  try {
    const response = await fetch(`${apiUrl}/public/courses?per_page=100`, {
      headers: { 'Accept': 'application/json' },
    });
    if (response.ok) {
      const data = await response.json();
      const courses = data?.data?.data || data?.data || [];

      if (Array.isArray(courses)) {
        courses.forEach((c: any) => {
          const pathParam = c.slug || c.id;
          if (pathParam) {
            const lastmod = c.updated_at ? new Date(c.updated_at).toISOString() : now;
            courseUrls.push(`  <url>
    <loc>${baseUrl}/courses/${pathParam}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`);
          }
        });
      }
    }
  } catch (error) {
    console.error('Error fetching courses for sitemap:', error);
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${courseUrls.join('\n')}
</urlset>`;

  res.setHeader('Content-Type', 'text/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=1800');
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};

export default function CoursesSitemap() {
  return null;
}
