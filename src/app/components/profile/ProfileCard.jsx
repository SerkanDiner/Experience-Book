'use client';

import Link from 'next/link';

export default function ProfileCard({ profile }) {
  return (
    <Link
      href={`/profile/${profile.slug}`}
      aria-label={`View profile of ${profile.name}`}
      className="group bg-white dark:bg-gray-900 rounded-2xl shadow-md hover:shadow-lg border border-orange-100 dark:border-orange-700 p-6 flex flex-col items-center text-center transition-all duration-300 hover:scale-[1.02]"
    >
      {/* Avatar */}
      <div className="w-24 h-24 rounded-full border-4 border-orange-400 overflow-hidden mb-4 shadow">
        <img
          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=orange&color=fff&size=512`}
          alt={`Avatar of ${profile.name}`}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Name & Job Title */}
      <h2 className="text-xl font-bold text-gray-900 dark:text-white">{profile.name}</h2>
      <p className="text-sm text-gray-500 dark:text-gray-300">{profile.jobTitle}</p>

      {/* Industry Tag */}
      <span className="mt-2 text-xs bg-orange-100 text-orange-600 px-3 py-1 rounded-full capitalize">
        {profile.industry}
      </span>

      {/* Short Bio */}
      {profile.bio && (
        <p className="mt-3 text-xs text-gray-600 dark:text-gray-400 text-center line-clamp-3">
          {profile.bio}
        </p>
      )}

      {/* Username/Slug */}
      <span className="mt-2 text-[11px] text-gray-400 dark:text-gray-500 italic">
        @{profile.slug}
      </span>

      {/* CTA */}
      <span className="mt-4 inline-block bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold px-4 py-2 rounded-full transition">
        View Profile
      </span>
    </Link>
  );
}
