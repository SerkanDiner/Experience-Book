const { MongoClient } = require('mongodb');

const industrySlugs = [
  'technology', 'food', 'hospitality', 'education', 'healthcare',
  'retail', 'construction', 'finance', 'transportation',
  'art', 'legal', 'sport',
];

async function fetchPostSlugs() {
  const client = await MongoClient.connect(process.env.MONGODB_URI);
  const db = client.db(); // use default DB name from URI
  const posts = await db.collection('posts').find({}, { projection: { slug: 1 } }).toArray();
  client.close();

  return posts.map((post) => post.slug);
}

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

    const postSlugs = await fetchPostSlugs();

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
