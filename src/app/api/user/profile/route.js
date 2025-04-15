import { NextResponse } from 'next/server';
import { connect } from '@/lib/mongodb/mongoose';
import User from '@/lib/models/user.model';
import UserProfile from '@/lib/models/userProfile.model';

export async function POST(req) {
  try {
    await connect();
    const data = await req.json();

    if (!data.userId || !data.country || !data.jobTitle || !data.industry) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

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

export async function PUT(req) {
  try {
    await connect();
    const data = await req.json();

    const user = await User.findOne({ clerkId: data.clerkId });
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Update base user
    user.username = data.username;
    user.firstName = data.firstName;
    user.lastName = data.lastName;
    await user.save();

    // Update or create profile
    const updateData = {
      country: data.country,
      jobTitle: data.jobTitle,
      industry: data.industry,
      languages: data.languages,
      bio: data.bio,
      website: data.website,
    };

    await UserProfile.findOneAndUpdate(
      { userId: user._id },
      updateData,
      { upsert: true, new: true }
    );

    return NextResponse.json({ message: 'Profile saved' }, { status: 200 });
  } catch (err) {
    console.error('❌ PUT Error:', err);
    return NextResponse.json({ message: 'Error saving profile' }, { status: 500 });
  }
}
