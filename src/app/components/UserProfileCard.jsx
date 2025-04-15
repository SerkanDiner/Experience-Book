'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';

export default function UserProfileCard() {
  const { user } = useUser();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) return;

      try {
        const res = await fetch(`/api/user/profile?clerkId=${user.id}`);
        if (!res.ok) return;

        const data = await res.json();
        setProfile(data);
      } catch (err) {
        console.error('Error fetching profile:', err);
      }
    };

    fetchProfile();
  }, [user]);

  if (!profile) return null;

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-md p-6 max-w-sm mx-auto text-center">
      <div className="w-20 h-20 mx-auto rounded-full overflow-hidden border-4 border-orange-400 mb-4">
        <Image
          src={profile.profilePicture || '/default-avatar.png'}
          alt={profile.firstName || 'User'}
          width={80}
          height={80}
          className="object-cover"
        />
      </div>

      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
        {profile.firstName} {profile.lastName}
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400">@{profile.username}</p>

      {profile.profile?.jobTitle && (
        <p className="text-sm mt-2 text-orange-500">{profile.profile.jobTitle}</p>
      )}
      {profile.profile?.country && (
        <p className="text-xs text-gray-500 dark:text-gray-400">{profile.profile.country}</p>
      )}
      {profile.profile?.industry && (
        <p className="text-xs text-gray-400 dark:text-gray-500 italic">
          Industry: {profile.profile.industry}
        </p>
      )}

      {profile.profile?.bio && (
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-300 italic">
          “{profile.profile.bio}”
        </p>
      )}

      <Link
        href={`/users/${profile.username}`}
        className="mt-4 inline-block text-sm text-orange-500 hover:underline"
      >
        View Public Profile →
      </Link>
    </div>
  );
}
