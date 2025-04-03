import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Post',
    },
    userEmail: String,
    content: String,
  },
  { timestamps: true }
);

export default mongoose.models.Comment || mongoose.model('Comment', commentSchema);
