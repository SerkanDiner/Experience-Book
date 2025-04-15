import { NextResponse } from 'next/server';
import { connect } from '@/lib/mongodb/mongoose';
import UserProfile from '@/lib/models/userProfile.model';

export async function POST(req) {
  try {
    await connect();
    const data = await req.json();

    // Basic validation
    if (!data.userId || !data.country || !data.jobTitle || !data.industry) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Check if profile exists
    const existing = await UserProfile.findOne({ userId: data.userId });
    if (existing) {
      await UserProfile.updateOne({ userId: data.userId }, { $set: data });
      return NextResponse.json({ message: 'Profile updated' }, { status: 200 });
    }

    await UserProfile.create(data);
    return NextResponse.json({ message: 'Profile created successfully' }, { status: 201 });
  } catch (err) {
    console.error('Error saving profile:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
