const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    agentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Agent',
        required: true
    },
    warehouseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Warehouse',
        default: null
    },
    productName: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['purchase', 'sale', 'return', 'adjustment'],
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    profit: {
        type: Number,
        default: 0
    },
    size: {
        type: String,
        default: ''
    },
    orderId: {
        type: String,
        default: null
    },
    month: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    notes: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

transactionSchema.index({ agentId: 1, month: 1 });
transactionSchema.index({ agentId: 1, type: 1 });

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
