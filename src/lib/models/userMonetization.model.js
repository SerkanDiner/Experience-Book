import mongoose from 'mongoose';

const userMonetizationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },

    earnings: { type: Number, default: 0 }, // Total £ earned
    purchases: {
      type: [
        {
          item: { type: String }, // 'Boosted Post', 'Mentorship Pass'
          price: { type: Number },
          date: { type: Date, default: Date.now }
        }
      ],
      default: []
    },
    paidFeaturesUsed: { type: [String], default: [] }, // ['Boosted Post', 'Ad-Free']
  },
  { timestamps: true }
);

const UserMonetization =
  mongoose.models.UserMonetization || mongoose.model('UserMonetization', userMonetizationSchema);

export default UserMonetization;
