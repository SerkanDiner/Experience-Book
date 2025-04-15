import mongoose from 'mongoose';

const userGamificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },

    // XP, Level & Rank
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    rank: { type: String, default: 'Apprentice' },

    // Achievements
    badges: { type: [String], default: [] },
    certifications: { type: [String], default: [] },

    // Activity-based metrics
    completedTasks: { type: Number, default: 0 },
    joinedChallenges: { type: [String], default: [] },
    writingStreak: { type: Number, default: 0 },

    // Long-term progress tracking
    goals: { type: [String], default: [] },
    milestonesAchieved: { type: [String], default: [] },
  },
  { timestamps: true }
);

const UserGamification =
  mongoose.models.UserGamification ||
  mongoose.model('UserGamification', userGamificationSchema);

export default UserGamification;
