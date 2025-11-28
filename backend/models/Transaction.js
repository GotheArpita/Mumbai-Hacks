const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        enum: ['income', 'expense'],
        required: true
    },
    category: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    },
    isRecurring: {
        type: Boolean,
        default: false
    },
    source: {
        type: String,
        enum: ['manual', 'bank_sync'],
        default: 'manual'
    }
});

module.exports = mongoose.model('Transaction', TransactionSchema);
