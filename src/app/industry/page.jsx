import Link from 'next/link';
import { industryInfo } from '@/constants/industryData';
import {
    FaCode,
    FaUtensils,
    FaChartBar,
    FaBookOpen,
    FaNotesMedical,
    FaTools,
    FaPalette,
    FaRunning,
    FaBalanceScale,
    FaShoppingBag,
    FaConciergeBell,
    FaTruck,
  } from 'react-icons/fa';
  

export const metadata = {
  title: 'Explore Industries | Experience Book',
  description: 'Browse industries and discover real-world career stories.',
};

// 🎨 Icon mapping
const iconMap = {
    technology: <FaCode className="text-3xl text-orange-500" />,
    food: <FaUtensils className="text-3xl text-orange-500" />,
    finance: <FaChartBar className="text-3xl text-orange-500" />,
    education: <FaBookOpen className="text-3xl text-orange-500" />,
    healthcare: <FaNotesMedical className="text-3xl text-orange-500" />,
    construction: <FaTools className="text-3xl text-orange-500" />,
    arts: <FaPalette className="text-3xl text-orange-500" />,
    sports: <FaRunning className="text-3xl text-orange-500" />,
    legal: <FaBalanceScale className="text-3xl text-orange-500" />,
    retail: <FaShoppingBag className="text-3xl text-orange-500" />,
    hospitality: <FaConciergeBell className="text-3xl text-orange-500" />,
    transportation: <FaTruck className="text-3xl text-orange-500" />,
};

export default function IndustriesPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 px-6 py-14">
      {/* 🧡 Page Heading */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-4xl font-extrabold text-orange-500">Explore Industries & Professions</h1>
        <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg mt-3">
          Discover real-world insights and stories from people in your dream industry. Click on a category to learn more.
        </p>
      </div>

      {/* 🔥 Grid of Industry Cards */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(industryInfo).map(([slug, info]) => (
          <Link
            href={`/industry/${slug}`}
            key={slug}
            className="group bg-white dark:bg-gray-800 border border-orange-100 dark:border-orange-400 rounded-xl p-6 shadow-sm hover:shadow-md transition duration-200 hover:border-orange-400"
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className="bg-orange-100 dark:bg-orange-900 p-4 rounded-full shadow-sm">
                {iconMap[slug] || <GaCode className="text-3xl text-orange-500" />}
              </div>
              <h2 className="text-lg font-bold text-orange-500">{info.title}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">{info.description}</p>
              <span className="mt-3 inline-block bg-orange-400 text-white font-semibold text-sm px-4 py-2 rounded-full group-hover:bg-orange-500 transition">
                See more about {info.title}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
