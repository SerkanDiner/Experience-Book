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

    const existingUser = await User.findOne({ clerkId: clerkUser.id });

    const userData = {
      clerkId: clerkUser.id,
      email: clerkUser.email_addresses?.[0]?.email_address || '',
      username: clerkUser.username || '',
      profilePicture: clerkUser.image_url || '',
    };

    if (existingUser) {
      await User.updateOne({ clerkId: clerkUser.id }, { $set: userData });
      return existingUser;
    } else {
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
