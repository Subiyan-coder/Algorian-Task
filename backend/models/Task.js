const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  status: { type: String,
     enum: ['pending', 'in-progress', 'completed', 'unable-to-complete'], default: 'pending' },
  remarks: { type: String, default: '' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdByName: { type: String, required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    assignedToName: { type: String, required: true }
  },
    { timestamps: true }
);

taskSchema.index({
    createdBy: 1,
    assignedTo: 1,
    status: 1
});

module.exports = mongoose.model('Task', taskSchema);