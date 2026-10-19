const express = require('express');
const router = express.Router();
const { getAll, create, getByMember } = require('../controllers/paymentController');
const { auth } = require('../middleware/auth');

router.get('/', auth, getAll);
router.get('/member/:memberId', auth, getByMember);
router.post('/', auth, create);

module.exports = router;
