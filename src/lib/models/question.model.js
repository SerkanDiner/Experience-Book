import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema(
  {
    profileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    userId: {
      type: String, // Clerk user ID
      required: true,
    },
    userName: {
      type: String,
    },
    userAvatar: {
      type: String,
    },
    userEmail: {
      type: String,
    },
    question: {
      type: String,
      required: true,
      trim: true,
    },
    answer: {
      type: String,
      default: '',
    },
    isAnswered: {
      type: Boolean,
      default: false,
    },
    likes: {
      type: Number,
      default: 0,
    },
    likedBy: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.models.Question || mongoose.model('Question', questionSchema);
