import { NextResponse } from 'next/server';
import { connect } from '@/lib/mongodb/mongoose';
import Question from '@/lib/models/question.model';

export async function PATCH(req) {
  try {
    const { questionId, answer } = await req.json();

    if (!questionId || !answer) {
      return NextResponse.json({ message: 'Missing question ID or answer' }, { status: 400 });
    }

    await connect();

    const question = await Question.findById(questionId);
    if (!question) {
      return NextResponse.json({ message: 'Question not found' }, { status: 404 });
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
