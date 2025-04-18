import { connect } from '@/lib/mongodb/mongoose';
import User from '@/lib/models/user.model';
import UserProfile from '@/lib/models/userProfile.model';

/**
 * Get all public user profiles (used for /users page) ss
 */
export async function getAllUserProfiles() {
  try {
    await connect();

    const profiles = await UserProfile.find({})
      .populate({
        path: 'userId',
        select: 'username firstName lastName profilePicture',
      })
      .sort({ createdAt: -1 })
      .lean();

    // Format the profiles to combine user and profile data
    return profiles.map((profile) => ({
      id: profile._id,
      jobTitle: profile.jobTitle,
      country: profile.country,
      industry: profile.industry,
      languages: profile.languages,
      bio: profile.bio,
      website: profile.website,
      createdAt: profile.createdAt,
      // From populated userId
      username: profile.userId?.username,
      firstName: profile.userId?.firstName,
      lastName: profile.userId?.lastName,
      profilePicture: profile.userId?.profilePicture,
    }));
  } catch (err) {
    console.error('❌ Error fetching user profiles:', err);
    return [];
  }
}
