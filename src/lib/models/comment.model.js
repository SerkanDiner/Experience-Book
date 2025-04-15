import mongoose from 'mongoose';

const replySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true, maxlength: 1000 },
  createdAt: { type: Date, default: Date.now }
});

const commentSchema = new mongoose.Schema(
  {
    postId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Post' },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    content: { type: String, required: true, maxlength: 1000 },

    // Like System
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    likeCount: { type: Number, default: 0 },

    // Author-only reply
    reply: {
      type: replySchema,
      default: null
    }
  },
  { timestamps: true }
);

const Comment = mongoose.models.Comment || mongoose.model('Comment', commentSchema);
export default Comment;
