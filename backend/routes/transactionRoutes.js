const express = require('express');
const router = express.Router();
const { 
    createTransaction, 
    getTransactions, 
    getMonthlyReport, 
    getAllMonths 
} = require('../controllers/transactionController');
const { authMiddleware, superAgentOnly } = require('../config/authMiddleware');

router.post('/', authMiddleware, createTransaction);
router.get('/', authMiddleware, getTransactions);
router.get('/months', authMiddleware, getAllMonths);
router.get('/report', authMiddleware, getMonthlyReport);

module.exports = router;
