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
import nextDynamic from 'next/dynamic'; // ✅ renamed to avoid conflict

import LikeButton from '@/app/components/LikeButton';
import ShareButton from '@/app/components/postComponents/ShareButton';

// ✅ Lazy load tabs and related content
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
    <main className="max-w-3xl mx-auto px-4 pb-20">
      <article className="bg-white dark:bg-gray-900 shadow-md rounded-2xl overflow-hidden">
        {/* 🖼 Post Image */}
        {post.image && (
          <div className="relative w-full h-64 sm:h-96">
          <Image
          src={post.image}
          alt={post.title} // ✅ Already correct!
          fill
          className="object-cover"
          placeholder="blur"
          blurDataURL="/placeholder.jpg"
        />

          </div>
        )}

        {/* 📝 Title & Tags */}
        <div className="px-6 py-8 sm:px-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4 text-center leading-snug">
            {post.title}
          </h1>

          {/* 🏷️ Tags */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            <span className="text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded-full font-medium dark:bg-blue-900/20 dark:text-blue-300">
              {post.industry}
            </span>
            {post.tags?.map((tag, i) => (
              <Link key={i} href={`/search?tag=${tag}`}>
                <span className="text-xs bg-orange-100 text-orange-600 px-3 py-1 rounded-full font-semibold hover:bg-orange-200 dark:bg-orange-900/30 dark:text-orange-400 transition cursor-pointer">
                  #{tag}
                </span>
              </Link>
            ))}
          </div>

          {/* 📊 Meta Info */}
          <div className="flex flex-wrap justify-center items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-6">
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            <span>{readingTime}</span>
            {post.language && (
              <span className="flex items-center gap-1">🌍 {post.language.toUpperCase()}</span>
            )}
            <LikeButton postId={post._id} initialLikes={post.likes || 0} />
            <ShareButton title={post.title} likes={post.likes} avatar={post.image} />
          </div>

          {/* 👤 Author Info */}
          <div className="flex justify-center items-center gap-3 mt-6">
            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-orange-400">
                  <Image
                src={post.profilePicture || '/default-avatar.png'}
                alt={post.author || 'Author avatar'} // ✅ Add this line!
                fill
                className="object-cover"
                placeholder="blur"
                blurDataURL="/placeholder.jpg"
              />

            </div>
            <div className="text-sm text-gray-700 dark:text-gray-300">
              <Link
                href={`/users/${post.username}`}
                className="font-semibold text-orange-500 hover:underline"
              >
                {post.author}
              </Link>
              <p className="text-xs">
                {post.jobTitle} • {post.location}
              </p>
            </div>
          </div>
        </div>

        {/* 📖 Article Content */}
        <section
          className="prose dark:prose-invert prose-lg px-6 sm:px-10 pb-12 max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>

      {/* 📰 Related Posts */}
      <div className="mt-20">
        <h2 className="text-xl font-bold text-center text-gray-800 dark:text-white mb-6">
          More Stories
        </h2>
        <RecentPosts limit={3} />
      </div>
    </main>
  );
}
