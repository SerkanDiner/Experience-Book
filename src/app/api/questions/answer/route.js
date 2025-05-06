import { NextResponse } from 'next/server';
import { connect } from '@/lib/mongodb/mongoose';
import Question from '@/lib/models/question.model';

export async function PATCH(req) {
  try {
    const { questionId, answer, currentUserId } = await req.json();

    if (!questionId || !answer || !currentUserId) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    await connect();

    const question = await Question.findById(questionId);
    if (!question) {
      return NextResponse.json({ message: 'Question not found' }, { status: 404 });
    }

    // ✅ Check if currentUserId is allowed (admin or profile owner)
    if (question.profileId.toString() !== currentUserId) {
      return NextResponse.json({ message: 'You are not authorized to answer this question.' }, { status: 403 });
    }

    question.answer = answer;
    question.isAnswered = true;
    await question.save();

    return NextResponse.json({ message: 'Answer saved successfully' }, { status: 200 });
  } catch (error) {
    console.error('❌ Error saving answer:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
