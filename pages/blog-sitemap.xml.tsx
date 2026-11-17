import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.blueboxx.in';
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://backend.blueboxx.in/api';
  const now = new Date().toISOString();

  let blogUrls: string[] = [];

  // Always include main blog index
  blogUrls.push(`  <url>
    <loc>${baseUrl}/blog</loc>
    <lastmod>${now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`);

  try {
    const response = await fetch(`${apiUrl}/public/blogs?per_page=100`);
    if (response.ok) {
      const data = await response.json();
      const blogs = data?.data?.data || data?.data || [];

      if (Array.isArray(blogs)) {
        blogs.forEach((b: any) => {
          if (b.slug) {
            const lastmod = b.updated_at ? new Date(b.updated_at).toISOString() : now;
            blogUrls.push(`  <url>
    <loc>${baseUrl}/blog/${b.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`);
          }
        });
      }
    }
  } catch (error) {
    console.error('Error fetching blogs for sitemap:', error);
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${blogUrls.join('\n')}
</urlset>`;

  res.setHeader('Content-Type', 'text/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=1800');
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};

export default function BlogSitemap() {
  return null;
}
