import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    jobTitle: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },

    title: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    summary: { type: String, maxlength: 300, default: '' },
    content: { type: String, required: true },
    image: { type: String, default: '' },

    industry: {
      type: String,
      required: true,
      enum: [
        'technology', 'food', 'hospitality', 'education', 'healthcare',
        'retail', 'construction', 'finance', 'transportation', 'arts',
        'legal', 'sports'
      ]

      


    },
    tags: { type: [String], default: [] },

    // 🌍 Language support
    language: {
      type: String,
      default: 'en',
      enum: ['en', 'tr', 'es', 'fr', 'de', 'ar', 'zh'], // extendable
    },

    // Engagement
    likes: { type: Number, default: 0 },
    likeUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    commentCount: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },

    // UX/SEO
    readingTime: { type: String, default: '3 min read' },

    // Admin/moderation
    isFeatured: { type: Boolean, default: false },
    reportCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Post = mongoose.models.Post || mongoose.model('Post', postSchema);
export default Post;
