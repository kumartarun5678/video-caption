/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@remotion/cli'],
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      fs: false,
    };
    return config;
  },
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;

