import User from "@/lib/models/user.model";
import { connect } from "@/lib/mongodb/mongoose";

/**
 * Create or update a user in the database based on Clerk webhook data.
 */
export const createOrUpdateUser = async (
  id,
  first_name,
  last_name,
  image_url,
  email_addresses,
  username
) => {
  try {
    await connect();

    const email = email_addresses?.[0]?.email_address;
    if (!email) throw new Error("Missing email address from Clerk payload.");

    const updatedUser = await User.findOneAndUpdate(
      { clerkId: id },
      {
        $set: {
          firstName: first_name || "",
          lastName: last_name || "",
          profilePicture: image_url || "",
          email,
          username: username || email.split("@")[0],
        },
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );

    console.log("✅ User upserted:", updatedUser.clerkId);
    return updatedUser;
  } catch (error) {
    console.error("❌ createOrUpdateUser error:", error.message);
    return null;
  }
};

/**
 * Delete a user from the database by Clerk ID.
 */
export const deleteUser = async (id) => {
  try {
    await connect();
    const deleted = await User.findOneAndDelete({ clerkId: id });

    if (deleted) {
      console.log("🗑️ Deleted user:", id);
    } else {
      console.warn("⚠️ User not found for deletion:", id);
    }
  } catch (error) {
    console.error("❌ deleteUser error:", error.message);
  }
};
