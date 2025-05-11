'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  FaHeart,
  FaMapMarkerAlt,
  FaBriefcase,
  FaGlobe,
  FaArrowRight,
} from 'react-icons/fa';
import { industryInfo } from '@/constants/industryData';

export default function PostCard({ post }) {
  const readingTime = `${Math.max(1, Math.round(post.content?.length / 1000))} min read`;

  const industry = industryInfo[post.industry?.toLowerCase()];
  const industryBg = industry?.theme?.bg || 'bg-orange-100';
  const industryText = industry?.theme?.text || 'text-orange-600';

  return (
    <Link
      href={`/post/${post.slug}`}
      className="group w-full max-w-md bg-white dark:bg-zinc-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col"
    >
      {/* 🖼 Post Image */}
      <div className="relative w-full h-48">
        <Image
          src={post.image || '/placeholder.jpg'}
          alt={post.title || 'Post image'}
          fill
          className="object-cover"
          placeholder="blur"
          blurDataURL="/placeholder.jpg"
        />
      </div>

      {/* 📄 Content */}
      <div className="p-5 flex flex-col gap-2">
        {/* 📚 Industry Badge */}
        <span className={`text-xs px-2 py-1 rounded-full font-semibold self-start text-white ${industryBg}`}>
          {post.industry}
        </span>

        {/* 🧠 Title */}
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white line-clamp-2">
          {post.title}
        </h3>

        {/* 📝 Summary */}
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 italic">
          {post.summary}
        </p>

        {/* 👤 Author Info */}
        <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-400 items-center">
          {post.author && (
            <span className="font-medium text-gray-700 dark:text-gray-300">{post.author}</span>
          )}
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
          {post.language && (
            <span className="flex items-center gap-1">
              <FaGlobe className="text-orange-400" />
              {post.language.toUpperCase()}
            </span>
          )}
        </div>

        {/* 🔥 Stats */}
        <div className="mt-2 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <FaHeart className="text-red-500" />
            {post.likes || 0} likes
          </div>
          <span>{readingTime}</span>
        </div>

        {/* CTA */}
        <div className="mt-4 w-full">
          <div className="flex items-center justify-center gap-2 w-full border border-orange-400 text-orange-500 font-medium text-sm py-2 rounded-md transition group-hover:bg-orange-500 group-hover:text-white">
            Read Full Story <FaArrowRight className="text-xs" />
          </div>
        </div>
      </div>
    </Link>
  );
}
