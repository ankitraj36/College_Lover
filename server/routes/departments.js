const express = require('express');
const router = express.Router();
const { getAll, getById, create, update, remove } = require('../controllers/departmentController');
const { auth, requireAdmin } = require('../middleware/auth');

router.get('/', getAll);
router.get('/:id', getById);

// Admin only
router.post('/', auth, requireAdmin, create);
router.put('/:id', auth, requireAdmin, update);
router.delete('/:id', auth, requireAdmin, remove);

module.exports = router;
