/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  async rewrites() {
    // API proxy for Replit: /api/* -> localhost:4000/*
    if (process.env.NODE_ENV === 'production') {
      return {
        beforeFiles: [
          {
            source: '/api/:path*',
            destination: `http://localhost:4000/:path*`,
          },
        ],
      };
    }

    return {
      beforeFiles: [
        {
          source: '/api/:path*',
          destination: `http://localhost:4000/:path*`,
        },
      ],
    };
  },

  headers: async () => {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
        ],
      },
    ];
  },

  redirects: async () => {
    return [
      {
        source: '/',
        destination: '/dashboard',
        permanent: false,
      },
    ];
  },

  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  },
};

module.exports = nextConfig;
