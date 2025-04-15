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

function calculateReadingTime(text) {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
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
    <main className="px-4 pb-20 max-w-3xl mx-auto">
      <article className="prose dark:prose-invert max-w-none">

        {/* 🖼 Featured Image */}
        {post.image && (
          <div className="w-full h-64 sm:h-96 relative rounded-xl overflow-hidden mb-6">
            <Image
              src={post.image}
              alt={post.title || 'Post image'}
              fill
              className="object-cover"
              placeholder="blur"
              blurDataURL="/placeholder.jpg"
            />
          </div>
        )}

        {/* 📝 Title + Meta */}
        <header className="mb-10 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {post.title}
          </h1>

          {/* 🏷️ Tags */}
          <div className="flex flex-wrap justify-center gap-2 mb-4">
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

          {/* 📊 Meta */}
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
          <div className="flex justify-center items-center gap-3 mt-4">
            <div className="w-12 h-12 relative rounded-full overflow-hidden border-2 border-orange-400">
              <Image
                src={post.authorAvatar || '/default-avatar.png'}
                alt={post.author || 'Author avatar'}
                fill
                className="object-cover"
                placeholder="blur"
                blurDataURL="/placeholder.jpg"
              />
            </div>
            <div className="text-sm text-gray-700 dark:text-gray-300">
              <Link
                href={`/user/${post.username || ''}`}
                className="font-semibold text-orange-500 hover:underline"
              >
                {post.author}
              </Link>
              <p className="text-xs">
                {post.jobTitle} • {post.location}
              </p>
            </div>
          </div>
        </header>

        {/* 📖 Content */}
        <section
          className="prose dark:prose-invert prose-lg mx-auto"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        
      </article>

      {/* 📰 Related */}
      <div className="mt-20">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 text-center">
          More Stories
        </h2>
        <RecentPosts limit={3} />
      </div>
    </main>
  );
}
