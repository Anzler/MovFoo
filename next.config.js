/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.tmdb.org',
        pathname: '/t/p/**'
      },
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
        pathname: '/t/p/**'
      }
    ]
  },

  webpack: (config) => {
    config.resolve.alias['@'] = path.resolve(__dirname);
    return config;
  }
};

module.exports = nextConfig;

