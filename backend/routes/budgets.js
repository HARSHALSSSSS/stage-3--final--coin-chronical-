const express = require('express');
const router = express.Router();
const Budget = require('../models/Budget');

// Get all budgets
router.get('/', async (req, res) => {
  try {
    const budgets = await Budget.find().sort({ category: 1 });
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get budget by ID
router.get('/:id', async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);
    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }
    res.json(budget);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create new budget
router.post('/', async (req, res) => {
  try {
    const { category, amount, period, color } = req.body;
    
    // Check if budget for this category already exists
    const existingBudget = await Budget.findOne({ category });
    if (existingBudget) {
      return res.status(400).json({ message: 'Budget for this category already exists' });
    }

    const budget = new Budget({
      category,
      amount,
      period: period || 'monthly',
      color: color || '#3B82F6'
    });

    const savedBudget = await budget.save();
    res.status(201).json(savedBudget);
  } catch (error) {
    res.status(400).json({ message: 'Invalid data', error: error.message });
  }
});

// Update budget
router.put('/:id', async (req, res) => {
  try {
    const { category, amount, period, color, isActive } = req.body;
    
    const budget = await Budget.findByIdAndUpdate(
      req.params.id,
      {
        category,
        amount,
        period,
        color,
        isActive
      },
      { new: true, runValidators: true }
    );

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    res.json(budget);
  } catch (error) {
    res.status(400).json({ message: 'Invalid data', error: error.message });
  }
});

// Delete budget
router.delete('/:id', async (req, res) => {
  try {
    const budget = await Budget.findByIdAndDelete(req.params.id);
    
    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    res.json({ message: 'Budget deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Toggle budget active status
router.patch('/:id/toggle', async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);
    
    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    budget.isActive = !budget.isActive;
    const updatedBudget = await budget.save();

    res.json(updatedBudget);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get active budgets only
router.get('/active/only', async (req, res) => {
  try {
    const budgets = await Budget.find({ isActive: true }).sort({ category: 1 });
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get budget by category
router.get('/category/:category', async (req, res) => {
  try {
    const budget = await Budget.findOne({ category: req.params.category });
    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }
    res.json(budget);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router; 