const express = require('express');
const router = express.Router();
const { getFinancialAdvice } = require('../controllers/aiController');

// AI advice is public for now so the chat widget works even if auth is misconfigured
router.post('/advice', getFinancialAdvice);

module.exports = router;
