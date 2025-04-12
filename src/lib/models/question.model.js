import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Post',
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
      default: '', // you can fill this when the post owner or admin replies
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
      type: [String], // userIds of those who liked the question
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.models.Question || mongoose.model('Question', questionSchema);
