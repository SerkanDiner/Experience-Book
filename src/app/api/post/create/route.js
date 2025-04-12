import { currentUser } from '@clerk/nextjs/server';
import { connect } from '@/lib/mongodb/mongoose';
import Post from '@/lib/models/post.model';
import { NextResponse } from 'next/server';

export const POST = async (req) => {
  const user = await currentUser();

  try {
    await connect();
    const data = await req.json();

    if (!user || !user.publicMetadata?.userMongoId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const slug = data.title
      .toLowerCase()
      .split(' ')
      .join('-')
      .replace(/[^a-zA-Z0-9-]/g, '');

    const newPost = await Post.create({
      userId: user.publicMetadata.userMongoId,
      author: data.author?.trim(),
      jobTitle: data.jobTitle?.trim(),
      location: data.location?.trim(),
      summary: data.summary?.trim(),
      content: data.content,
      title: data.title,
      image: data.image,
      industry: data.industry,
      categories: Array.isArray(data.categories)
        ? data.categories
        : data.category
        ? [data.category]
        : [],
      slug,
    });

    return new Response(JSON.stringify(newPost), {
      status: 200,
    });
  } catch (error) {
    console.error('❌ Error creating post:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
};
