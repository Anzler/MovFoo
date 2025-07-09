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
      },
      {
        protocol: 'https',
        hostname: '**.spoonacular.com',
        pathname: '/recipeImages/**'
      }
    ]
  },

  webpack: (config, { isServer }) => {
    config.resolve.alias['@'] = path.resolve(__dirname);

    // Ignore backend folder in frontend bundle
    if (!isServer) {
      config.module.rules.push({
        test: /backend/,
        use: 'null-loader'
      });
    }

    return config;
  }
};

module.exports = nextConfig;

