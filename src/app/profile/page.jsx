import Link from 'next/link';
import { connect } from '@/lib/mongodb/mongoose';
import Profile from '@/lib/models/profile.model';
import { FaUsers, FaCommentDots, FaEye, FaBriefcase } from 'react-icons/fa';

export const dynamic = 'force-dynamic';

export default async function ProfilesPage() {
  await connect();
  const profiles = await Profile.find({ isPublic: true }).lean();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* 🧡 Intro Section */}
      <section className="mb-14 text-center">
        <div className="flex justify-center items-center gap-3 text-orange-500 mb-3">
          <FaUsers className="w-6 h-6" />
          <h1 className="text-3xl sm:text-4xl font-bold">Meet Real Professionals</h1>
        </div>
        <h2 className="text-sm uppercase text-orange-400 tracking-wide font-semibold mt-2 mb-3">
          Real People. Real Jobs. Real Advice.
        </h2>
        <p className="text-base text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
          Experience Book is a platform where real people share their career journeys. Whether you're exploring your future, switching fields, or just curious — this page lets you discover professionals across industries, read about how they got started, and connect by asking them questions. Learn directly from those who’ve walked the path.
        </p>

        <div className="flex flex-wrap justify-center gap-6 mt-6 text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-2 text-sm sm:text-base">
            <FaEye className="w-4 h-4 text-orange-400" />
            View Public Profiles
          </div>
          <div className="flex items-center gap-2 text-sm sm:text-base">
            <FaBriefcase className="w-4 h-4 text-orange-400" />
            Read Career Experiences
          </div>
          <div className="flex items-center gap-2 text-sm sm:text-base">
            <FaCommentDots className="w-4 h-4 text-orange-400" />
            Ask Questions
          </div>
        </div>
      </section>

      {/* 👤 Profile Cards */}
      {profiles.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400 text-base">
          No public profiles found yet.
        </div>
      ) : (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {profiles.map((profile) => (
            <Link
              key={profile._id}
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
          ))}
        </section>
      )}
    </main>
  );
}
