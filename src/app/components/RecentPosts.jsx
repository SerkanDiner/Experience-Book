import PostCard from './postComponents/PostCard';

export default async function RecentPosts({ limit = 3 }) {
  let posts = [];

  try {
    const response = await fetch(`${process.env.URL}/api/post/get`, {
      method: 'POST',
      body: JSON.stringify({ limit, order: 'desc' }),
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });

    const data = await response.json();
    posts = data?.posts || [];
  } catch (error) {
    console.error('❌ Error fetching recent posts:', error);
  }

  return (
    <div className="flex flex-col justify-center items-center mb-5">
      <h1 className="text-xl mt-5 font-semibold text-gray-800 dark:text-white">
        Recently Added Profiles
      </h1>

      <div className="flex flex-wrap gap-5 mt-5 justify-center">
        {posts.length > 0 ? (
          posts.map((post) => <PostCard key={post._id} post={post} />)
        ) : (
          <p className="text-gray-500 dark:text-gray-400 mt-4">No posts available at the moment.</p>
        )}
      </div>
    </div>
  );
}
