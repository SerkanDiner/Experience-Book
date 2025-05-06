import { NextResponse } from 'next/server';
import { connect } from '@/lib/mongodb/mongoose';
import Question from '@/lib/models/question.model';

export async function POST(req) {
  try {
    const {
      profileId,
      userId,
      userName,
      userAvatar,
      userEmail,
      question,
    } = await req.json();

    // Validate input
    if (!profileId || !userId || !question) {
      console.log('❌ Missing fields:', { profileId, userId, question });
      return NextResponse.json({ message: 'Missing required fields.' }, { status: 400 });
    }

    await connect();

    const newQuestion = new Question({
      profileId,
      userId,
      userName,
      userAvatar,
      userEmail,
      question,
    });

    const savedQuestion = await newQuestion.save();

    return NextResponse.json({ question: savedQuestion }, { status: 201 });
  } catch (error) {
    console.error('❌ Error saving question:', error);
    return NextResponse.json({ message: 'Server error.' }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const profileId = searchParams.get('profileId');

    if (!profileId) {
      return NextResponse.json({ message: 'Profile ID is required' }, { status: 400 });
    }

    await connect();

    const questions = await Question.find({ profileId }).sort({ createdAt: -1 });

    return NextResponse.json({ questions }, { status: 200 });
  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
