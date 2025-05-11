// app/api/post/prev-next/route.js
import { connect } from '@/lib/mongodb/mongoose'; // Import your custom MongoDB connection
import Post from '@/lib/models/post.model'; // Import your Post model

export async function POST(request) {
  const { currentPostId } = await request.json();

  try {
    // Establish a connection to the MongoDB database
    await connect();

    // Fetch the previous post (based on _id and createdAt)
    const previousPost = await Post.find({ _id: { $lt: currentPostId } })
      .sort({ createdAt: -1 })
      .limit(1);

    // Fetch the next post (based on _id and createdAt)
    const nextPost = await Post.find({ _id: { $gt: currentPostId } })
      .sort({ createdAt: 1 })
      .limit(1);

    // Return the previous and next posts as JSON response
    return new Response(
      JSON.stringify({
        previous: previousPost[0] || null,
        next: nextPost[0] || null,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error fetching previous/next posts:', error);
    return new Response(
      JSON.stringify({ message: 'Error fetching previous/next post' }),
      { status: 500 }
    );
  }
}
