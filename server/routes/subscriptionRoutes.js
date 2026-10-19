const express = require('express');
const router = express.Router();
const controller = require('../controllers/subscriptionController');
const { auth } = require('../middleware/auth');

router.get('/plans', auth, controller.getPlans);
router.get('/', auth, controller.getAll);
router.get('/member/:memberId', auth, controller.getByMember);
router.post('/', auth, controller.create);
router.post('/:id/renew', auth, controller.renew);

module.exports = router;