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

    if (!user || !user.publicMetadata?.userMongoId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const isAdmin = user.publicMetadata?.isAdmin;
    const userId = user.publicMetadata.userMongoId;

    // ✅ Check if non-admin already has a profile
    if (!isAdmin) {
      const existing = await User.findOne({ userId });
      if (existing) {
        return NextResponse.json(
          { message: 'You have already created a Task' },
          { status: 403 }
        );
      }
    }

    

    // ✅ Create new Task
    const newTask = await Task.create({
        category: data.category,
        question: data.question,
        xp: data.xp,
        createdBy: clerkId, // Clerk ID as String
        isActive: true,
      });

      return NextResponse.json(newTask, { status: 201 });

  } catch (error) {
    console.error('❌ Error creating post:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
};
