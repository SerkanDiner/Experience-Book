import Link from 'next/link';
import { connect } from '@/lib/mongodb/mongoose';
import Profile from '@/lib/models/profile.model';
import { FaUsers } from 'react-icons/fa';

export const dynamic = 'force-dynamic'; // Always fetch fresh data

export default async function ProfilesPage() {
  await connect();

  const profiles = await Profile.find({ isPublic: true }).lean();

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <div className="bg-orange-500 text-white p-4 rounded-full shadow-lg">
            <FaUsers size={28} />
          </div>
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">Meet Professionals</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-xl mx-auto">
          Discover career journeys, get inspired, and connect with real people sharing their experiences openly.
        </p>
      </div>

      {profiles.length === 0 ? (
        <div className="text-center text-gray-600 dark:text-gray-400">No public profiles found yet.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {profiles.map((profile) => (
            <Link
              key={profile._id}
              href={`/profile/${profile.slug}`}
              className="bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-xl transition duration-300 p-6 flex flex-col items-center border border-orange-100 dark:border-orange-700"
            >
              {/* Avatar */}
              <div className="w-24 h-24 rounded-full border-4 border-orange-400 overflow-hidden mb-4 shadow">
                <img
                  src={`https://ui-avatars.com/api/?name=${profile.name}&background=orange&color=fff&size=512`}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Name */}
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{profile.name}</h2>

              {/* Job Title */}
              <p className="text-sm text-gray-500 dark:text-gray-300">{profile.jobTitle}</p>

              {/* Industry */}
              <span className="mt-2 text-xs bg-orange-100 text-orange-600 px-3 py-1 rounded-full capitalize">
                {profile.industry}
              </span>

              {/* Bio */}
              {profile.bio && (
                <p className="mt-3 text-xs text-gray-600 dark:text-gray-400 text-center line-clamp-3">
                  {profile.bio}
                </p>
              )}

              {/* Slug (optional display) */}
              <span className="mt-2 text-[11px] text-gray-400 dark:text-gray-500 italic">
                @{profile.slug}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
