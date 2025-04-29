// ✅ Static Metadata
export const metadata = {
  title: 'Experience Book - Real Stories',
  description: 'Read inspiring real-life career experiences from real people.',
};

// ✅ Dynamic rendering for up-to-date content
export const dynamic = 'force-dynamic';

import Image from 'next/image';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import nextDynamic from 'next/dynamic';

import LikeButton from '@/app/components/LikeButton';
import ShareButton from '@/app/components/postComponents/ShareButton';

const RecentPosts = nextDynamic(() => import('@/app/components/RecentPosts'), {
  loading: () => <div className="p-6">Loading related posts...</div>,
});

function calculateReadingTime(text) {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  return `${Math.ceil(words / wordsPerMinute)} min read`;
}

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

  const readingTime = calculateReadingTime(post.content || '');

  return (
    <main className="max-w-5xl mx-auto px-4 pb-20">
      {/* 🧭 Breadcrumb */}
      <nav className="text-sm text-gray-500 dark:text-gray-400 my-6">
        <Link href="/" className="hover:underline">Home</Link> &gt;{' '}
        <Link href="/post" className="hover:underline">Experiences</Link> &gt;{' '}
        <span className="font-semibold">{post.title}</span>
      </nav>

      <article className="bg-white dark:bg-gray-900 shadow-lg rounded-2xl overflow-hidden">
        
        {/* 📝 Title and Meta Info */}
          <div className="bg-gradient-to-r from-orange-100 via-white to-orange-100 dark:from-orange-900 dark:via-gray-900 dark:to-orange-900 py-6 sm:py-10 px-5 text-center">
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 dark:text-white leading-snug mb-4 max-w-xl mx-auto">
              {post.title}
            </h1>

            {/* 🏷️ Meta Info */}
            <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3">
              <span className="flex items-center gap-1">📂 {post.industry}</span>
              <span>📅 {new Date(post.createdAt).toLocaleDateString()}</span>
              <span>⏱️ {readingTime}</span>
              {post.language && (
                <span>🌐 {post.language.toUpperCase()}</span>
              )}
            </div>

            {/* 👤 Author Info */}
            <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              Written by <span className="font-semibold">{post.author || "Experience Book Team"}</span> • {post.location || "London"}
            </div>
          </div>

          {/* 🖼 Post Image */}
          {post.image && (
            <div className="relative w-full h-48 sm:h-72 md:h-[400px] overflow-hidden">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover rounded-b-2xl shadow-inner"
                placeholder="blur"
                blurDataURL="/placeholder.jpg"
              />
            </div>
          )}


        {/* 📖 Article Content */}
        <section className="prose dark:prose-invert prose-lg px-6 sm:px-10 pt-10 pb-12 max-w-none relative">
          
          {/* 📤 Sticky Share Button */}
          <div className="hidden md:block sticky top-24 float-right ml-4">
            <ShareButton title={post.title} likes={post.likes} avatar={post.image} />
          </div>

          {/* ✍️ Introduction */}
          <h2 className="text-2xl font-bold mb-4">Introduction</h2>

          <div dangerouslySetInnerHTML={{ __html: post.content }} />

          {/* ❤️ Like Button */}
          <div className="mt-10 flex justify-center">
            <LikeButton postId={post._id} initialLikes={post.likes || 0} />
          </div>
        </section>
      </article>

      {/* 📰 Related Posts */}
      <div className="mt-20">
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">
          More Stories
        </h2>
        <RecentPosts limit={3} />
      </div>
    </main>
  );
}
