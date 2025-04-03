'use client';

import Link from 'next/link';
import { FaHeart } from 'react-icons/fa';

export default function PostCard({ post }) {
  return (
    <div className="group relative w-full max-w-sm sm:w-[430px] bg-white dark:bg-gray-900 border border-orange-300 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 ease-in-out">
      
      {/* 🖼️ Image */}
      <Link href={`/post/${post.slug}`} aria-label={post.title}>
        <div className="w-full h-[250px] bg-white dark:bg-gray-900 flex items-center justify-center overflow-hidden">
          <img
            src={post.image}
            alt={post.title}
            loading="lazy"
            className="h-full w-auto object-contain"
          />
        </div>
      </Link>

      {/* 📄 Content */}
      <div className="px-4 pb-5 pt-3 flex flex-col gap-3 relative">
        
        {/* 📝 Title */}
        <h2 className="text-[17px] sm:text-lg font-semibold text-gray-800 dark:text-white leading-snug line-clamp-2">
          {post.title}
        </h2>

        {/* ❤️ Likes */}
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 gap-1">
          <FaHeart className="text-red-500 text-[13px]" />
          <span>{post.likes || 0}</span>
          <span className="ml-1">likes</span>
        </div>

        {/* 🏷️ Category Tags */}
        <div className="flex flex-wrap gap-1 sm:gap-2 overflow-hidden max-h-[58px]">
          {(post.categories || [])
            .filter((cat) => cat?.trim() !== '')
            .map((cat, index) => (
              <span
                key={index}
                className="text-[11px] sm:text-xs bg-orange-50 text-orange-600 px-2 py-[5px] rounded-full font-medium whitespace-nowrap hover:bg-orange-100 transition"
                title={cat}
              >
                {cat}
              </span>
            ))}
        </div>

        {/* 🔘 CTA Button (Reveal on Hover) */}
        <Link
          href={`/post/${post.slug}`}
          className="absolute left-4 right-4 bottom-[-60px] group-hover:bottom-4 bg-white dark:bg-gray-900 border border-orange-400 text-orange-500 font-medium py-2 text-center rounded-md transition-all duration-300 hover:bg-orange-400 hover:text-white"
        >
          See Profile
        </Link>
      </div>
    </div>
  );
}
