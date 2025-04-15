// ✅ Static Metadata (SEO-Friendly)
export const metadata = {
  title: 'Experience Book - Real Stories',
  description: 'Read inspiring real-life career experiences from real people.',
};

// ✅ Dynamic config
export const dynamicSetting = 'force-dynamic';

import Image from 'next/image';
import { notFound } from 'next/navigation';
import LikeButton from '@/app/components/LikeButton';
import ShareButton from '@/app/components/ShareButton';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// ✅ Lazy load heavy components
const PostTabs = dynamic(() => import('@/app/components/PostTabs'), {
  loading: () => <div className="p-6">Loading post content...</div>,
});
const RecentPosts = dynamic(() => import('@/app/components/RecentPosts'), {
  loading: () => <div className="p-6">Loading related posts...</div>,
});

export default async function PostPage({ params }) {
  const slug = params?.slug;
  if (!slug) notFound();

  let post;

  try {
    const response = await fetch(`${process.env.URL}/api/post/get`, {
      method: 'POST',
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug }),
    });

    const data = await response.json();
    post = data?.posts?.[0];
  } catch (error) {
    console.error('❌ Error fetching post:', error);
  }

  if (!post) notFound();

  return (
    <main className="px-4 pb-10 max-w-6xl mx-auto">
      {/* 👤 Profile Header Section */}
      <section className="flex flex-col items-center text-center py-10 border-b border-gray-200 dark:border-gray-800">
        {/* 🖼 User Avatar from Profile */}
        <div className="w-24 h-24 relative rounded-full overflow-hidden border-4 border-orange-400 shadow mb-3">
          <Image
            src={post.authorAvatar || '/default-avatar.png'}
            alt={post.author}
            fill
            className="object-cover"
            placeholder="blur"
            blurDataURL="/placeholder.jpg"
          />
        </div>

        {/* 🔤 Name & Role */}
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          {post.author}
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {post.jobTitle} • {post.location}
        </p>

        {/* 🏷️ Industry + Post Tags */}
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <span className="text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded-full font-medium dark:bg-blue-900/20 dark:text-blue-300">
            {post.industry}
          </span>
          {post.tags?.map((tag, i) => (
            <Link key={i} href={`/search?tag=${tag}`}>
              <span className="text-xs bg-orange-100 text-orange-600 px-3 py-1 rounded-full font-semibold hover:bg-orange-200 dark:bg-orange-900/30 dark:text-orange-400 cursor-pointer transition">
                {tag}
              </span>
            </Link>
          ))}
        </div>

        {/* 💬 Meta Info */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-gray-500 dark:text-gray-400">
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          <span>{(post.content?.length / 1000).toFixed(0)} mins read</span>
          {post.language && (
            <span className="flex items-center gap-1">
              🌍 {post.language.toUpperCase()}
            </span>
          )}
          <LikeButton postId={post._id} initialLikes={post.likes || 0} />
          <ShareButton title={post.title} likes={post.likes} avatar={post.image} />
        </div>
      </section>

      {/* 📝 Main Content Tabs (Overview / Comments / Questions) */}
      <PostTabs
        content={post.content}
        postId={post._id}
        postAuthorId={post.userId}
        image={post.image}
      />

      {/* 📰 Recent/Related Posts */}
      <div className="mt-14 px-4">
        <RecentPosts limit={3} />
      </div>
    </main>
  );
}
