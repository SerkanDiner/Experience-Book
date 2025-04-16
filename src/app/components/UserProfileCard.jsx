'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function UserProfileCard({ user }) {
  if (!user) return null;

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-md p-6 max-w-sm mx-auto text-center">
      <div className="w-20 h-20 mx-auto rounded-full overflow-hidden border-4 border-orange-400 mb-4">
        <Image
          src={user.profilePicture || '/default-avatar.png'}
          alt={user.firstName || 'User'}
          width={80}
          height={80}
          className="object-cover"
        />
      </div>

      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
        {user.firstName} {user.lastName}
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400">@{user.username}</p>

      {user.profile?.jobTitle && (
        <p className="text-sm mt-2 text-orange-500">{user.profile.jobTitle}</p>
      )}
      {user.profile?.country && (
        <p className="text-xs text-gray-500 dark:text-gray-400">{user.profile.country}</p>
      )}
      {user.profile?.industry && (
        <p className="text-xs text-gray-400 dark:text-gray-500 italic">
          Industry: {user.profile.industry}
        </p>
      )}

      {user.profile?.bio && (
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-300 italic">
          “{user.profile.bio}”
        </p>
      )}

      <Link
        href={`/users/${user.username}`}
        className="mt-4 inline-block text-sm text-orange-500 hover:underline"
      >
        View Public Profile →
      </Link>
    </div>
  );
}
