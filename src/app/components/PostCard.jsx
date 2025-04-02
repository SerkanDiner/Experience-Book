'use client';

import Link from 'next/link';

export default function PostCard({ post }) {
  return (
    <div className="group relative w-full max-w-sm sm:w-[430px] h-[400px] bg-white dark:bg-gray-900 border border-orange-300 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 ease-in-out">
      
      {/* Image */}
      <Link href={`/post/${post.slug}`} aria-label={post.title}>
        <img
          src={post.image}
          alt={post.title}
          loading="lazy"
          className="w-full h-[260px] object-cover transition-all duration-300 group-hover:h-[200px]"
        />
      </Link>

      {/* Content */}
      <div className="p-4 flex flex-col justify-between h-[140px] gap-2">
        
        {/* Title */}
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white line-clamp-2">
          {post.title}
        </h2>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 max-h-[56px] overflow-y-auto scrollbar-thin scrollbar-thumb-orange-300 pr-1">
          {(post.categories || [])
            .filter((cat) => cat?.trim() !== '')
            .map((cat, index) => (
              <span
                key={index}
                className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full font-medium truncate max-w-[120px]"
                title={cat}
              >
                {cat}
              </span>
            ))}
        </div>

        {/* CTA Button */}
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
