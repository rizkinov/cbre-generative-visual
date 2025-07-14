/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Remove development-only settings for production library
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false
  }
};

export default nextConfig; 