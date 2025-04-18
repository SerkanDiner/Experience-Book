import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getAllUserProfiles } from '@/lib/actions/userProfile';
import Link from 'next/link';
import { UserCircle, Briefcase } from 'lucide-react';
import UserTabs from './UserTabs'; // ✅ Client tab component

export const metadata = {
  title: 'User Profile – Experience Book',
  description: 'Discover real-life stories and professional journeys shared by our community.',
};

export const dynamic = 'force-dynamic';

export default async function UserPublicPage({ params }) {
  const username = params?.userPublicPage;
  if (!username) notFound();

  const allUsers = await getAllUserProfiles();
  const user = allUsers.find((u) => u.username === username);
  if (!user) notFound();

  const posts = []; // Placeholder — no post data from getAllUserProfiles
  const gamification = null; // Placeholder — no XP data either

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
           
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              <UserCircle className="w-5 h-5 text-orange-500" />
              {user.firstName} {user.lastName}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              <Briefcase className="inline w-4 h-4 mr-1" />
              {user.jobTitle} • {user.country} • {user.industry}
            </p>
            {user.languages?.length > 0 && (
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                🌐 {user.languages.join(', ')}
              </p>
            )}
            {user.bio && (
              <p className="text-sm text-gray-700 dark:text-gray-300 mt-2 italic">
                "{user.bio}"
              </p>
            )}
            {user.website && (
              <Link
                href={user.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-orange-500 hover:underline mt-2 inline-block"
              >
                🔗 {user.website.replace(/^https?:\/\//, '')}
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* 🧭 Tabs Section (Client Component) */}
      <section className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-6">
        <UserTabs posts={posts} gamification={gamification} />
      </section>
    </main>
  );
}
