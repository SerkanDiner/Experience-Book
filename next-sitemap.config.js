/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://www.thexperiencebook.com', // ✅ This must be your live domain
  generateRobotsTxt: true,
  generateIndexSitemap: true,
  sitemapSize: 7000,
  exclude: ['/api/*'],
};
