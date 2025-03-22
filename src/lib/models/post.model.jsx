import mongoose from 'mongoose';
const postSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
      default:
        '',
    },
    categories: {
      type: [String],
      default: [],
    },
    summary: {
      type: String,
      maxlength: 300,
      default: '',
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);
const Post = mongoose.models.Post || mongoose.model('Post', postSchema);
export default Post;