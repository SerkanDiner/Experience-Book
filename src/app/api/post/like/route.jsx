import { connect } from '@/lib/mongodb/mongoose';
import Post from '@/lib/models/post.model';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get('postId');

    if (!postId) return Response.json({ message: 'Post ID is required' }, { status: 400 });

    await connect();
    const post = await Post.findById(postId);
    if (!post) return Response.json({ message: 'Post not found' }, { status: 404 });

    return Response.json({ likes: post.likes || 0 });
  } catch (error) {
    return Response.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { postId, method } = await req.json();

    if (!postId || !['like', 'unlike'].includes(method)) {
      return Response.json({ message: 'Invalid request' }, { status: 400 });
    }

    await connect();
    const post = await Post.findById(postId);
    if (!post) return Response.json({ message: 'Post not found' }, { status: 404 });

    post.likes = post.likes || 0;
    if (method === 'like') post.likes += 1;
    if (method === 'unlike' && post.likes > 0) post.likes -= 1;

    await post.save();
    return Response.json({ message: 'Updated', likes: post.likes });
  } catch (error) {
    return Response.json({ message: 'Server error' }, { status: 500 });
  }
}
