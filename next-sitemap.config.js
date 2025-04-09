const industrySlugs = [
  'technology',
  'food',
  'hospitality',
  'education',
  'healthcare',
  'retail',
  'construction',
  'finance',
  'transportation',
  'art',
  'legal',
  'sport',
]; // 🧠 Add any more if you’ve added others

module.exports = {
  siteUrl: 'https://www.thexperiencebook.com',
  generateRobotsTxt: true,
  generateIndexSitemap: true,

  additionalPaths: async (config) => {
    const industryPaths = industrySlugs.map((slug) => ({
      loc: `/industry/${slug}`,
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date().toISOString(),
    }));

    return [
      { loc: '/', changefreq: 'weekly', priority: 1.0 },
      { loc: '/about', changefreq: 'monthly', priority: 0.5 },
      { loc: '/experiences', changefreq: 'weekly', priority: 0.8 },
      ...industryPaths,
    ];
  },
};
