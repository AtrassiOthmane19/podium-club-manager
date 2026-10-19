const express = require('express');
const router = express.Router();
const controller = require('../controllers/userController');
const { auth, adminOnly } = require('../middleware/auth');

router.get('/', auth, adminOnly, controller.getAll);
router.post('/', auth, adminOnly, controller.create);
router.put('/:id', auth, adminOnly, controller.update);
router.delete('/:id', auth, adminOnly, controller.delete);

module.exports = router;
