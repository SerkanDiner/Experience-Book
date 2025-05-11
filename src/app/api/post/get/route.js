import Post from '@/lib/models/post.model.js';
import { connect } from '@/lib/mongodb/mongoose.js';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    await connect();

    const data = await req.json();
    const isAdmin = data.admin || false;

    const startIndex = parseInt(data.startIndex) || 0;
    const limit = parseInt(data.limit) || 9;
    const sortDirection = data.order === 'asc' ? 1 : -1;

    const query = {
      ...(isAdmin ? {} : data.userId && { userId: data.userId }),
      ...(data.categories?.length > 0 && { categories: { $in: data.categories } }),
      ...(data.slug && { slug: data.slug }),
      ...(data.postId && { _id: data.postId }),
      ...(data.searchTerm && {
        $or: [
          { title: { $regex: data.searchTerm, $options: 'i' } },
          { content: { $regex: data.searchTerm, $options: 'i' } },
        ],
      }),
    };

    const posts = await Post.find(query)
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalPosts = await Post.countDocuments(query);

    return new Response(JSON.stringify({ posts, totalPosts }), { status: 200 });
  } catch (error) {
    console.error('❌ Error in POST /api/post/get:', error);
    return new Response(JSON.stringify({ error: 'Error getting posts' }), { status: 500 });
  }
}

export async function GET(req) {
  try {
    await connect();

    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q') || '';
    const limit = parseInt(searchParams.get('limit')) || 12;

    const query = q
      ? {
          $or: [
            { title: { $regex: q, $options: 'i' } },
            { content: { $regex: q, $options: 'i' } },
          ],
        }
      : {};

    const posts = await Post.find(query)
      .sort({ updatedAt: -1 })
      .limit(limit);

    return new Response(JSON.stringify({ posts }), { status: 200 });
  } catch (error) {
    console.error('❌ Error in GET /api/post/get:', error);
    return new Response(JSON.stringify({ error: 'Error fetching posts' }), { status: 500 });
  }
}
