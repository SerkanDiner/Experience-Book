import Link from 'next/link';
import { connect } from '@/lib/mongodb/mongoose';
import Profile from '@/lib/models/profile.model';
import ProfileCard from '@/app/components/profile/ProfileCard'; // ✅ Import reusable card
import { FaUsers, FaCommentDots, FaEye, FaBriefcase } from 'react-icons/fa';

export const dynamic = 'force-dynamic';

export default async function ProfilesPage() {
  await connect();
  const rawProfiles = await Profile.find({ isPublic: true });
  const profiles = rawProfiles.map(profile => JSON.parse(JSON.stringify(profile)));


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
            <ProfileCard key={profile._id} profile={profile} />
          ))}
        </section>
      )}
    </main>
  );
}
