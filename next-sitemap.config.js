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
  'sport'
];

// Temporary hardcoded post slugs (replace with actual or automate later)
const postSlugs = [
  'my-first-post',
  'becoming-a-chef',
];

module.exports = {
  siteUrl: 'https://www.thexperiencebook.com',
  generateRobotsTxt: true,
  generateIndexSitemap: true,

  additionalPaths: async () => {
    const industryPaths = industrySlugs.map((slug) => ({
      loc: `/industry/${slug}`,
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date().toISOString(),
    }));

    const postPaths = postSlugs.map((slug) => ({
      loc: `/post/${slug}`,
      changefreq: 'monthly',
      priority: 0.6,
      lastmod: new Date().toISOString(),
    }));

    return [
      { loc: '/', changefreq: 'weekly', priority: 1.0 },
      { loc: '/about', changefreq: 'monthly', priority: 0.5 },
      { loc: '/industries', changefreq: 'weekly', priority: 0.6 },
      { loc: '/profiles', changefreq: 'weekly', priority: 0.5 },
      { loc: '/search', changefreq: 'daily', priority: 0.8 },
      { loc: '/videos', changefreq: 'weekly', priority: 0.6 },
      ...industryPaths,
      ...postPaths,
    ];
  },
};
