const express = require('express');
const router = express.Router();
const { getAll, checkIn } = require('../controllers/attendanceController');
const { auth } = require('../middleware/auth');

router.get('/', auth, getAll);
router.post('/check-in', auth, checkIn);

module.exports = router;
