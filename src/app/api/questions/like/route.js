import { connect } from '@/lib/mongodb/mongoose';
import Question from '@/lib/models/question.model';
import { NextResponse } from 'next/server';

export async function PATCH(req) {
  try {
    const { questionId, userId } = await req.json();

    if (!questionId || !userId) {
      return NextResponse.json({ message: 'Missing data' }, { status: 400 });
    }

    await connect();
    const question = await Question.findById(questionId);
    if (!question) {
      return NextResponse.json({ message: 'Question not found' }, { status: 404 });
    }

    const hasLiked = question.likedBy.includes(userId);

    if (hasLiked) {
      // Unlike
      question.likedBy = question.likedBy.filter((id) => id !== userId);
      question.likes = Math.max(0, question.likes - 1);
    } else {
      // Like
      question.likedBy.push(userId);
      question.likes += 1;
    }

    await question.save();

    return NextResponse.json({
      likes: question.likes,
      likedBy: question.likedBy,
      message: hasLiked ? 'Unliked' : 'Liked',
    });
  } catch (error) {
    console.error('Error updating question like:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
