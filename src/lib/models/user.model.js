import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    // 🧑 Identity & Account Info
    clerkId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, unique: true },
    firstName: { type: String },
    lastName: { type: String },
    profilePicture: { type: String, default: '' },

    // 🛡️ System Roles
    isAdmin: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },

    // 🧪 Advanced Flags
    betaTester: { type: Boolean, default: false },
    featureFlags: {
      type: Map,
      of: Boolean,
      default: {}
    }
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
