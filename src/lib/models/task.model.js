import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  category: { 
    type: String,
    required: true,
    enum: ['Writing', 'Reading', 'Watching', 'Community', 'Support']
  },
  question: { type: String, required: true },
  xp: { type: Number, required: true, min: 1 },
  createdBy: { 
    type: String,  // <-- 🔥 was ObjectId before, now String
    required: true 
  },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const Task = mongoose.models.Task || mongoose.model('Task', taskSchema);
export default Task;