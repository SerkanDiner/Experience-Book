import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  firstName: String,
  lastName: String,
  username: String,
  profilePicture: String,
  isAdmin: { type: Boolean, default: false },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
