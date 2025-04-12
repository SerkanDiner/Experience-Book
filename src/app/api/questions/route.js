import { NextResponse } from 'next/server';
import { connect } from '@/lib/mongodb/mongoose';
import Question from '@/lib/models/question.model';

// 📤 POST - Save a question
export async function POST(req) {
  try {
    const {
      postId,
      userId,
      userName,
      userAvatar,
      userEmail,
      question,
    } = await req.json();

    if (!postId || !userId || !question) {
      return NextResponse.json({ message: 'Missing required fields.' }, { status: 400 });
    }

    await connect();

    const newQuestion = new Question({
      postId,
      userId,
      userName,
      userAvatar,
      userEmail,
      question,
    });

    const savedQuestion = await newQuestion.save(); // ✅ Save and return the question

    return NextResponse.json({ question: savedQuestion }, { status: 201 }); // ✅ Send question back to frontend
  } catch (error) {
    console.error('Error saving question:', error);
    return NextResponse.json({ message: 'Server error.' }, { status: 500 });
  }
}

// 📥 GET - Fetch all questions for a specific post
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get('postId');

    if (!postId) {
      return NextResponse.json({ message: 'Post ID is required' }, { status: 400 });
    }

    await connect();

    const questions = await Question.find({ postId }).sort({ createdAt: -1 });

    return NextResponse.json({ questions }, { status: 200 });
  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
