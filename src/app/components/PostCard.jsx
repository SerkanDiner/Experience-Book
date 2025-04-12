'use client';

import Link from 'next/link';
import { FaHeart, FaMapMarkerAlt, FaBriefcase, FaArrowRight } from 'react-icons/fa';

export default function PostCard({ post }) {
  return (
    <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center text-center">

      {/* 🖼 Avatar */}
      <Link href={`/post/${post.slug}`} aria-label={post.title}>
        <img
          src={post.image}
          alt={post.title}
          className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-orange-500 shadow-md hover:scale-105 transition-transform"
        />
      </Link>

      {/* 👤 Name */}
      <h2 className="mt-4 text-lg sm:text-xl font-bold text-gray-900 dark:text-white line-clamp-1">
        {post.author || 'Unknown'}
      </h2>

      {/* 🏷️ Job Title + Location */}
      <div className="flex justify-center items-center flex-wrap gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
        {post.jobTitle && (
          <span className="flex items-center gap-1">
            <FaBriefcase className="text-orange-400" />
            {post.jobTitle}
          </span>
        )}
        {post.location && (
          <span className="flex items-center gap-1">
            <FaMapMarkerAlt className="text-orange-400" />
            {post.location}
          </span>
        )}
      </div>

      {/* 📚 Post Title */}
      <p className="mt-3 text-sm font-semibold text-gray-800 dark:text-gray-200 line-clamp-2 max-w-xs">
        {post.title}
      </p>

      {/* ✍️ Summary */}
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 italic line-clamp-3 max-w-sm">
        {post.summary || 'This is my journey becoming...'}
      </p>

      {/* ❤️ Likes */}
      <div className="mt-3 text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
        <FaHeart className="text-red-500 text-xs" />
        <span>{post.likes || 0} likes</span>
      </div>

      {/* 🏷 Tags */}
      <div className="flex flex-wrap justify-center gap-2 mt-4">
        {(post.categories || [])
          .filter(cat => cat?.trim() !== '')
          .map((cat, index) => (
            <span
              key={index}
              className="text-[11px] bg-orange-100 text-orange-600 px-2 py-1 rounded-full font-medium truncate max-w-[100px] hover:bg-orange-200 dark:bg-orange-900/30 dark:text-orange-300"
              title={cat}
            >
              {cat}
            </span>
          ))}
      </div>

      {/* 🔗 CTA Button */}
      <Link
        href={`/post/${post.slug}`}
        className="mt-5 flex items-center justify-center gap-2 w-full border border-orange-400 text-orange-500 font-medium text-sm py-2 rounded-md transition hover:bg-orange-500 hover:text-white"
      >
        View Profile <FaArrowRight className="text-xs" />
      </Link>
    </div>
  );
}
