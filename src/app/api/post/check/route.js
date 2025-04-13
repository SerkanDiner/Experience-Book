import { NextResponse } from 'next/server';
import Post from '@/lib/models/post.model';
import { connect } from '@/lib/mongodb/mongoose';

export async function GET(req) {
  await connect();

  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ message: 'Missing userId' }, { status: 400 });
  }

  try {
    const count = await Post.countDocuments({ userId });
    return NextResponse.json({ count }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: 'Error counting posts' }, { status: 500 });
  }
}
