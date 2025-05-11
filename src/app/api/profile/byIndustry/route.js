import { NextResponse } from 'next/server';
import { connect } from '@/lib/mongodb/mongoose';
import Profile from '@/lib/models/profile.model';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const industry = searchParams.get('industry');

  if (!industry) {
    return NextResponse.json([], { status: 400 });
  }

  await connect();
  const rawProfiles = await Profile.find({ isPublic: true, industry });
  const plainProfiles = rawProfiles.map((p) => JSON.parse(JSON.stringify(p)));

  return NextResponse.json(plainProfiles);
}
