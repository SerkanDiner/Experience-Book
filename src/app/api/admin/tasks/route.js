import { connect } from '@/lib/mongodb/mongoose';
import Task from '@/lib/models/task.model';
import { NextResponse } from 'next/server';

export const GET = async () => {
  try {
    await connect();

    const tasks = await Task.find({ isActive: true }).sort({ createdAt: -1 });

    return NextResponse.json(tasks, { status: 200 });

  } catch (error) {
    console.error('❌ Error fetching tasks:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
};
