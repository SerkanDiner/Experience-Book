'use client';

import React from 'react';
import Link from 'next/link';
import {
  FaCode,
  FaUtensils,
  FaHotel,
  FaChalkboardTeacher,
  FaHeartbeat,
  FaStore,
  FaHardHat,
  FaMoneyBillWave,
  FaTruck,
  FaPaintBrush,
  FaBalanceScale,
  FaDumbbell,
} from 'react-icons/fa';

const industries = [
  { title: 'Technology', icon: FaCode, link: '/industry/technology', description: 'Explore stories from developers, IT managers, and tech founders.' },
  { title: 'Food Industry', icon: FaUtensils, link: '/industry/food', description: 'From chefs to restaurant owners, learn what it takes to succeed.' },
  { title: 'Hospitality', icon: FaHotel, link: '/industry/hospitality', description: 'Insights from hotel managers, travel agents, and more.' },
  { title: 'Education', icon: FaChalkboardTeacher, link: '/industry/education', description: 'Teachers, professors, and education consultants share their path.' },
  { title: 'Healthcare', icon: FaHeartbeat, link: '/industry/healthcare', description: 'Read experiences from nurses, doctors, and paramedics.' },
  { title: 'Retail', icon: FaStore, link: '/industry/retail', description: 'Retail managers and store owners offer real-world advice.' },
  { title: 'Construction', icon: FaHardHat, link: '/industry/construction', description: 'Learn from civil engineers, architects, and site managers.' },
  { title: 'Finance', icon: FaMoneyBillWave, link: '/industry/finance', description: 'Bankers, accountants, and traders share their journeys.' },
  { title: 'Transportation', icon: FaTruck, link: '/industry/transportation', description: 'Stories from pilots, logistics coordinators, and drivers.' },
  { title: 'Creative Arts', icon: FaPaintBrush, link: '/industry/arts', description: 'Designers, musicians, and actors share their creative path.' },
  { title: 'Legal', icon: FaBalanceScale, link: '/industry/legal', description: 'Hear from solicitors, barristers, and paralegals.' },
  { title: 'Sports & Fitness', icon: FaDumbbell, link: '/industry/sports', description: 'From personal trainers to footballers, learn how they made it.' },
];

export default function IndustryCatalog({ limit = null }) {
  const displayedIndustries = limit ? industries.slice(0, limit) : industries;

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <h2 className="text-3xl font-bold text-center text-orange-500 mb-4">
        Explore Industries
      </h2>
      <p className="text-center text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-10">
        Discover real-life stories from professionals in various fields. Whether you're curious
        about working in healthcare, tech, hospitality, or the arts — dive into firsthand
        experiences and learn what it’s really like to build a career in these industries.
      </p>

      {/* Grid of Industry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {displayedIndustries.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="bg-white dark:bg-gray-900 border border-orange-200 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex justify-center items-center pt-8">
                <div className="bg-orange-100 text-orange-400 rounded-full p-4 shadow-sm">
                  <Icon className="w-8 h-8" />
                </div>
              </div>
              <div className="p-6 flex flex-col justify-between">
                <h3 className="text-xl font-semibold text-orange-500 mb-2 text-center">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 text-center">
                  {item.description}
                </p>
                <div className="flex justify-center">
                  <Link
                    href={item.link}
                    className="inline-block px-4 py-2 text-sm bg-orange-400 hover:bg-orange-500 text-white rounded-full transition-all duration-300"
                  >
                    See More
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* View All CTA */}
      {limit && (
        <div className="flex justify-center mt-10">
          <Link
            href="/industries"
            className="px-6 py-3 bg-orange-400 hover:bg-orange-500 text-white font-medium rounded-full transition duration-300"
          >
            View All Industries
          </Link>
        </div>
      )}
    </section>
  );
}
