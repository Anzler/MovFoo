/** @type {import('next').NextConfig} */
const path = require("path");

const nextConfig = {
  reactStrictMode: true,

  env: {
    TMDB_API_KEY: process.env.TMDB_API_KEY,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
        pathname: "/t/p/**",
      },
      {
        protocol: "https",
        hostname: "spoonacular.com",
        pathname: "/recipeImages/**",
      },
    ],
  },

  webpack: (config, { isServer }) => {
    // Allow use of "@/..." for imports
    config.resolve.alias["@"] = path.resolve(__dirname);

    // Exclude backend files from client-side bundle
    if (!isServer) {
      config.module.rules.push({
        test: /backend/,
        use: {
          loader: require.resolve("ignore-loader"),
        },
      });
    }

    return config;
  },
};

module.exports = nextConfig;

