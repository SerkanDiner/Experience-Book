import Link from 'next/link';
import { connect } from '@/lib/mongodb/mongoose';
import Profile from '@/lib/models/profile.model';

export const dynamic = 'force-dynamic'; // Always fetch fresh data

export default async function ProfilesPage() {
  await connect();

  const profiles = await Profile.find({ isPublic: true }).lean();

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Public Profiles</h1>

      {profiles.length === 0 ? (
        <div className="text-center text-gray-600">No public profiles found yet.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {profiles.map((profile) => (
            <Link
              key={profile._id}
              href={`/profile/${profile.slug}`}
              className="bg-white rounded-lg shadow p-6 flex flex-col items-center hover:shadow-lg transition"
            >
              {/* Avatar */}
              <div className="w-20 h-20 rounded-full border-2 border-orange-400 overflow-hidden mb-4">
                <img
                  src={`https://ui-avatars.com/api/?name=${profile.name}&background=orange&color=fff&size=512`}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Name */}
              <h2 className="text-lg font-bold text-gray-800">{profile.name}</h2>

              {/* Job Title */}
              <p className="text-sm text-gray-500">{profile.jobTitle}</p>

              {/* Industry */}
              <span className="mt-2 text-xs bg-orange-100 text-orange-600 px-3 py-1 rounded-full capitalize">
                {profile.industry}
              </span>

              {/* Bio */}
              {profile.bio && (
                <p className="mt-3 text-xs text-gray-600 text-center line-clamp-3">{profile.bio}</p>
              )}

              {/* Slug (optional display) */}
              <span className="mt-1 text-[10px] text-gray-400">Username {profile.slug}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
