/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  /* Remote images – keep this */
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
  }
};

module.exports = nextConfig;

