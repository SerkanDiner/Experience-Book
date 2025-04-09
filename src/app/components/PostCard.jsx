'use client';

import Link from 'next/link';
import { FaHeart, FaMapMarkerAlt, FaBriefcase, FaArrowRight } from 'react-icons/fa';

export default function PostCard({ post }) {
  return (
    <div className="w-full max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm rounded-2xl p-6 sm:p-8 transition duration-300 ease-in-out hover:shadow-md flex flex-col items-center text-center">

      {/* 🖼 Avatar */}
      <Link href={`/post/${post.slug}`} aria-label={post.title}>
        <img
          src={post.image}
          alt={post.title}
          className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-orange-400 shadow-md transition-transform hover:scale-105"
        />
      </Link>

      {/* 👤 Author */}
      <div className="mt-4">
        <span className="text-sm text-gray-700 dark:text-gray-300 font-medium line-clamp-1">
          {post.author || 'Unknown'}
        </span>
      </div>

      {/* 📄 Title */}
      <h2 className="mt-2 text-lg sm:text-xl font-semibold text-gray-900 dark:text-white line-clamp-1">
        {post.title}
      </h2>

      {/* 📍 Job Title + Location */}
      <div className="flex justify-center items-center gap-3 flex-wrap mt-2 text-xs text-gray-500 dark:text-gray-400">
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

      {/* ✏️ Summary */}
      <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 italic line-clamp-3 max-w-md">
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
              className="text-[11px] bg-orange-100 text-orange-600 px-2 py-1 rounded-full font-medium truncate max-w-[100px] hover:bg-orange-200"
              title={cat}
            >
              {cat}
            </span>
          ))}
      </div>

      {/* 🔗 Button */}
      <Link
        href={`/post/${post.slug}`}
        className="mt-5 flex items-center justify-center gap-2 w-full border border-orange-400 text-orange-500 font-medium text-sm py-2 rounded-md transition hover:bg-orange-400 hover:text-white"
      >
        View Profile <FaArrowRight className="text-xs" />
      </Link>
    </div>
  );
}
