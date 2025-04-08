'use client';

import Link from 'next/link';
import { FaHeart, FaMapMarkerAlt, FaBriefcase, FaArrowRight } from 'react-icons/fa';

export default function PostCard({ post }) {
  return (
    <div className="group w-full max-w-sm sm:w-[380px] bg-white dark:bg-gray-900 border border-orange-300 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">

      {/* 📸 Avatar & Info */}
      <div className="flex items-start p-5 gap-4">
        {/* Avatar */}
        <div className="flex flex-col items-center gap-1 min-w-[90px]">
          <Link href={`/post/${post.slug}`} aria-label={post.title}>
            <img
              src={post.image}
              alt={post.title}
              className="w-24 h-24 rounded-full object-cover border-2 border-orange-300 shadow-md transition-transform group-hover:scale-105"
            />
          </Link>
          <span className="text-sm text-gray-700 dark:text-gray-300 font-medium text-center line-clamp-1">
            {post.author || 'Unknown'}
          </span>
        </div>

        {/* Info */}
        <div className="flex-1 flex flex-col gap-2">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white leading-tight line-clamp-1">
            {post.title}
          </h2>

          <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-3 flex-wrap">
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

          <p className="italic text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {post.summary || "This is my journey becoming..."}
          </p>

          <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
            <FaHeart className="text-red-500 text-xs" />
            <span>{post.likes || 0} likes</span>
          </div>
        </div>
      </div>

      {/* 🏷️ Tags */}
      <div className="flex flex-wrap gap-2 px-5 pt-3 pb-3 border-t border-gray-200 dark:border-gray-700">
        {(post.categories || [])
          .filter(cat => cat?.trim() !== '')
          .map((cat, index) => (
            <span
              key={index}
              className="text-[11px] bg-orange-100 text-orange-600 px-2 py-1 rounded-full font-medium truncate max-w-[100px] hover:bg-orange-200"
              title={cat}
            >
              {cat}
            </span>
          ))}
      </div>

      {/* CTA Button */}
      <div className="px-5 pb-5">
        <Link
          href={`/post/${post.slug}`}
          className="flex items-center justify-center gap-2 w-full border border-orange-400 text-orange-500 font-medium text-sm py-2 rounded-md transition hover:bg-orange-400 hover:text-white"
        >
          View Profile <FaArrowRight className="text-xs" />
        </Link>
      </div>
    </div>
  );
}
