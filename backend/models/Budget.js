const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  period: {
    type: String,
    required: true,
    enum: ['monthly', 'weekly', 'yearly'],
    default: 'monthly'
  },
  color: {
    type: String,
    default: '#3B82F6'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for better query performance
budgetSchema.index({ category: 1 });
budgetSchema.index({ isActive: 1 });

module.exports = mongoose.model('Budget', budgetSchema); 