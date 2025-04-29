import { connect } from '@/lib/mongodb/mongoose';
import Profile from '@/lib/models/profile.model';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await connect();

    // Fetch all public profiles
    const profiles = await Profile.find({ isPublic: true })
      .select('name jobTitle industry slug') // Only return safe public data
      .lean();

    return NextResponse.json(profiles);
  } catch (error) {
    console.error('❌ Error fetching public profiles:', error);
    return NextResponse.json(
      { message: 'Failed to fetch public profiles' },
      { status: 500 }
    );
  }
}
