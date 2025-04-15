import UserGamification from "@/lib/models/userGamification.model";
import UserStats from "@/lib/models/userStats.model";
import User from "@/lib/models/user.model";
import { connect } from "@/lib/mongodb/mongoose";

/**
 * Add XP to user and level up if needed.
 * @param {String} userId
 * @param {Number} amount
 */
export async function addXP(userId, amount) {
  const gamification = await UserGamification.findOne({ userId });

  if (!gamification) return;

  gamification.xp += amount;

  // Level up logic
  const xpToLevelUp = 100 * gamification.level;
  while (gamification.xp >= xpToLevelUp) {
    gamification.xp -= xpToLevelUp;
    gamification.level += 1;

    // Optional: Award badge for new level
    const levelBadge = `Level ${gamification.level}`;
    if (!gamification.badges.includes(levelBadge)) {
      gamification.badges.push(levelBadge);
    }
  }

  await gamification.save();
}

/**
 * Give the user a badge if they don’t already have it.
 * @param {String} userId
 * @param {String} badgeName
 */
export async function addBadge(userId, badgeName) {
  const gamification = await UserGamification.findOne({ userId });

  if (!gamification) return;

  if (!gamification.badges.includes(badgeName)) {
    gamification.badges.push(badgeName);
    await gamification.save();
  }
}

/**
 * Increment key engagement metrics for a user.
 * @param {String} userId
 * @param {'post' | 'comment' | 'likeReceived' | 'share' | 'view'} type
 */
export async function incrementStat(userId, type) {
  const stats = await UserStats.findOne({ userId });

  if (!stats) return;

  switch (type) {
    case "post":
      stats.postCount += 1;
      break;
    case "comment":
      stats.commentCount += 1;
      break;
    case "likeReceived":
      stats.totalLikesReceived += 1;
      break;
    case "share":
      stats.totalShares += 1;
      break;
    case "view":
      stats.totalViews += 1;
      break;
    default:
      break;
  }

  await stats.save();
}

/**
 * Update user's most liked or most viewed post.
 * @param {String} userId
 * @param {'liked' | 'viewed'} type
 * @param {String} postId
 */
export async function updateTopPost(userId, type, postId) {
  const stats = await UserStats.findOne({ userId });
  if (!stats) return;

  if (type === "liked") {
    stats.mostLikedPostId = postId;
  } else if (type === "viewed") {
    stats.mostViewedPostId = postId;
  }

  await stats.save();
}

/**
 * Create or update a user based on Clerk webhook data.
 * Used in webhooks like user.created, user.updated, etc.
 * @param {Object} clerkUser
 */
export async function createOrUpdateUser(clerkUser) {
  await connect();

  const existingUser = await User.findOne({ clerkId: clerkUser.id });

  const userData = {
    clerkId: clerkUser.id,
    email: clerkUser.email_addresses?.[0]?.email_address || '',
    username: clerkUser.username || '',
    firstName: clerkUser.first_name || '',
    lastName: clerkUser.last_name || '',
    profilePicture: clerkUser.image_url || '',
  };

  if (existingUser) {
    await User.updateOne({ clerkId: clerkUser.id }, { $set: userData });
    return existingUser;
  } else {
    const newUser = await User.create(userData);
    return newUser;
  }
}
