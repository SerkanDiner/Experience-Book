'use client';

import { Button } from 'flowbite-react';

export default function CallToAction() {
  return (
    <section className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 sm:p-10 border border-orange-400 rounded-tl-3xl rounded-br-3xl bg-white dark:bg-gray-900 shadow-md max-w-6xl mx-auto transition-all duration-300">
      
      {/* Text Content */}
      <div className="flex-1 flex flex-col items-center sm:items-start text-center sm:text-left px-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-orange-500 mb-2">
          How to Become a Police Officer
        </h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4 text-sm sm:text-base leading-relaxed max-w-xl">
          Ever wondered what it takes to become a police officer in the UK? Learn firsthand from those who have walked the beat, faced challenges, and built rewarding careers in law enforcement.
        </p>

        {/* CTA Button */}
        <a
          href="https://www.met.police.uk/police-forces/metropolitan-police/areas/c/careers/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-orange-500 text-white font-semibold px-6 py-3 rounded-full shadow hover:shadow-lg hover:bg-orange-600 transition-all duration-300"
        >
          Read More
        </a>
      </div>

      {/* Image */}
      <div className="flex-1 w-full max-w-md sm:max-w-sm px-4">
        <img
          src="/images/home_page_police.jpg"
          alt="UK Police Officer standing with confidence"
          loading="lazy"
          className="rounded-xl shadow-md w-full h-auto object-cover"
        />
      </div>
    </section>
  );
}
