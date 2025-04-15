import { connect } from '@/lib/mongodb/mongoose';
import User from '@/lib/models/user.model';
import UserGamification from '@/lib/models/userGamification.model';
import Post from '@/lib/models/post.model';

/**
 * Get full public profile data by username.
 * @param {string} username
 * @returns {object|null}
 */
export async function getUserProfileByUsername(username) {
  try {
    await connect();

    const user = await User.findOne({ username }).select('-email -featureFlags -betaTester');
    if (!user) return null;

    const gamification = await UserGamification.findOne({ userId: user._id });

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
    console.error('❌ Error fetching user profile:', err);
    return null;
  }
}

/**
 * Get all public user profiles (lightweight version)
 * Used for /users page
 */
export async function getAllUserProfiles() {
  try {
    await connect();

    const users = await User.find({})
      .select('username firstName lastName jobTitle profilePicture profile _id')
      .sort({ createdAt: -1 })
      .lean();

    return users;
  } catch (err) {
    console.error('❌ Error fetching user list:', err);
    return [];
  }
}
