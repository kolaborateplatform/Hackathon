/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    domains: ['avatars.githubusercontent.com'],
  },
  distDir: 'build',
  cleanDistDir: true,
  trailingSlash: true,
};

module.exports = nextConfig;
