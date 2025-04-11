import { connect } from '@/lib/mongodb/mongoose';
import Newsletter from '@/lib/models/newsletter.model';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    await connect();

    const body = await req.json();
    const { email, feedback } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    const existing = await Newsletter.findOne({ email });
    if (existing) {
      return NextResponse.json({ message: 'You are already subscribed!' }, { status: 200 });
    }

    const newEntry = await Newsletter.create({ email, feedback });

    return NextResponse.json({ message: 'Subscribed successfully!', data: newEntry }, { status: 201 });
  } catch (error) {
    console.error('Newsletter API Error:', error);
    return NextResponse.json({ error: 'Something went wrong on the server' }, { status: 500 });
  }
}
