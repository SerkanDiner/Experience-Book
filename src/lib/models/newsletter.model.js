import mongoose from 'mongoose';

const NewsletterSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },

    // Optional name for public display
    name: { type: String, default: '' },
    avatar: { type: String, default: '' },

    // Feedback system
    feedback: { type: String, default: '', maxlength: 1000 },
    category: {
      type: String,
      enum: ['praise', 'suggestion', 'feature-request', 'bug', 'other'],
      default: 'other'
    },
    rating: { type: Number, min: 1, max: 5, default: null },

    // Controls homepage visibility (manually approved)
    showOnHomepage: { type: Boolean, default: false },
    approved: { type: Boolean, default: false },

    // Admin notes (internal only)
    adminNotes: { type: String, default: '' }
  },
  {
    timestamps: true,
  }
);

const Newsletter =
  mongoose.models.Newsletter || mongoose.model('Newsletter', NewsletterSchema);

export default Newsletter;
