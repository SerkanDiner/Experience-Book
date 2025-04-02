'use client';

import React from 'react';

const TestimonialCard = ({ name, role, image, title, quote }) => {
  return (
    <figure className="w-full rounded-2xl border border-orange-400 bg-white dark:bg-gray-800 shadow-md dark:shadow-none p-6 sm:p-8 flex flex-col items-center text-center transition duration-300 ease-in-out hover:shadow-lg">
      
      {/* Icon or Title */}
      <h3 className="text-lg sm:text-xl font-semibold text-orange-500 mb-2">{title}</h3>

      {/* Quote */}
      <blockquote className="text-gray-600 dark:text-gray-300 text-sm sm:text-base leading-relaxed italic max-w-2xl mb-6">
        “{quote}”
      </blockquote>

      {/* Divider */}
      <div className="w-12 h-[2px] bg-orange-400 mb-4"></div>

      {/* Author */}
      <figcaption className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
        <img
          src={image}
          alt={name}
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-gray-300 dark:border-gray-600 object-cover"
          loading="lazy"
        />
        <div className="text-center sm:text-left">
          <div className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">{name}</div>
          <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{role}</div>
        </div>
      </figcaption>
    </figure>
  );
};

export default React.memo(TestimonialCard);
