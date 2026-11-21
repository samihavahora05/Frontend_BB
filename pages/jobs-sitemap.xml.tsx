import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.blueboxx.in';
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://backend.blueboxx.in/api';
  const now = new Date().toISOString();

  let jobUrls: string[] = [];

  // Always include main jobs listing
  jobUrls.push(`  <url>
    <loc>${baseUrl}/jobs</loc>
    <lastmod>${now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`);

  try {
    // Fetch active public jobs (per_page 200, paginate through if necessary)
    const response = await fetch(`${apiUrl}/public/jobs?per_page=200`, {
      headers: { 'Accept': 'application/json' },
    });
    if (response.ok) {
      const data = await response.json();
      const jobs = data?.data?.data || data?.data || [];

      if (Array.isArray(jobs)) {
        jobs.forEach((j: any) => {
          if (j.id) {
            const lastmod = j.updated_at ? new Date(j.updated_at).toISOString() : now;
            jobUrls.push(`  <url>
    <loc>${baseUrl}/jobs/${j.id}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`);
          }
        });
      }
    }
  } catch (error) {
    console.error('Error fetching jobs for sitemap:', error);
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${jobUrls.join('\n')}
</urlset>`;

  res.setHeader('Content-Type', 'text/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=1800');
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};

export default function JobsSitemap() {
  return null;
}
