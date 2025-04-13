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

    const isAdmin = user.publicMetadata?.isAdmin;
    const userId = user.publicMetadata.userMongoId;

    // ✅ Check if non-admin already has a post
    if (!isAdmin) {
      const existing = await Post.findOne({ userId });
      if (existing) {
        return NextResponse.json(
          { message: 'You have already submitted a post. Only one post is allowed.' },
          { status: 403 }
        );
      }
    }

    // ✅ Create slug from title
    const slug = data.title
      .toLowerCase()
      .split(' ')
      .join('-')
      .replace(/[^a-zA-Z0-9-]/g, '');

    // ✅ Create new post
    const newPost = await Post.create({
      userId,
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

    return NextResponse.json({ slug }, { status: 201 });

  } catch (error) {
    console.error('❌ Error creating post:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
};
