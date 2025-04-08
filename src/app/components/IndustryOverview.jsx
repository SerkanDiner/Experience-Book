'use client';

import { FaBriefcase, FaMoneyBillWave, FaStar } from 'react-icons/fa';

export default function IndustryOverview({ industry, fallbackSlug }) {
  const title = industry?.title || fallbackSlug.replace(/-/g, ' ');
  const description =
    industry?.description ||
    `Discover real-life journeys and success stories from people working in the ${fallbackSlug.replace(/-/g, ' ')} industry.`;

  return (
    <div className="mb-12 border-b pb-10 bg-orange-50 dark:bg-gray-800 p-6 rounded-xl shadow-sm">
      <h1 className="text-4xl font-extrabold text-orange-500 capitalize mb-3 flex items-center gap-2">
        <FaBriefcase className="text-orange-400" />
        {title} Industry
      </h1>

      <p className="text-gray-700 dark:text-gray-300 max-w-2xl text-sm sm:text-base mb-5 leading-relaxed">
        {description}
      </p>

      {industry?.jobTitles && (
        <div className="text-sm text-gray-800 dark:text-gray-200 mb-2 flex items-start gap-2">
          <FaStar className="mt-1 text-orange-400" />
          <div>
            <strong className="text-orange-500">Popular Roles:</strong> {industry.jobTitles.join(', ')}
          </div>
        </div>
      )}

      {industry?.salary && (
        <div className="text-sm text-gray-800 dark:text-gray-200 flex items-start gap-2">
          <FaMoneyBillWave className="mt-1 text-green-500" />
          <div>
            <strong className="text-orange-500">Average Salary:</strong> {industry.salary}
          </div>
        </div>
      )}
    </div>
  );
}
