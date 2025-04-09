/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: 'https://www.thexperiencebook.com/', // Replace with your real domain
    generateRobotsTxt: true,
    sitemapSize: 7000,
    changefreq: 'weekly',
    priority: 0.7,
    exclude: ['/admin', '/api/*'],
  };
  