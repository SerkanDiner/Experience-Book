import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    type: { type: String, required: true }, // e.g., 'like', 'badge', 'system'
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    date: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

const UserNotification =
  mongoose.models.UserNotification || mongoose.model('UserNotification', notificationSchema);

export default UserNotification;
