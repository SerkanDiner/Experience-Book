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
    console.error('❌ POST Error:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await connect();
    const data = await req.json();

    // Validation
    if (!data.clerkId || !data.username || !data.firstName || !data.country || !data.jobTitle || !data.industry) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Fetch user by clerkId
    const user = await User.findOne({ clerkId: data.clerkId });
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Update core user fields
    user.username = data.username;
    user.firstName = data.firstName;
    user.lastName = data.lastName || '';
    user.profilePicture = user.profilePicture || ''; // fallback
    await user.save();

    // Prepare UserProfile fields
    const profileFields = {
      country: data.country,
      jobTitle: data.jobTitle,
      industry: data.industry,
      languages: data.languages || [],
      bio: data.bio || '',
      website: data.website || '',
    };

    // Update or create user profile
    await UserProfile.findOneAndUpdate(
      { userId: user._id },
      profileFields,
      { upsert: true, new: true }
    );

    return NextResponse.json({ message: '✅ Profile saved successfully' }, { status: 200 });
  } catch (err) {
    console.error('❌ PUT Error:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    await connect();
    const { searchParams } = new URL(req.url);
    const clerkId = searchParams.get('clerkId');

    if (!clerkId) {
      return NextResponse.json({ message: 'Missing Clerk ID' }, { status: 400 });
    }

    const user = await User.findOne({ clerkId });
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const profile = await UserProfile.findOne({ userId: user._id });

    return NextResponse.json({
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      profilePicture: user.profilePicture,
      profile,
    });
  } catch (err) {
    console.error('❌ GET Error:', err);
    return NextResponse.json({ message: 'Error fetching profile' }, { status: 500 });
  }
}
