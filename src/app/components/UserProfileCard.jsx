// ✅ File: components/UserProfileCard.jsx

'use client';

import { FaBriefcase, FaMapMarkerAlt, FaGlobe, FaLink } from 'react-icons/fa';
import Image from 'next/image';

export default function UserProfileCard({ profile }) {
  if (!profile) return null;

  return (
    <div className="w-full max-w-md mx-auto bg-white dark:bg-zinc-900 rounded-xl shadow-md p-6 text-center">
      <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-4 border-orange-400 shadow-md">
        <Image
          src={profile.profilePicture || '/default-avatar.png'}
          alt={`${profile.firstName}'s avatar`}
          width={96}
          height={96}
          className="object-cover w-full h-full"
        />
      </div>

      <h2 className="text-xl font-bold text-gray-800 dark:text-white">@{profile.username}</h2>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        {profile.firstName} {profile.lastName}
      </p>

      <div className="flex justify-center flex-wrap gap-2 mt-2 text-sm text-gray-500 dark:text-gray-400">
        {profile.jobTitle && (
          <span className="flex items-center gap-1">
            <FaBriefcase className="text-orange-400" /> {profile.jobTitle}
          </span>
        )}
        {profile.country && (
          <span className="flex items-center gap-1">
            <FaMapMarkerAlt className="text-orange-400" /> {profile.country}
          </span>
        )}
        {profile.languages?.length > 0 && (
          <span className="flex items-center gap-1">
            <FaGlobe className="text-orange-400" /> {profile.languages.join(', ')}
          </span>
        )}
      </div>

      {profile.bio && (
        <p className="mt-4 italic text-sm text-gray-700 dark:text-gray-300">"{profile.bio}"</p>
      )}

      {profile.website && (
        <a
          href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-orange-500 hover:underline mt-3 inline-block text-sm"
        >
          <FaLink className="inline mr-1" /> {profile.website.replace(/^https?:\/\//, '')}
        </a>
      )}
    </div>
  );
}
