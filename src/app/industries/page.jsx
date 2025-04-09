import IndustryCatalog from '../components/CallToAction';
import { Briefcase, Globe, Lightbulb } from 'lucide-react';

export default function IndustriesPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-14 px-6">
      {/* 🔶 Hero Section */}
      <div className="text-center mb-12">
        <div className="flex justify-center items-center gap-3 text-orange-500 mb-2">
          <Briefcase className="w-6 h-6" />
          <h1 className="text-3xl sm:text-4xl font-bold">
            Discover Careers by Industry
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Browse real experiences from professionals across various industries. Find your path, get inspired,
          and dive into the journey behind every job.
        </p>

        {/* Icon Badges */}
        <div className="flex justify-center gap-6 mt-6 text-gray-500 dark:text-gray-400 flex-wrap">
          <div className="flex items-center gap-2 text-sm sm:text-base">
            <Globe className="w-5 h-5 text-orange-400" />
            Global Industries
          </div>
          <div className="flex items-center gap-2 text-sm sm:text-base">
            <Lightbulb className="w-5 h-5 text-orange-400" />
            Expert Insights
          </div>
        </div>
      </div>

      {/* 🧩 Catalog Grid */}
      <IndustryCatalog />
    </div>
  );
}
