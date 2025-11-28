const Transaction = require('../models/Transaction');
const User = require('../models/User');

// @desc    Get transactions
// @route   GET /api/transactions
// @access  Private
const getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({ user: req.user.id }).sort({
            date: -1,
        });
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Set transaction
// @route   POST /api/transactions
// @access  Private
const setTransaction = async (req, res) => {
    if (!req.body.amount || !req.body.category || !req.body.type) {
        res.status(400).json({ message: 'Please add all required fields' });
        return;
    }

    try {
        const transaction = await Transaction.create({
            user: req.user.id,
            type: req.body.type,
            amount: req.body.amount,
            category: req.body.category,
            description: req.body.description,
            date: req.body.date,
        });

        res.status(200).json(transaction);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update transaction
// @route   PUT /api/transactions/:id
// @access  Private
const updateTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);

        if (!transaction) {
            res.status(404).json({ message: 'Transaction not found' });
            return;
        }

        // Check for user
        if (!req.user) {
            res.status(401).json({ message: 'User not found' });
            return;
        }

        // Make sure the logged in user matches the transaction user
        if (transaction.user.toString() !== req.user.id) {
            res.status(401).json({ message: 'User not authorized' });
            return;
        }

        const updatedTransaction = await Transaction.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
            }
        );

        res.status(200).json(updatedTransaction);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete transaction
// @route   DELETE /api/transactions/:id
// @access  Private
const deleteTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);

        if (!transaction) {
            res.status(404).json({ message: 'Transaction not found' });
            return;
        }

        // Check for user
        if (!req.user) {
            res.status(401).json({ message: 'User not found' });
            return;
        }

        // Make sure the logged in user matches the transaction user
        if (transaction.user.toString() !== req.user.id) {
            res.status(401).json({ message: 'User not authorized' });
            return;
        }

        await transaction.deleteOne();

        res.status(200).json({ id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getTransactions,
    setTransaction,
    updateTransaction,
    deleteTransaction,
};
