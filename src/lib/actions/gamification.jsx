import UserGamification from "@/lib/models/userGamification.model";
import { connect } from "@/lib/mongodb/mongoose";

/**
 * Fetch gamification details for a user
 * @param {String} userId
 * @returns {Object|null}
 */
export async function getUserGamification(userId) {
  try {
    await connect();

    const gamification = await UserGamification.findOne({ userId }).lean();
    return gamification;
  } catch (error) {
    console.error("❌ Error fetching user gamification:", error);
    return null;
  }
}
