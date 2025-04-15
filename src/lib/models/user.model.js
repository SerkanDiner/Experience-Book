import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    clerkId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, unique: true },
    firstName: { type: String },
    lastName: { type: String },
    profilePicture: { type: String, default: '' },
    isAdmin: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    betaTester: { type: Boolean, default: false },
    featureFlags: {
      type: Map,
      of: Boolean,
      default: {}
    },

    // 🆕 Optional additions:
    preferredLanguage: { type: String, default: 'en' },
    lastSignIn: { type: Date, default: Date.now },
    bio: { type: String, maxlength: 500, default: '' },
    accountStatus: {
      type: String,
      enum: ['active', 'suspended', 'deleted'],
      default: 'active',
    },
  },
  { timestamps: true }
);


const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
