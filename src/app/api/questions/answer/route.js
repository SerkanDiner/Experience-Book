import { NextResponse } from 'next/server';
import { connect } from '@/lib/mongodb/mongoose';
import Question from '@/lib/models/question.model';

export async function PATCH(req) {
  try {
    const body = await req.json();
    const { questionId, answer } = body;

    // Validate required fields
    if (!questionId || typeof answer !== 'string' || !answer.trim()) {
      return NextResponse.json({ message: 'Invalid question ID or answer' }, { status: 400 });
    }

    await connect();

    const question = await Question.findById(questionId);
    if (!question) {
      return NextResponse.json({ message: 'Question not found' }, { status: 404 });
    }

    // Update answer
    question.answer = answer.trim();
    question.isAnswered = true;

    await question.save();

    return NextResponse.json({ message: 'Answer saved successfully' }, { status: 200 });
  } catch (error) {
    console.error('❌ Error saving answer:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
