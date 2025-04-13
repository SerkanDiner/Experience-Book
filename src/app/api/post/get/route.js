import Post from '@/lib/models/post.model.js';
import { connect } from '@/lib/mongodb/mongoose.js';

export const POST = async (req) => {
  try {
    await connect();

    const data = await req.json();
    const isAdmin = data.admin || false;

    // Pagination and sorting
    const startIndex = parseInt(data.startIndex) || 0;
    const limit = parseInt(data.limit) || 9;
    const sortDirection = data.order === 'asc' ? 1 : -1;

    // Build the query
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

    console.log("📄 Final MongoDB query:", query);

    const posts = await Post.find(query)
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalPosts = await Post.countDocuments(query);

    const now = new Date();
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    const lastMonthPosts = await Post.countDocuments({
      ...query,
      createdAt: { $gte: oneMonthAgo },
    });

    return new Response(JSON.stringify({ posts, totalPosts, lastMonthPosts }), {
      status: 200,
    });

  } catch (error) {
    console.error('❌ Error getting posts:', error);
    return new Response(JSON.stringify({ error: 'Error getting posts' }), {
      status: 500,
    });
  }
};
