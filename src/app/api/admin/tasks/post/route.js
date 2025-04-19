import { connect } from '@/lib/mongodb/mongoose';
import Task from '@/lib/models/task.model';
import { auth } from '@clerk/nextjs/server';

// 🔓 Anyone (even non-auth) can GET active tasks
export const GET = async () => {
  try {
    await connect();
    const tasks = await Task.find({ isActive: true }).sort({ createdAt: -1 });
    return new Response(JSON.stringify(tasks), { status: 200 });
  } catch (error) {
    return new Response('Failed to fetch tasks', { status: 500 });
  }
};

// 🔐 Only admins can POST new tasks
export const POST = async (request) => {
  const { userId, sessionClaims } = auth();

  if (!userId || !sessionClaims?.publicMetadata?.isAdmin) {
    return new Response('Unauthorized', { status: 403 });
  }

  const { category, question, xp } = await request.json();

  try {
    await connect();
    const newTask = new Task({
      category,
      question,
      xp,
      createdBy: userId,
    });

    await newTask.save();
    return new Response(JSON.stringify(newTask), { status: 201 });
  } catch (error) {
    return new Response('Failed to create task', { status: 500 });
  }
};

// 🔐 Only admins can DELETE tasks
export const DELETE = async (request) => {
  const { userId, sessionClaims } = auth();

  if (!userId || !sessionClaims?.publicMetadata?.isAdmin) {
    return new Response('Unauthorized', { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  try {
    await connect();
    await Task.findByIdAndDelete(id);
    return new Response('Task deleted successfully', { status: 200 });
  } catch (error) {
    return new Response('Failed to delete task', { status: 500 });
  }
};
