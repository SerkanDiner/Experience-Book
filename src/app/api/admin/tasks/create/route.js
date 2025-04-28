import { currentUser } from '@clerk/nextjs/server';
import { connect } from '@/lib/mongodb/mongoose';
import User from '@/lib/models/user.model';
import Task from '@/lib/models/task.model';
import { NextResponse } from 'next/server';

export const POST = async (req) => {
  const user = await currentUser();

  try {
    await connect();
    const data = await req.json();

    if (!user || !user.id || !user.publicMetadata?.isAdmin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const clerkId = user.id; // 🛠️ get Clerk ID properly

    const mongoUser = await User.findOne({ clerkId });
    if (!mongoUser) {
      return NextResponse.json({ message: 'User not found in database' }, { status: 404 });
    }

    if (!mongoUser.isAdmin) {
      return NextResponse.json({ message: 'Forbidden: Admins only' }, { status: 403 });
    }

    const newTask = await Task.create({
      category: data.category,
      question: data.question,
      xp: data.xp,
      createdBy: clerkId,
      isActive: true,
    });

    return NextResponse.json(newTask, { status: 201 });

  } catch (error) {
    console.error('❌ Error creating task:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
};
