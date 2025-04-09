/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://thexperiencebook.com', // ✅ Make sure this is correct
  generateRobotsTxt: true,
  generateIndexSitemap: true,
  sitemapSize: 7000,
  exclude: ['/api/*', '/admin/*'], // Optional
};
