import mongoose from 'mongoose';

const userPreferencesSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },

    theme: {
      type: String,
      enum: ['light', 'dark', 'system'],
      default: 'light'
    },
    emailUpdates: { type: Boolean, default: true },


    // 🎯 New
     profileCompleted: { type: Boolean, default: false },

    // Optional future UX settings
    language: { type: String, default: 'en' },
    fontSize: { type: String, default: 'medium' }, // small, medium, large
    layoutMode: { type: String, default: 'default' }, // grid, list, card
  },
  { timestamps: true }
);

const UserPreferences =
  mongoose.models.UserPreferences || mongoose.model('UserPreferences', userPreferencesSchema);

export default UserPreferences;
