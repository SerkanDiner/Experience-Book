import { NextResponse } from 'next/server';
import Comment from '@/lib/models/comment.model';
import { connect } from '@/lib/mongodb/mongoose';

// ✅ POST /api/comments
export async function POST(req) {
  try {
    await connect();

    const body = await req.json();
    const { postId, content } = body;

    if (!postId || !content) {
      return NextResponse.json({ message: 'Missing required fields.' }, { status: 400 });
    }

    const comment = await Comment.create({
      postId,
      content,
    });

    return NextResponse.json(comment, { status: 201 }); // Send comment back for instant update
  } catch (error) {
    console.error('❌ COMMENT POST ERROR:', error);
    return NextResponse.json({ message: 'Server error.' }, { status: 500 });
  }
}

// ✅ GET /api/comments?postId=xxx
export async function GET(req) {
  await connect();

  const { searchParams } = new URL(req.url);
  const postId = searchParams.get('postId');

  if (!postId) {
    return new Response(JSON.stringify([]), { status: 200 });
  }

  const comments = await Comment.find({ postId }).sort({ createdAt: -1 });

  return new Response(JSON.stringify(comments), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
