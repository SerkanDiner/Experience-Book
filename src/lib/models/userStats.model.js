import mongoose from 'mongoose';

const userStatsSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },

    postCount: { type: Number, default: 0 },
    commentCount: { type: Number, default: 0 },
    totalLikesReceived: { type: Number, default: 0 },
    totalViews: { type: Number, default: 0 },
    totalShares: { type: Number, default: 0 },

    mostLikedPostId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
    mostViewedPostId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' }
  },
  { timestamps: true }
);

const UserStats =
  mongoose.models.UserStats || mongoose.model('UserStats', userStatsSchema);

export default UserStats;
