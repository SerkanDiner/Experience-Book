'use client';

import { FaBriefcase, FaMoneyBillWave, FaStar } from 'react-icons/fa';

export default function IndustryOverview({ industry, fallbackSlug }) {
  const title = industry?.title || fallbackSlug.replace(/-/g, ' ');
  const description =
    industry?.description ||
    `Discover real-life journeys and success stories from people working in the ${fallbackSlug.replace(/-/g, ' ')} industry.`;

  const bgColor = industry?.theme?.bg || 'bg-orange-100';
  const textColor = industry?.theme?.text || 'text-orange-600';

  return (
    <div className={`mb-12 rounded-xl shadow-md p-1`}>
      <div className={`rounded-xl p-6 ${bgColor}`}>
        <div className="bg-white/80 dark:bg-black/40 backdrop-blur-sm p-5 rounded-lg shadow-sm">
          <h1 className={`text-3xl font-extrabold capitalize mb-3 flex items-center gap-2 ${textColor}`}>
            <FaBriefcase className="text-2xl" />
            {title} Industry
          </h1>

          <p className="text-gray-800 dark:text-gray-200 max-w-2xl text-sm sm:text-base mb-5 leading-relaxed">
            {description}
          </p>

      {industry?.jobTitles && (
            <div className="text-sm text-gray-800 dark:text-gray-100 mb-2 flex items-start gap-2">
              <FaStar className={`mt-1 ${industry.theme?.text || 'text-yellow-500'}`} />
              <div>
                <strong className={`${industry.theme?.text || 'text-orange-500'}`}>Popular Roles:</strong>{' '}
                {industry.jobTitles.join(', ')}
              </div>
            </div>
          )}




          {industry?.salary && (
            <div className="text-sm text-gray-800 dark:text-gray-100 flex items-start gap-2">
              <FaMoneyBillWave className={`mt-1 ${industry.theme?.text || 'text-green-500'}`} />
              <div>
                <strong className={`${industry.theme?.text || 'text-orange-500'}`}>Average Salary:</strong>{' '}
                {industry.salary}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
