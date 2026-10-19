const express = require('express');
const router = express.Router();
const memberController = require('../controllers/memberController');
const { auth } = require('../middleware/auth');

router.get('/', auth, memberController.getAll);
router.get('/:id', auth, memberController.getById);
router.post('/', auth, memberController.create);
router.put('/:id', auth, memberController.update);
router.delete('/:id', auth, memberController.delete);

module.exports = router;