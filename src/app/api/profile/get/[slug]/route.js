import { connect } from '@/lib/mongodb/mongoose';
import Profile from '@/lib/models/profile.model';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    await connect();

    const { slug } = params;

    if (!slug) {
      return NextResponse.json({ message: 'Missing slug' }, { status: 400 });
    }

    const profile = await Profile.findOne({ slug, isPublic: true }).lean();

    if (!profile) {
      return NextResponse.json({ message: 'Profile not found' }, { status: 404 });
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error('❌ Error fetching profile by slug:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
