import { connect } from '@/lib/mongodb/mongoose';
import Task from '@/lib/models/task.model';
import { auth } from '@clerk/nextjs/server';

// 🔓 Anyone (even non-auth) can GET active tasks

export const POST = async (request) => {
    try {
      const { userId } = auth(request);
      if (!userId) {
        return new Response('Unauthorized', { status: 401 });
      }
  
      const { category, question, xp } = await request.json();
      
      await connect();
      
      const newTask = new Task({
        category,
        question,
        xp,
        createdBy: userId
      });
  
      await newTask.save();
      return new Response(JSON.stringify(newTask), { status: 201 });
    } catch (error) {
      console.error('Error creating task:', error);
      return new Response('Failed to create task', { status: 500 });
    }
  };
  
  export const GET = async (request) => {
    try {
      const { userId } = auth(request);
      if (!userId) {
        return new Response('Unauthorized', { status: 401 });
      }
  
      await connect();
      const tasks = await Task.find({ isActive: true, createdBy: userId })
                            .sort({ createdAt: -1 });
      return new Response(JSON.stringify(tasks), { status: 200 });
    } catch (error) {
      console.error('Error fetching tasks:', error);
      return new Response('Failed to fetch tasks', { status: 500 });
    }
  };
  
  export const DELETE = async (request) => {
    try {
      const { userId } = get(request);
      if (!userId) {
        return new Response('Unauthorized', { status: 401 });
      }
  
      const { searchParams } = new URL(request.url);
      const id = searchParams.get('id');
      
      await connect();
      const task = await Task.findOneAndUpdate(
        { _id: id, createdBy: userId },
        { isActive: false },
        { new: true }
      );
  
      if (!task) {
        return new Response('Task not found', { status: 404 });
      }
  
      return new Response('Task deleted successfully', { status: 200 });
    } catch (error) {
      console.error('Error deleting task:', error);
      return new Response('Failed to delete task', { status: 500 });
    }
  };
