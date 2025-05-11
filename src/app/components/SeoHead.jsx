'use client';

import Head from 'next/head';

const tabLabels = {
  posts: 'Posts',
  jobs: 'Jobs',
  users: 'Users',
  products: 'Products',
};

const SeoHead = ({ title, description, url, tab = 'posts' }) => {
  const capitalizedTab = tabLabels[tab] || 'Posts';
  const fullTitle = `${capitalizedTab} | ${title}`;
  const fullDescription = `Discover ${capitalizedTab.toLowerCase()} in ${description}`;

  const canonicalUrl = tab === 'posts' ? url : `${url}?tab=${tab}`;

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={fullDescription} />
      <link rel="canonical" href={canonicalUrl} />
    </Head>
  );
};

export default SeoHead;
