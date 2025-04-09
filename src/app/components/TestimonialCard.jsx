'use client';

import React from 'react';

const TestimonialCard = ({ name, role, image, title, quote }) => {
  return (
    <figure className="w-full max-w-md max-h-[90vh] overflow-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm rounded-2xl p-6 sm:p-8 transition duration-300 ease-in-out hover:shadow-md flex flex-col items-center text-center">
      
      {/* Title */}
      <h3 className="text-lg sm:text-xl font-semibold text-orange-500 mb-3">
        {title}
      </h3>

      {/* Quote */}
      <blockquote className="text-gray-600 dark:text-gray-300 text-base sm:text-lg italic leading-relaxed max-w-2xl mb-6">
        “{quote}”
      </blockquote>

      {/* Divider */}
      <div className="w-12 h-[2px] bg-orange-400 mb-6"></div>

      {/* Avatar + Info */}
      <figcaption className="flex flex-col items-center gap-2">
        <img
          src={image}
          alt={name}
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-orange-400 shadow-md"
          loading="lazy"
        />
        <div className="text-center mt-2">
          <div className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
            {name}
          </div>
          <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            {role}
          </div>
        </div>
      </figcaption>
    </figure>
  );
};

export default React.memo(TestimonialCard);
