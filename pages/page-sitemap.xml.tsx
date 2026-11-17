import { GetServerSideProps } from 'next';

const STATIC_PAGES = [
  '',
  '/about',
  '/services',
  '/courses',
  '/internships',
  '/internship',
  '/jobs',
  '/experts',
  '/colleges',
  '/companies',
  '/mentors',
  '/placements',
  '/placement-partners',
  '/portfolio',
  '/careers',
  '/community',
  '/contests',
  '/scholarships',
  '/success-stories',
  '/contact',
  '/book-consultation',
  '/press-kit',
  '/freelancers',
  '/privacy-policy',
  '/terms',
  '/refund-policy',
  '/harassment-policy',
];

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.blueboxx.in';
  const now = new Date().toISOString();

  const urls = STATIC_PAGES.map((route) => {
    const priority = route === '' ? '1.0' : route === '/courses' || route === '/internships' || route === '/services' || route === '/jobs' ? '0.9' : '0.8';
    const changefreq = route === '' || route === '/courses' || route === '/internships' || route === '/jobs' ? 'daily' : 'weekly';
    return `  <url>
    <loc>${baseUrl}${route}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
  }).join('\n');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  res.setHeader('Content-Type', 'text/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=43200');
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};

export default function PageSitemap() {
  return null;
}
