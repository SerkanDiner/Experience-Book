// GET /api/user/tasks
import Task from '@/lib/models/task.model';
import UserTask from '@/lib/models/userTask.model';
import { connect } from '@/lib/mongodb/mongoose';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  
  const { userId } = req.query;

  try {
    await connect();
    
    // Get tasks user hasn't completed
    const completedTasks = await UserTask.find({ user: userId }).distinct('task');
    const tasks = await Task.find({
      _id: { $nin: completedTasks },
      isActive: true
    });

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
}