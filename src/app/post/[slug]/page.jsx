import CallToAction from '@/app/components/CallToAction';
import RecentPosts from '@/app/components/RecentPosts';
import { Button } from 'flowbite-react';
import Link from 'next/link';

export default async function PostPage({ params }) {
  let post = null;
  try {
    const result = await fetch(process.env.URL + '/api/post/get', {
      method: 'POST',
      body: JSON.stringify({ slug: params.slug }),
      cache: 'no-store',
    });
    const data = await result.json();
    post = data.posts[0];
  } catch (error) {
    post = { title: 'Failed to load post' };
  }

  if (!post || post.title === 'Failed to load post') {
    return (
      <main className='p-3 flex flex-col max-w-6xl mx-auto min-h-screen'>
        <h2 className='text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl'>
          Post not found
        </h2>
      </main>
    );
  }

  return (
    <main className='p-3 flex flex-col max-w-6xl mx-auto min-h-screen'>
      {/* Title */}
      <h1 className='text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl'>
        {post.title}
      </h1>

      {/* Categories */}
      <div className='flex flex-wrap gap-2 justify-center mt-3 mb-5'>
        {Array.isArray(post.categories) &&
          post.categories.map((category, index) => (
            <Link
              key={index}
              href={`/search?category=${category}`}
              className='self-center'
            >
              <Button color='gray' pill size='xs'>
                {category}
              </Button>
            </Link>
          ))}
      </div>

      {/* Image */}
      <img
        src={post.image}
        alt={post.title}
        className='mt-3 p-3 max-h-[600px] w-full object-cover rounded-lg shadow-md'
      />

      {/* Post Info */}
      <div className='flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs text-gray-600'>
        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        <span className='italic'>
          {(post.content?.length / 1000).toFixed(0)} mins read
        </span>
      </div>

      {/* Post Content */}
      <div
        className='p-3 max-w-2xl mx-auto w-full post-content leading-7 text-gray-800'
        dangerouslySetInnerHTML={{ __html: post?.content }}
      ></div>

      {/* Call to Action + Related Posts */}
      <div className='max-w-4xl mx-auto w-full mt-10'>
        <CallToAction />
      </div>

      <div className='mt-10'>
        <RecentPosts limit={3} />
      </div>
    </main>
  );
}
