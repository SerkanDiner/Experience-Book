import mongoose from 'mongoose';

const JobReviewSchema = new mongoose.Schema(
  {
    // Required fields
    jobTitle: { type: String, required: true },
    country: { type: String, required: true },
    monthlySalary: { type: Number, required: true },
    recommended: { type: Boolean, required: true }, // true = yes, false = no

    // XP system
    xp: { type: Number, default: 0 },
    agrees: { type: Number, default: 0 },
    disagrees: { type: Number, default: 0 }
  },
  {
    timestamps: true,
  }
);

const JobReview =
  mongoose.models.JobReview || mongoose.model('JobReview', JobReviewSchema);

export default JobReview;
