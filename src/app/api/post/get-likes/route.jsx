import { connect } from '@/lib/mongodb/mongoose';
import Post from '@/lib/models/post.model';

export async function POST(req) {
  try {
    await connect();
    const { postId } = await req.json();

    if (!postId) {
      return new Response(JSON.stringify({ message: 'Post ID is required' }), {
        status: 400,
      });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return new Response(JSON.stringify({ message: 'Post not found' }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify({ likes: post.likes }), { status: 200 });
  } catch (error) {
    console.error('GET LIKES API ERROR:', error);
    return new Response(JSON.stringify({ message: 'Server error' }), { status: 500 });
  }
}
