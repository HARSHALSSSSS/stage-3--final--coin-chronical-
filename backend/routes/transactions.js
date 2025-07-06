const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');

// Get all transactions
router.get('/', async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get transaction by ID
router.get('/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create new transaction
router.post('/', async (req, res) => {
  try {
    const { description, amount, type, category, date, notes } = req.body;
    
    const transaction = new Transaction({
      description,
      amount,
      type,
      category,
      date: date || new Date(),
      notes
    });

    const savedTransaction = await transaction.save();
    res.status(201).json(savedTransaction);
  } catch (error) {
    res.status(400).json({ message: 'Invalid data', error: error.message });
  }
});

// Update transaction
router.put('/:id', async (req, res) => {
  try {
    const { description, amount, type, category, date, notes } = req.body;
    
    const transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      {
        description,
        amount,
        type,
        category,
        date,
        notes
      },
      { new: true, runValidators: true }
    );

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json(transaction);
  } catch (error) {
    res.status(400).json({ message: 'Invalid data', error: error.message });
  }
});

// Delete transaction
router.delete('/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndDelete(req.params.id);
    
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get transactions by category
router.get('/category/:category', async (req, res) => {
  try {
    const transactions = await Transaction.find({ 
      category: req.params.category 
    }).sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get transactions by type (income/expense)
router.get('/type/:type', async (req, res) => {
  try {
    const transactions = await Transaction.find({ 
      type: req.params.type 
    }).sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get monthly summary
router.get('/summary/monthly', async (req, res) => {
  try {
    const { year, month } = req.query;
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const transactions = await Transaction.find({
      date: { $gte: startDate, $lte: endDate }
    });

    const summary = {
      totalIncome: 0,
      totalExpense: 0,
      netBalance: 0,
      transactionCount: transactions.length,
      byCategory: {}
    };

    transactions.forEach(transaction => {
      if (transaction.type === 'income') {
        summary.totalIncome += transaction.amount;
      } else {
        summary.totalExpense += transaction.amount;
      }

      if (!summary.byCategory[transaction.category]) {
        summary.byCategory[transaction.category] = { income: 0, expense: 0 };
      }

      if (transaction.type === 'income') {
        summary.byCategory[transaction.category].income += transaction.amount;
      } else {
        summary.byCategory[transaction.category].expense += transaction.amount;
      }
    });

    summary.netBalance = summary.totalIncome - summary.totalExpense;

    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router; 