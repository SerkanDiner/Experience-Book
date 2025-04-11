'use client';

import dynamic from 'next/dynamic';

const IndustryOverview = dynamic(() => import('./IndustryOverview'), {
  loading: () => (
    <div className="h-40 mb-6 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
  ),
});

const IndustrySelect = dynamic(() => import('./IndustrySelect'), {
  loading: () => (
    <div className="h-10 w-1/2 mx-auto bg-gray-100 dark:bg-gray-800 rounded animate-pulse mb-10" />
  ),
});

export default function IndustryClientWrapper({ industry, slug }) {
  return (
    <>
      <IndustryOverview industry={industry} fallbackSlug={slug} />
      <IndustrySelect currentSlug={slug} />
    </>
  );
}
