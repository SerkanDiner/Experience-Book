// ✅ Static Metadata (SEO-Friendly)
export const metadata = {
    title: 'User Profile – Experience Book',
    description: 'Discover real-life stories and professional journeys shared by our community.',
  };
  
  // ✅ Dynamic config
  export const dynamicSetting = 'force-dynamic';
  
  import Image from 'next/image';
  import { notFound } from 'next/navigation';
  import { getUserPublicProfile } from '@/lib/actions/user'; // 🔄 Ensure this includes profile info
  import { getUserGamification } from '@/lib/actions/gamification';
  import { getUserPosts } from '@/lib/actions/post';
  import PostCard from '@/app/components/PostCard';
  import Link from 'next/link';
  
  export default async function UserProfilePage({ params }) {
    const username = params?.username;
    if (!username) notFound();
  
    const user = await getUserPublicProfile(username); // includes User & UserProfile
    if (!user) notFound();
  
    const gamification = await getUserGamification(user._id);
    const posts = await getUserPosts(user._id);
  
    return (
      <main className="max-w-5xl mx-auto px-4 py-10">
        {/* 👤 User Header */}
        <section className="text-center mb-12">
          <div className="w-24 h-24 mx-auto relative rounded-full overflow-hidden border-4 border-orange-400 shadow-md">
            <Image
              src={user.profilePicture || '/default-avatar.png'}
              alt={user.firstName || 'User avatar'}
              fill
              className="object-cover"
              placeholder="blur"
              blurDataURL="/placeholder.jpg"
            />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">@{user.username}</h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            {user.firstName} {user.lastName}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {user.jobTitle} • {user.profile?.country} • {user.profile?.industry}
          </p>
  
          {user.profile?.languages?.length > 0 && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              🌐 {user.profile.languages.join(', ')}
            </p>
          )}
  
          {user.profile?.bio && (
            <p className="text-sm text-gray-700 dark:text-gray-300 mt-4 italic max-w-lg mx-auto">
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
        </section>
  
        {/* 🏆 Gamification */}
        {gamification && (
          <section className="text-center mb-10">
            <p className="text-orange-500 font-bold text-lg">Level {gamification.level}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">XP: {gamification.xp}</p>
  
            {gamification.badges?.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 mt-2">
                {gamification.badges.map((badge, index) => (
                  <span
                    key={index}
                    className="text-xs bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full font-medium"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            )}
          </section>
        )}
  
        {/* 📝 Posts */}
        <section>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6 text-center">
            Shared Experience(s)
          </h2>
          {posts && posts.length > 0 ? (
            <div className="flex flex-wrap justify-center gap-4">
              {posts.map((post) => (
                <PostCard key={post._id} post={JSON.parse(JSON.stringify(post))} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 text-sm">
              This user hasn’t shared any stories yet.
            </p>
          )}
        </section>
      </main>
    );
  }
  