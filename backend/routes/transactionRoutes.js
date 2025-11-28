const express = require('express');
const router = express.Router();
const {
    getTransactions,
    setTransaction,
    updateTransaction,
    deleteTransaction,
    simulateBankSync
} = require('../controllers/transactionController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getTransactions).post(protect, setTransaction);
router.post('/simulate', protect, simulateBankSync);
router.route('/:id').delete(protect, deleteTransaction).put(protect, updateTransaction);

module.exports = router;
