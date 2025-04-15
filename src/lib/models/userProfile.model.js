import mongoose from 'mongoose';

const userProfileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },

    country: { type: String, required: true },
    jobTitle: { type: String, required: true },
    industry: {
      type: String,
      required: true,
      enum: [
        'technology', 'food', 'hospitality', 'education', 'healthcare',
        'retail', 'construction', 'finance', 'transportation', 'art',
        'legal', 'sport'
      ],
    },
    languages: { type: [String], default: [] },
    bio: { type: String, default: '', maxlength: 300 },
    website: { type: String, default: '' },
  },
  { timestamps: true }
);

const UserProfile =
  mongoose.models.UserProfile || mongoose.model('UserProfile', userProfileSchema);

export default UserProfile;
