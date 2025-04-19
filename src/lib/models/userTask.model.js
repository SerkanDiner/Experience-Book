import mongoose from 'mongoose';

const userTaskSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  task: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Task', 
    required: true 
  },
  answer: { type: String, required: true },
  xpEarned: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'approved'], 
    default: 'pending' 
  }
}, { timestamps: true });

// Prevent duplicate task submissions
userTaskSchema.index({ user: 1, task: 1 }, { unique: true });

const UserTask = mongoose.models.UserTask || mongoose.model('UserTask', userTaskSchema);
export default UserTask;