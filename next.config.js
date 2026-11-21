/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion', 'recharts', '@dnd-kit/core', 'clsx'],
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'backend.blueboxx.in',
      },
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
      }
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'accelerometer=*, gyroscope=*, magnetometer=*',
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/job-details/:id',
        destination: '/jobs/:id',
        permanent: true,
      },
      {
        source: '/job-details',
        destination: '/jobs',
        permanent: true,
      },
      {
        source: '/job-listings',
        destination: '/jobs',
        permanent: true,
      },
      {
        source: '/courses-details/:slug*',
        destination: '/courses',
        permanent: true,
      },
      {
        source: '/become-instructor',
        destination: '/careers',
        permanent: true,
      },
      {
        source: '/page-sitemap.xml',
        destination: '/sitemap.xml',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
