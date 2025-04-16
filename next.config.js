const nextConfig = {
  reactStrictMode: true,
  generateBuildId: async () => `${Date.now()}`,
  images: {
    domains: ['firebasestorage.googleapis.com', 'img.clerk.com'],
  },
};

module.exports = nextConfig;
