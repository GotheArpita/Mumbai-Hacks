const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number
    },
    occupation: {
        type: String,
        enum: ['Student', 'Gig Worker', 'Professional', 'Other'],
        default: 'Other'
    },
    incomeDetails: {
        type: {
            amount: Number,
            frequency: {
                type: String,
                enum: ['Weekly', 'Bi-Weekly', 'Monthly', 'Irregular']
            },
            source: String
        }
    },
    financialGoals: [{
        title: String,
        targetAmount: Number,
        currentAmount: Number,
        deadline: Date
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
