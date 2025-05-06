import { NextResponse } from 'next/server';
import { connect } from '@/lib/mongodb/mongoose';
import Question from '@/lib/models/question.model';
import Profile from '@/lib/models/profile.model';
import User from '@/lib/models/user.model';

export async function PATCH(req) {
  try {
    const { questionId, answer, answererId } = await req.json();

    if (!questionId || !answer || !answererId) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    await connect();

    const question = await Question.findById(questionId);
    if (!question) {
      return NextResponse.json({ message: 'Question not found' }, { status: 404 });
    }

    const profile = await Profile.findById(question.profileId);
    const user = await User.findOne({ clerkId: answererId });

    const isProfileOwner = profile?.clerkId === answererId;
    const isAdmin = user?.isAdmin === true;

    if (!isProfileOwner && !isAdmin) {
      return NextResponse.json({ message: 'Unauthorized to answer this question' }, { status: 403 });
    }

    question.answer = answer;
    question.isAnswered = true;
    await question.save();

    return NextResponse.json({ message: 'Answer saved successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error saving answer:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
