import Post from '../../../../lib/models/post.model.jsx';
import { connect } from '../../../../lib/mongodb/mongoose.jsx';
import { currentUser } from '@clerk/nextjs/server';

export const POST = async (req) => {
  const user = await currentUser();
  try {
    await connect();
    const data = await req.json();

    console.log("🟢 Incoming post data:", data);

    if (
      !user ||
      user.publicMetadata.userMongoId !== data.userMongoId ||
      user.publicMetadata.isAdmin !== true
    ) {
      return new Response('Unauthorized', {
        status: 401,
      });
    }

    const slug = data.title
      .split(' ')
      .join('-')
      .toLowerCase()
      .replace(/[^a-zA-Z0-9-]/g, '');

    const newPost = await Post.create({
      userId: user.publicMetadata.userMongoId,
      content: data.content,
      title: data.title,
      image: data.image,
      categories: Array.isArray(data.categories)
        ? data.categories
        : data.category
        ? [data.category]
        : [],
      slug,
    });

    await newPost.save();

    return new Response(JSON.stringify(newPost), {
      status: 200,
    });
  } catch (error) {
    if (error.code === 11000 && error.keyPattern?.title) {
      return new Response('A post with this title already exists.', {
        status: 400,
      });
    }

    console.log('Error creating post:', error);
    return new Response('Error creating post', {
      status: 500,
    });
  }
};
