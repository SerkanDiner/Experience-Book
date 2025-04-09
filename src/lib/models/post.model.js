import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    author: { type: String, required: true, trim: true },
    jobTitle: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    title: { type: String, required: true, unique: true },
    image: { type: String, default: '' },
    categories: { type: [String], default: [] },
    summary: { type: String, maxlength: 300, default: '' },
    slug: { type: String, required: true, unique: true },
    likes: { type: Number, default: 0 },
    industry: {
      type: String,
      required: true,
      enum: [
        'technology', 'food', 'hospitality', 'education', 'healthcare',
        'retail', 'construction', 'finance', 'transportation', 'art',
        'legal', 'sport'
      ],
    },
  },
  { timestamps: true }
);

const Post = mongoose.models.Post || mongoose.model('Post', postSchema);
export default Post;
