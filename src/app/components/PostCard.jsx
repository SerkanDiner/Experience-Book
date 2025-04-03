'use client';

import Link from 'next/link';
import { FaHeart, FaMapMarkerAlt, FaBriefcase } from 'react-icons/fa';

export default function PostCard({ post }) {
  return (
    <div className="group w-full max-w-sm sm:w-[380px] bg-white dark:bg-gray-900 border border-orange-300 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 ease-in-out">
      
      {/* 📄 Content Block */}
      <div className="flex items-start p-4 gap-4">
        
        {/* 👤 Avatar + Name */}
        <div className="flex flex-col items-center gap-1 min-w-[80px]">
          <Link href={`/post/${post.slug}`} aria-label={post.title}>
            <img
              src={post.image}
              alt={post.title}
              className="w-20 h-20 rounded-full object-cover border-2 border-orange-300 shadow-sm transition-transform group-hover:scale-105"
            />
          </Link>
          <span className="text-xs text-gray-600 dark:text-gray-400 font-medium text-center">
            Name
          </span>
        </div>

        {/* 📝 Info */}
        <div className="flex-1 flex flex-col gap-1">
          <h2 className="text-md font-semibold text-gray-800 dark:text-white leading-snug line-clamp-1">
            {post.title}
          </h2>

          <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2 flex-wrap">
            <span className="flex items-center gap-1">
              <FaBriefcase className="text-orange-400" />
              Job Title
            </span>
            <span className="flex items-center gap-1">
              <FaMapMarkerAlt className="text-orange-400" />
              Location
            </span>
          </div>

          <p className="italic text-[13px] text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
            "This is my journey becoming..."
          </p>

          {/* ❤️ Likes */}
          <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 mt-2">
            <FaHeart className="text-red-500 text-xs" />
            <span>{post.likes || 0} likes</span>
          </div>
        </div>
      </div>

      {/* 🏷️ Tags */}
      <div className="flex flex-wrap justify-start gap-2 px-4 pb-3">
        {(post.categories || [])
          .filter((cat) => cat?.trim() !== '')
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

      {/* 🔘 CTA */}
      <div className="px-4 pb-4">
        <Link
          href={`/post/${post.slug}`}
          className="block w-full border border-orange-400 text-orange-500 font-medium text-center py-2 rounded-md transition hover:bg-orange-400 hover:text-white"
        >
          See Profile
        </Link>
      </div>
    </div>
  );
}
