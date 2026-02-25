const Transaction = require('../models/Transaction');
const Warehouse = require('../models/Warehouse');

const createTransaction = async (req, res) => {
    try {
        const { warehouseId, productName, type, quantity, amount, profit, size, orderId, notes } = req.body;

        if (!type || !quantity || !amount) {
            return res.status(400).json({ message: 'Please provide required fields' });
        }

        const now = new Date();
        const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

        const transaction = await Transaction.create({
            agentId: req.agent._id,
            warehouseId,
            productName: productName || 'Unknown Product',
            type,
            quantity,
            amount,
            profit: profit || 0,
            size: size || '',
            orderId,
            month,
            notes: notes || ''
        });

        res.status(201).json(transaction);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const getTransactions = async (req, res) => {
    try {
        const { type, month, page = 1, limit = 50 } = req.query;

        let query = {};

        if (req.agent.role !== 'super_agent') {
            query.agentId = req.agent._id;
        }

        if (type) {
            query.type = type;
        }

        if (month) {
            query.month = month;
        }

        const total = await Transaction.countDocuments(query);
        const transactions = await Transaction.find(query)
            .sort({ date: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        res.json({
            items: transactions,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            total
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const getMonthlyReport = async (req, res) => {
    try {
        const { month } = req.query;

        if (!month) {
            return res.status(400).json({ message: 'Please provide month (YYYY-MM)' });
        }

        let matchQuery = { month };
        if (req.agent.role !== 'super_agent') {
            matchQuery.agentId = req.agent._id;
        }

        const sales = await Transaction.aggregate([
            { $match: { ...matchQuery, type: 'sale' } },
            {
                $group: {
                    _id: { warehouseId: '$warehouseId', productName: '$productName' },
                    totalQuantity: { $sum: '$quantity' },
                    totalAmount: { $sum: '$amount' },
                    totalProfit: { $sum: '$profit' }
                }
            }
        ]);

        const purchases = await Transaction.aggregate([
            { $match: { ...matchQuery, type: 'purchase' } },
            {
                $group: {
                    _id: { warehouseId: '$warehouseId', productName: '$productName' },
                    totalQuantity: { $sum: '$quantity' },
                    totalAmount: { $sum: '$amount' }
                }
            }
        ]);

        const summary = await Transaction.aggregate([
            { $match: matchQuery },
            {
                $group: {
                    _id: '$type',
                    totalQuantity: { $sum: '$quantity' },
                    totalAmount: { $sum: '$amount' },
                    totalProfit: { $sum: '$profit' }
                }
            }
        ]);

        const salesTotal = summary.find(s => s._id === 'sale');
        const purchaseTotal = summary.find(s => s._id === 'purchase');

        res.json({
            month,
            sales: sales || [],
            purchases: purchases || [],
            summary: {
                totalSales: salesTotal?.totalAmount || 0,
                totalSalesQuantity: salesTotal?.totalQuantity || 0,
                totalProfit: salesTotal?.totalProfit || 0,
                totalPurchases: purchaseTotal?.totalAmount || 0,
                totalPurchaseQuantity: purchaseTotal?.totalQuantity || 0
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const getAllMonths = async (req, res) => {
    try {
        let matchQuery = {};
        if (req.agent.role !== 'super_agent') {
            matchQuery.agentId = req.agent._id;
        }

        const months = await Transaction.distinct('month', matchQuery);
        const sortedMonths = months.sort().reverse();

        res.json(sortedMonths);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const recordSaleTransaction = async (agentId, warehouseId, productName, quantity, sellingPrice, size, orderId) => {
    try {
        const warehouse = await Warehouse.findById(warehouseId);
        
        if (!warehouse) {
            throw new Error('Warehouse item not found');
        }

        const profit = (sellingPrice - warehouse.purchasePrice) * quantity;
        const now = new Date();
        const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

        const transaction = await Transaction.create({
            agentId,
            warehouseId,
            productName,
            type: 'sale',
            quantity,
            amount: sellingPrice * quantity,
            profit,
            size,
            orderId,
            month
        });

        return transaction;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    createTransaction,
    getTransactions,
    getMonthlyReport,
    getAllMonths,
    recordSaleTransaction
};
