import { connect } from '@/lib/mongodb/mongoose';
import User from '@/lib/models/user.model';
import UserProfile from '@/lib/models/userProfile.model';
import UserGamification from '@/lib/models/userGamification.model';
import Post from '@/lib/models/post.model';

/**
 * Get a user's full public profile by username.
 */
export async function getUserProfileByUsername(username) {
  try {
    await connect();

    const user = await User.findOne({ username }).select('-email -featureFlags -betaTester');
    if (!user) return null;

    const profile = await UserProfile.findOne({ userId: user._id }).lean();
    const gamification = await UserGamification.findOne({ userId: user._id }).lean();
    const posts = await Post.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .select('title slug summary image industry tags likes createdAt')
      .lean();

    return {
      user: {
        id: user._id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        profilePicture: user.profilePicture,
        isAdmin: user.isAdmin,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
        profile: profile
          ? {
              jobTitle: profile.jobTitle,
              country: profile.country,
              industry: profile.industry,
              languages: profile.languages,
              bio: profile.bio,
              website: profile.website,
            }
          : null,
      },
      gamification: gamification
        ? {
            level: gamification.level,
            xp: gamification.xp,
            badges: gamification.badges || [],
          }
        : null,
      posts,
    };
  } catch (err) {
    console.error('❌ Error in getUserProfileByUsername:', err);
    return null;
  }
}

/**
 * Get all user public profiles (used for /users page)
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

    return profiles.map((profile) => ({
      _id: profile._id,
      username: profile.userId?.username,
      firstName: profile.userId?.firstName,
      lastName: profile.userId?.lastName,
      profilePicture: profile.userId?.profilePicture,
      jobTitle: profile.jobTitle,
      country: profile.country,
      industry: profile.industry,
      languages: profile.languages,
      bio: profile.bio,
      website: profile.website,
      createdAt: profile.createdAt,
    }));
  } catch (err) {
    console.error('❌ Error in getAllUserProfiles:', err);
    return [];
  }
}
