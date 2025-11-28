const mongoose = require('mongoose');

const transactionSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        type: {
            type: String,
            required: [true, 'Please add a transaction type'],
            enum: ['income', 'expense'],
        },
        amount: {
            type: Number,
            required: [true, 'Please add an amount'],
        },
        category: {
            type: String,
            required: [true, 'Please add a category'],
        },
        description: {
            type: String,
            default: '',
        },
        date: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Transaction', transactionSchema);
