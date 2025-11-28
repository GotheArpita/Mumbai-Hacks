const express = require('express');
const router = express.Router();
const { getFinancialAdvice } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

router.post('/advice', protect, getFinancialAdvice);

module.exports = router;
