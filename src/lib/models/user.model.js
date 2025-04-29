import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  profilePicture: { type: String, default: '' },
  isAdmin: { type: Boolean, default: false },
  xp: { type: Number, default: 0 },
  profile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile'
  }
}, { timestamps: true });

// Add this to automatically delete profile when user is deleted
userSchema.pre('remove', async function(next) {
  await mongoose.model('Profile').deleteOne({ user: this._id });
  next();
});

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;