// src/app/api/get-users/route.js
import { connect } from '@/lib/mongodb/mongoose'; // adjust path if needed
import User from '@/lib/models/user.model'; // your user model

export async function GET() {
  try {
    await connect();
    const users = await User.find({}, '-__v').lean(); 
    // '-__v' removes extra MongoDB field you don't need

    return new Response(JSON.stringify(users), { status: 200 });
  } catch (error) {
    console.error('Error fetching users:', error);
    return new Response('Failed to fetch users', { status: 500 });
  }
}
