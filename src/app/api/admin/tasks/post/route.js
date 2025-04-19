// app/api/admin/tasks/route.js
import { connect } from '@/lib/mongodb/mongoose';
import Task from '@/lib/models/task.model';


// get the task
export const GET = async (request) => {
  try {
    await connect();
    const tasks = await Task.find({ isActive: true }).sort({ createdAt: -1 });
    return new Response(JSON.stringify(tasks), { status: 200 });
  } catch (error) {
    return new Response('Failed to fetch tasks', { status: 500 });
  }
};


// submit the task
export const POST = async (request) => {
  const { category, question, xp, adminId } = await request.json();
  
  try {
    await connect();
    const newTask = new Task({
      category,
      question,
      xp,
      createdBy: adminId
    });
    
    await newTask.save();
    return new Response(JSON.stringify(newTask), { status: 201 });
  } catch (error) {
    return new Response('Failed to create task', { status: 500 });
  }
};


// delete the task
export const DELETE = async (request) => {
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