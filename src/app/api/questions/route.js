import { NextResponse } from 'next/server';
import { connect } from '@/lib/mongodb/mongoose';
import Question from '@/lib/models/question.model';

export async function POST(req) {
  try {
    // ✅ Safely parse JSON
    let body;
    try {
      body = await req.json();
    } catch (error) {
      console.error('❌ Invalid JSON format:', error);
      return NextResponse.json({ message: 'Invalid JSON format.' }, { status: 400 });
    }

    const {
      profileId,
      userId,
      userName,
      userAvatar,
      userEmail,
      question,
    } = body;

    console.log('📩 Incoming question payload:', { profileId, userId, question });

    // ✅ Validate required fields
    if (!profileId || !userId || !question?.trim()) {
      console.warn('❌ Missing required fields:', { profileId, userId, question });
      return NextResponse.json({
        message: 'Missing required fields: profileId, userId, and question are mandatory.',
      }, { status: 400 });
    }

    await connect();

    const newQuestion = new Question({
      profileId,
      userId,
      userName,
      userAvatar,
      userEmail,
      question: question.trim(),
    });

    const savedQuestion = await newQuestion.save();

    return NextResponse.json({ question: savedQuestion }, { status: 201 });

  } catch (error) {
    console.error('❌ Server error saving question:', error);
    return NextResponse.json({ message: 'Server error. Please try again later.' }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const profileId = searchParams.get('profileId');

    if (!profileId) {
      return NextResponse.json({ message: 'Profile ID is required.' }, { status: 400 });
    }

    await connect();

    const questions = await Question.find({ profileId }).sort({ createdAt: -1 });

    return NextResponse.json({ questions }, { status: 200 });
  } catch (error) {
    console.error('❌ Error fetching questions:', error);
    return NextResponse.json({ message: 'Server error. Please try again later.' }, { status: 500 });
  }
}
