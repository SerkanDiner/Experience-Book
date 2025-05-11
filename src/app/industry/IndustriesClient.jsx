'use client';

import Link from 'next/link';
import { industryInfo } from '@/constants/industryData';
import {
  FaCode, FaUtensils, FaChartBar, FaBookOpen, FaNotesMedical,
  FaTools, FaPalette, FaRunning, FaBalanceScale, FaShoppingBag,
  FaConciergeBell, FaTruck,
} from 'react-icons/fa';
import { SearchIcon, Briefcase, Lightbulb } from 'lucide-react';

const iconMap = {
  technology: <FaCode className="text-3xl" />,
  food: <FaUtensils className="text-3xl" />,
  finance: <FaChartBar className="text-3xl" />,
  education: <FaBookOpen className="text-3xl" />,
  healthcare: <FaNotesMedical className="text-3xl" />,
  construction: <FaTools className="text-3xl" />,
  arts: <FaPalette className="text-3xl" />,
  sports: <FaRunning className="text-3xl" />,
  legal: <FaBalanceScale className="text-3xl" />,
  retail: <FaShoppingBag className="text-3xl" />,
  hospitality: <FaConciergeBell className="text-3xl" />,
  transportation: <FaTruck className="text-3xl" />,
};

export default function IndustriesClient() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Intro */}
      <section className="mb-14 text-center">
        <div className="flex justify-center items-center gap-3 text-orange-500 mb-3">
          <SearchIcon className="w-6 h-6" />
          <h1 className="text-3xl sm:text-4xl font-bold">Explore Career Industries</h1>
        </div>
        <p className="text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Browse real stories from professionals in your dream industry. Discover what it's really like and how people got there.
        </p>
        <div className="flex flex-wrap justify-center gap-6 mt-6 text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-2 text-sm sm:text-base">
            <Briefcase className="w-5 h-5 text-orange-400" />
            Career Insights
          </div>
          <div className="flex items-center gap-2 text-sm sm:text-base">
            <Lightbulb className="w-5 h-5 text-orange-400" />
            Real Stories
          </div>
        </div>
      </section>

      {/* Industry Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {Object.entries(industryInfo).map(([slug, info]) => (
          <Link
            key={slug}
            href={`/industry/${slug}`}
            className="group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 flex flex-col items-center text-center hover:scale-[1.02]"
          >
            {/* Gradient Background Icon */}
            <div className={`bg-gradient-to-br ${info.theme?.bg || 'from-orange-400 to-orange-500'} text-white p-4 rounded-full shadow-sm mb-3`}>
              {iconMap[slug]}
            </div>

            {/* Title */}
            <h2 className={`text-lg font-bold mb-1 ${info.theme?.text || 'text-orange-500'}`}>
              {info.title}
            </h2>

            {/* Description */}
            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
              {info.description}
            </p>

            {/* CTA */}
            <span className={`mt-5 inline-block bg-gradient-to-br ${info.theme?.bg || 'from-orange-500 to-orange-600'} text-white font-semibold text-xs sm:text-sm px-4 py-2 rounded-full group-hover:brightness-110 transition`}>
              See More
            </span>
          </Link>
        ))}
      </section>
    </main>
  );
}
