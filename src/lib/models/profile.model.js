import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  clerkId: {
    type: String,
    required: true,
    unique: true // ✅ Allows matching current user via Clerk ID
  },
  name: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  industry: {
    type: String,
    enum: [
      'technology', 'food', 'hospitality', 'education', 'healthcare',
      'retail', 'construction', 'finance', 'transportation',
      'arts', 'legal', 'sports'
    ],
    required: true
  },
  language: {
    code: { 
      type: String, 
      enum: ['en', 'tr', 'es', 'fr', 'de'],
      required: true
    },
    label: { 
      type: String, 
      enum: ['English', 'Turkish', 'Spanish', 'French', 'German'],
      required: true
    }
  },
  jobTitle: {
    type: String,
    required: true
  },
  bio: {
    type: String,
    required: true
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  socialLinks: {
    linkedIn: String,
    twitter: String,
    github: String
  }
}, { timestamps: true });

// Indexes to prevent duplicates
profileSchema.index({ user: 1 }, { unique: true });
profileSchema.index({ slug: 1 }, { unique: true });
profileSchema.index({ clerkId: 1 }, { unique: true }); // ✅ ensure index

const Profile = mongoose.models.Profile || mongoose.model('Profile', profileSchema);
export default Profile;
