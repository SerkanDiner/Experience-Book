import Post from '../../../../lib/models/post.model.jsx';
import { connect } from '../../../../lib/mongodb/mongoose.jsx';

export const GET = async () => {
  try {
    await connect();

    const posts = await Post.find({}, 'categories'); // Fetch only the categories field

    const categorySet = new Set();

    posts.forEach((post) => {
      if (Array.isArray(post.categories)) {
        post.categories.forEach((cat) => {
          if (cat.trim()) categorySet.add(cat.trim());
        });
      }
    });

    const sortedCategories = Array.from(categorySet).sort();

    return new Response(JSON.stringify({ categories: sortedCategories }), {
      status: 200,
    });
  } catch (error) {
    console.error('❌ Error fetching categories:', error);
    return new Response('Error fetching categories', { status: 500 });
  }
};
