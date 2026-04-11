const express = require('express');
const { getDashboardStats } = require('../controllers/statsController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.get('/', getDashboardStats);

module.exports = router;
