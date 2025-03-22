import Post from '../../../../lib/models/post.model.jsx';
import { connect } from '../../../../lib/mongodb/mongoose.jsx';
import { currentUser } from '@clerk/nextjs/server';

export const PUT = async (req) => {
  const user = await currentUser();

  try {
    await connect();
    const data = await req.json();

    console.log("🛠️ Update request data:", data);

    // 🛡️ Auth check
    if (
      !user ||
      user.publicMetadata.userMongoId !== data.userMongoId ||
      user.publicMetadata.isAdmin !== true
    ) {
      return new Response('Unauthorized', { status: 401 });
    }

    // 🧠 Normalize categories
    const updatedCategories = Array.isArray(data.categories)
      ? data.categories
      : data.category
      ? [data.category]
      : [];

    // 📝 Update the post
    const updatedPost = await Post.findByIdAndUpdate(
      data.postId,
      {
        $set: {
          title: data.title,
          content: data.content,
          image: data.image,
          categories: updatedCategories,
        },
      },
      { new: true } // Return updated document
    );

    if (!updatedPost) {
      return new Response('Post not found', { status: 404 });
    }

    return new Response(JSON.stringify(updatedPost), {
      status: 200,
    });
  } catch (error) {
    console.error('🔥 Error updating post:', error);
    return new Response('Error updating post', { status: 500 });
  }
};
