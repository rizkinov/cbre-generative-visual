/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Remove development-only settings for production library
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false
  }
};

export default nextConfig; 