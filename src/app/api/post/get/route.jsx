import Post from '@/lib/models/post.model.jsx';
import { connectToDB } from '@/lib/mongodb/mongoose.jsx';

export const POST = async (req) => {
  try {
    // ✅ Connect to MongoDB
    await connectToDB();

    const data = await req.json();

    // ✅ Pagination and sorting
    const startIndex = parseInt(data.startIndex) || 0;
    const limit = parseInt(data.limit) || 9;
    const sortDirection = data.order === 'asc' ? 1 : -1;

    // ✅ Query conditions
    const query = {
      ...(data.userId && { userId: data.userId }),
      ...(data.categories?.length > 0 && { categories: { $in: data.categories } }),
      ...(data.slug && { slug: data.slug }),
      ...(data.postId && { _id: data.postId }),
      ...(data.searchTerm && {
        $or: [
          { title: { $regex: data.searchTerm, $options: 'i' } },
          { content: { $regex: data.searchTerm, $options: 'i' } },
        ],
      }),
      status: 'approved', // ✅ Only fetch approved posts
    };

    // ✅ Get posts
    const posts = await Post.find(query)
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    // ✅ Get totals
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
