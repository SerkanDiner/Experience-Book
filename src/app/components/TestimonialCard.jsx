'use client';

import React from 'react';
import Image from 'next/image';
import { Star, UserCircle } from 'lucide-react';

const TestimonialCard = ({ name, image, title, quote, rating, category }) => {
  const displayName = name?.trim() || 'Anonymous';
  const displayQuote = quote?.trim() || 'This user left a kind message about their journey.';
  const stars = Array(5).fill(0).map((_, i) => i < rating);
  const displayCategory = category?.charAt(0).toUpperCase() + category?.slice(1);

  const hasImage = image && image.trim() !== '';

  return (
    <figure className="w-full max-w-md mx-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm rounded-2xl p-6 sm:p-8 transition duration-300 ease-in-out hover:shadow-md flex flex-col items-center text-center">

      {/* 🔖 Category */}
      {category && (
        <div className="text-sm sm:text-base font-semibold text-orange-500 mb-2 uppercase tracking-wide">
          {displayCategory}
        </div>
      )}

      {/* 💬 Quote */}
      <blockquote className="text-gray-600 dark:text-gray-300 text-base sm:text-lg italic leading-relaxed max-w-2xl mb-4">
        “{displayQuote}”
      </blockquote>

      {/* ⭐ Rating */}
      {rating > 0 && (
        <div className="flex justify-center gap-[2px] mb-4">
          {stars.map((filled, idx) => (
            <Star
              key={idx}
              className={`w-4 h-4 ${filled ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
            />
          ))}
        </div>
      )}

      {/* 🔸 Divider */}
      <div className="w-12 h-[2px] bg-orange-400 mb-6"></div>

      {/* 👤 Avatar + Name */}
      <figcaption className="flex flex-col items-center gap-2">
        <div className="w-16 h-16 sm:w-20 sm:h-20 relative rounded-full overflow-hidden border-2 border-orange-400 shadow-md flex items-center justify-center bg-white dark:bg-zinc-900">
          {hasImage ? (
            <Image
              src={image}
              alt={`${displayName}'s avatar`}
              fill
              className="object-cover"
              placeholder="blur"
              blurDataURL="/placeholder.jpg"
            />
          ) : (
            <UserCircle className="w-10 h-10 text-orange-400" />
          )}
        </div>
        <div className="text-center mt-2">
          <div className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
            {displayName}
          </div>
        </div>
      </figcaption>
    </figure>
  );
};

export default React.memo(TestimonialCard);
