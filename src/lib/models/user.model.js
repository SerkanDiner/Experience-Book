import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    clerkId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    profilePicture: { type: String, default: '' },
    isAdmin: { type: Boolean, default: false },
    xp: { type: Number, default: 0 } // Only track total XP
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;