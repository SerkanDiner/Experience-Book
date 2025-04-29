import { currentUser } from '@clerk/nextjs/server';
import { connect } from '@/lib/mongodb/mongoose';
import User from '@/lib/models/user.model';
import Profile from '@/lib/models/profile.model';
import { NextResponse } from 'next/server';

// POST – Create profile
export const POST = async (req) => {
  const user = await currentUser();

  try {
    await connect();
    const data = await req.json();

    if (!user || !user.publicMetadata?.userMongoId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userId = user.publicMetadata.userMongoId;

    const existingProfile = await Profile.findOne({ user: userId });
    if (existingProfile) {
      return NextResponse.json(
        { message: 'Profile already exists. Use PATCH to update.' },
        { status: 409 }
      );
    }

    const userRecord = await User.findById(userId);
    if (!userRecord || !userRecord.username) {
      return NextResponse.json({ message: 'Username not found for user' }, { status: 400 });
    }

    const slug = userRecord.username.toLowerCase();

    const requiredFields = ['name', 'industry', 'language', 'jobTitle', 'bio'];
    const missingFields = requiredFields.filter(field => !data[field]);
    if (missingFields.length > 0) {
      return NextResponse.json(
        { message: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    const newProfile = await Profile.create({
      user: userId,
      name: data.name.trim(),
      slug,
      industry: data.industry,
      language: {
        code: data.language,
        label: {
          en: 'English',
          tr: 'Turkish',
          es: 'Spanish',
          fr: 'French',
          de: 'German'
        }[data.language] || 'English'
      },
      jobTitle: data.jobTitle.trim(),
      bio: data.bio.trim(),
      isPublic: data.isPublic || false,
      socialLinks: data.socialLinks || {}
    });

    await User.findByIdAndUpdate(userId, { profile: newProfile._id });

    return NextResponse.json(
      { message: 'Profile created successfully', profile: newProfile },
      { status: 201 }
    );

  } catch (error) {
    console.error('❌ Error creating profile:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
};


export const DELETE = async () => {
  const user = await currentUser();

  try {
    await connect();

    if (!user || !user.publicMetadata?.userMongoId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userId = user.publicMetadata.userMongoId;

    // Delete the profile
    const deleted = await Profile.findOneAndDelete({ user: userId });

    if (!deleted) {
      return NextResponse.json({ message: 'Profile not found' }, { status: 404 });
    }

    // Remove reference from the user model if you have it
    await User.findByIdAndUpdate(userId, { $unset: { profile: "" } });

    return NextResponse.json({ message: 'Profile deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('❌ Error deleting profile:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
};




// PATCH – Update profile
export const PATCH = async (req) => {
  const user = await currentUser();

  try {
    await connect();
    const data = await req.json();

    if (!user || !user.publicMetadata?.userMongoId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userId = user.publicMetadata.userMongoId;

    const userRecord = await User.findById(userId);
    if (!userRecord || !userRecord.username) {
      return NextResponse.json({ message: 'Username not found for user' }, { status: 400 });
    }

    const slug = userRecord.username.toLowerCase();

    const updatedProfile = await Profile.findOneAndUpdate(
      { user: userId },
      {
        name: data.name?.trim(),
        slug,
        industry: data.industry,
        language: data.language && {
          code: data.language,
          label: {
            en: 'English',
            tr: 'Turkish',
            es: 'Spanish',
            fr: 'French',
            de: 'German'
          }[data.language] || 'English'
        },
        jobTitle: data.jobTitle?.trim(),
        bio: data.bio?.trim(),
        isPublic: data.isPublic,
        socialLinks: data.socialLinks || {}
      },
      { new: true }
    );

    if (!updatedProfile) {
      return NextResponse.json({ message: 'Profile not found' }, { status: 404 });
    }

    return NextResponse.json(
      { message: 'Profile updated successfully', profile: updatedProfile },
      { status: 200 }
    );

  } catch (error) {
    console.error('❌ Error updating profile:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
};

// ✅ GET – Fetch current user's profile
export const GET = async () => {
  const user = await currentUser();

  try {
    await connect();

    if (!user || !user.publicMetadata?.userMongoId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userId = user.publicMetadata.userMongoId;
    const profile = await Profile.findOne({ user: userId });

    if (!profile) {
      return NextResponse.json({ message: 'Profile not found' }, { status: 404 });
    }

    return NextResponse.json(profile, { status: 200 });
  } catch (error) {
    console.error('❌ Error fetching profile:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
};
