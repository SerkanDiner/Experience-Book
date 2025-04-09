import mongoose from "mongoose";

const VideoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  url: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Video || mongoose.model("Video", VideoSchema);
