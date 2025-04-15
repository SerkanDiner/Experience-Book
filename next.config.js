/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // ✅ Allow external image domains (Firebase + Clerk)
  images: {
    domains: ['firebasestorage.googleapis.com', 'img.clerk.com'],
  },
};

module.exports = nextConfig;
