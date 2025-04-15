import UserNotification from "@/lib/models/userNotifications.model";

// Create a new notification for a user
export async function sendNotification({ userId, type, message }) {
  await UserNotification.create({
    userId,
    type,       // e.g., 'like', 'badge', 'reply', 'system'
    message,
    read: false
  });
}

// Mark a single notification as read
export async function markNotificationRead(notificationId) {
  await UserNotification.findByIdAndUpdate(notificationId, {
    read: true
  });
}

// Mark all as read for a user
export async function markAllNotificationsRead(userId) {
  await UserNotification.updateMany(
    { userId, read: false },
    { $set: { read: true } }
  );
}

// Fetch latest notifications for a user
export async function getUserNotifications(userId, limit = 10) {
  return await UserNotification.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
}
