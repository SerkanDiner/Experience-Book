import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getUserProfileByUsername } from '@/lib/actions/userProfile';
import Link from 'next/link';
import { UserCircle, Briefcase } from 'lucide-react';
import UserTabs from './UserTabs'; // ✅ Regular import, no dynamic

export const metadata = {
  title: 'User Profile – Experience Book',
  description: 'Discover real-life stories and professional journeys shared by our community.',
};

export const dynamicSetting = 'force-dynamic';

export default async function UserPublicPage({ params }) {
  const username = params?.userPublicPage;
  if (!username) notFound();

  const data = await getUserProfileByUsername(username);
  if (!data) notFound();

  const user = data.user;
  const posts = (data.posts || []).map((post) => ({
    ...post,
    _id: post._id.toString(),
    createdAt: post.createdAt?.toString(),
  }));
  const gamification = data.gamification;

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      {/* 🧍‍♂️ User Info Card */}
      <section className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-6 mb-10">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-orange-400 shadow-md">
            <Image
              src={user.profilePicture || '/default-avatar.png'}
              alt={user.firstName || 'User avatar'}
              fill
              className="object-cover"
              placeholder="blur"
              blurDataURL="/placeholder.jpg"
            />
          </div>

          <div className="text-center sm:text-left">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <UserCircle className="w-5 h-5 text-orange-500" />
              @{user.username}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              <Briefcase className="inline w-4 h-4 mr-1" />
              {user.jobTitle} • {user.profile?.country} • {user.profile?.industry}
            </p>
            {user.profile?.languages?.length > 0 && (
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                🌐 {user.profile.languages.join(', ')}
              </p>
            )}
            {user.profile?.bio && (
              <p className="text-sm text-gray-700 dark:text-gray-300 mt-2 italic">
                "{user.profile.bio}"
              </p>
            )}
            {user.profile?.website && (
              <Link
                href={user.profile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-orange-500 hover:underline mt-2 inline-block"
              >
                🔗 {user.profile.website.replace(/^https?:\/\//, '')}
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* 🧭 Tabs Component (Client) */}
      <section className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-6">
        <UserTabs posts={posts} gamification={gamification} />
      </section>
    </main>
  );
}
