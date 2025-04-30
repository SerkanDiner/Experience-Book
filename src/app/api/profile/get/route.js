// File: /api/profile/get/route.js

import { connect } from '@/lib/mongodb/mongoose';
import Profile from '@/lib/models/profile.model';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    await connect();
    const { slug } = await req.json();

    if (!slug) {
      return NextResponse.json({ message: 'Missing slug' }, { status: 400 });
    }

    // ✅ Populate 'user' and select only 'profilePicture'
    const profile = await Profile.findOne({ slug, isPublic: true })
      .populate('user', 'profilePicture')
      .lean();

    if (!profile) {
      return NextResponse.json({ message: 'Profile not found' }, { status: 404 });
    }

    // ✅ Add profilePicture from populated user field
    const result = {
      ...profile,
      profilePicture: profile.user?.profilePicture || null,
    };

    return NextResponse.json({ profile: result });
  } catch (error) {
    console.error('❌ Error fetching profile by slug:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
