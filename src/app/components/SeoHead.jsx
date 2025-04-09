'use client';
import Head from 'next/head';

const SeoHead = ({ title, description, url }) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
    </Head>
  );
};

export default SeoHead;
