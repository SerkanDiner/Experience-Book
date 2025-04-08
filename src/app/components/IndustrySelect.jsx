'use client';

import { useRouter } from 'next/navigation';
import { industryInfo } from '@/constants/industryData';
import { FaIndustry } from 'react-icons/fa';

export default function IndustrySelect({ currentSlug }) {
  const router = useRouter();

  const handleChange = (e) => {
    const slug = e.target.value;
    if (slug && slug !== currentSlug) {
      router.push(`/industry/${slug}`);
    }
  };

  return (
    <div className="my-10 text-center">
      <div className="inline-flex items-center gap-3 bg-white dark:bg-gray-800 px-4 py-2 rounded-md border border-orange-400 shadow-sm">
        <FaIndustry className="text-orange-500 text-lg" />
        <label htmlFor="industry-dropdown" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Jump to Industry:
        </label>
        <select
          id="industry-dropdown"
          onChange={handleChange}
          defaultValue={currentSlug}
          className="ml-2 px-3 py-1.5 rounded-md border border-gray-300 dark:border-gray-700 text-sm bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-300"
        >
          <option value="" disabled>
            Select an Industry
          </option>
          {Object.entries(industryInfo).map(([slug, info]) => (
            <option key={slug} value={slug}>
              💼 {info.title}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
