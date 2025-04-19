// POST /api/user/tasks
import UserTask from '@/lib/models/userTask.model';
import User from '@/lib/models/user.model';
import { connect } from "@/lib/mongodb/mongoose";

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  
  const { userId, taskId, answer } = req.body;

  try {
    await connect();
    
    // Get task XP value
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    // Create completion record
    const userTask = new UserTask({
      user: userId,
      task: taskId,
      answer,
      xpEarned: task.xp,
      status: 'approved' // Auto-approve for simplicity
    });

    // Update user XP
    await User.findByIdAndUpdate(userId, { $inc: { xp: task.xp } });
    await userTask.save();

    res.status(201).json({ success: true, xpEarned: task.xp });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit task' });
  }
}