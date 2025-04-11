/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // ✅ Allow external image domains (Firebase in your case)
  images: {
    domains: ['firebasestorage.googleapis.com'],
  },
};

module.exports = nextConfig;
