/** @type {import('next-sitemap').IConfig} */
export default {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://blueboxx.in',
  generateRobotsTxt: true,
  sitemapSize: 7000,
  exclude: [
    '/admin/*', 
    '/student/*', 
    '/expert/*', 
    '/company/*', 
    '/jobseeker/*', 
    '/intern/*', 
    '/college/*', 
    '/cart', 
    '/checkout'
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin', 
          '/student', 
          '/expert', 
          '/company', 
          '/jobseeker', 
          '/intern', 
          '/college', 
          '/cart', 
          '/checkout'
        ]
      }
    ]
  }
};
