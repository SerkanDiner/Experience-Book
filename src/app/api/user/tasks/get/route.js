// GET /api/user/tasks
import Task from '@/lib/models/task.model';
import UserTask from '@/lib/models/userTask.model';
import { connect } from '@/lib/mongodb/mongoose';

export const GET = async (request) => {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
  
    try {
      await connect();
  
      // Get tasks the user has completed
      const completedTasks = await UserTask.find({ user: userId }).distinct('task');
  
      // Get all active tasks not yet completed
      const tasks = await Task.find({
        _id: { $nin: completedTasks },
        isActive: true,
      });
  
      return new Response(JSON.stringify(tasks), { status: 200 });
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Failed to fetch tasks' }), { status: 500 });
    }
  };
  