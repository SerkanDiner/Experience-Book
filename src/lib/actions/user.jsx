import User from "@/lib/models/user.model";
import { connect } from "@/lib/mongodb/mongoose";

/**
 * Create or update a user based on Clerk webhook data.
 * Used in webhooks like user.created, user.updated, etc.
 * @param {Object} clerkUser
 */
export async function createOrUpdateUser(clerkUser) {
  try {
    await connect();

    const email = clerkUser.email_addresses?.[0]?.email_address || '';
    const username =
      clerkUser.username || email.split('@')[0] || `user-${Date.now()}`;
    const profilePicture = clerkUser.image_url || '';

    // 🔍 Find by Clerk ID or fallback to email if not found
    let existingUser =
      (await User.findOne({ clerkId: clerkUser.id })) ||
      (await User.findOne({ email }));

    const userData = {
      clerkId: clerkUser.id,
      email,
      username,
      profilePicture,
    };

    if (existingUser) {
      // 🔁 Update user (also make sure Clerk ID is synced in DB)
      await User.updateOne(
        { _id: existingUser._id },
        { $set: { ...userData } }
      );
      return existingUser;
    } else {
      // ✨ Create new user safely
      const newUser = await User.create(userData);
      return newUser;
    }
  } catch (error) {
    console.error("❌ Failed to create or update user:", error);
    throw new Error("User sync failed.");
  }
}

/**
 * Delete a user from MongoDB by Clerk ID
 * Used in webhooks like user.deleted
 * @param {string} clerkId
 */
export async function deleteUser(clerkId) {
  try {
    await connect();
    const result = await User.findOneAndDelete({ clerkId });

    if (!result) {
      console.warn(`⚠️ No user found with Clerk ID: ${clerkId}`);
    } else {
      console.log(`✅ User deleted: ${result.email}`);
    }

    return result;
  } catch (error) {
    console.error("❌ Failed to delete user:", error);
    throw new Error("User deletion failed.");
  }
}
