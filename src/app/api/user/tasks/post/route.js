import { auth } from '@clerk/nextjs/server';
import UserTask from '@/lib/models/userTask.model';
import User from '@/lib/models/user.model';
import Task from '@/lib/models/task.model';
import { connect } from '@/lib/mongodb/mongoose';

export const POST = async (request) => {
  try {
    await connect();

    const { userId, taskId, answer } = await request.json();

    // ✅ Authenticate the user
    const { userId: authUserId } = auth();
    if (!authUserId || authUserId !== userId) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 403 });
    }

    // ✅ Validate task existence
    const task = await Task.findById(taskId);
    if (!task) {
      return new Response(JSON.stringify({ error: 'Task not found' }), { status: 404 });
    }

    // ✅ Create a UserTask entry
    const userTask = new UserTask({
      user: userId,
      task: taskId,
      answer,
      xpEarned: task.xp,
      status: 'approved',
    });

    // ✅ Update user XP
    await User.findByIdAndUpdate(userId, { $inc: { xp: task.xp } });
    await userTask.save();

    return new Response(JSON.stringify({ success: true, xpEarned: task.xp }), { status: 201 });
  } catch (error) {
    console.error('❌ Error submitting task:', error);
    return new Response(JSON.stringify({ error: 'Failed to submit task' }), { status: 500 });
  }
};
