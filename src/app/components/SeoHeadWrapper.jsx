'use client';

import { useSearchParams } from 'next/navigation';
import SeoHead from './SeoHead';

const SeoHeadWrapper = ({ title, description, url }) => {
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab') || 'posts';

  return <SeoHead title={title} description={description} url={url} tab={tab} />;
};

export default SeoHeadWrapper;
