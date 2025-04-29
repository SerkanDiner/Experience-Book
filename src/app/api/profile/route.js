import { currentUser } from '@clerk/nextjs/server';
import { connect } from '@/lib/mongodb/mongoose';
import User from '@/lib/models/user.model';
import Profile from '@/lib/models/profile.model';
import { NextResponse } from 'next/server';

export const POST = async (req) => {
  const user = await currentUser();

  try {
    await connect();
    const data = await req.json();

    if (!user || !user.publicMetadata?.userMongoId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userId = user.publicMetadata.userMongoId;

    // Check if profile already exists
    const existingProfile = await Profile.findOne({ user: userId });
    if (existingProfile) {
      return NextResponse.json(
        { message: 'Profile already exists. Use PATCH to update.' },
        { status: 409 }
      );
    }

    // Get username from user model
    const userRecord = await User.findById(userId);
    if (!userRecord || !userRecord.username) {
      return NextResponse.json({ message: 'Username not found for user' }, { status: 400 });
    }

    const slug = userRecord.username.toLowerCase(); // ✅ Use username as slug

    // Validate required fields
    const requiredFields = ['name', 'industry', 'language', 'jobTitle', 'bio'];
    const missingFields = requiredFields.filter(field => !data[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { message: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Create new profile
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

    // Update user with profile ref
    await User.findByIdAndUpdate(userId, { profile: newProfile._id });

    return NextResponse.json(
      { message: 'Profile created successfully', profileId: newProfile._id, slug },
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

export const PATCH = async (req) => {
  const user = await currentUser();

  try {
    await connect();
    const data = await req.json();

    if (!user || !user.publicMetadata?.userMongoId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userId = user.publicMetadata.userMongoId;

    // Get username from user model
    const userRecord = await User.findById(userId);
    if (!userRecord || !userRecord.username) {
      return NextResponse.json({ message: 'Username not found for user' }, { status: 400 });
    }

    const slug = userRecord.username.toLowerCase(); // ✅ Use username as slug

    // Update profile
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
      return NextResponse.json(
        { message: 'Profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Profile updated successfully', profile: updatedProfile },
      { status: 200 }
    );

  } catch (error) {
    console.error('❌ Error updating profile:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
};
