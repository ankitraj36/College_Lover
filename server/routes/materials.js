const express = require('express');
const router = express.Router();
const { getAll, getById, create, update, remove, download, getStats } = require('../controllers/materialController');
const { auth, requireAdmin } = require('../middleware/auth');

router.get('/stats', getStats);
router.get('/', getAll);
router.get('/:id', getById);
router.post('/:id/download', download);

// Admin only
router.post('/', auth, requireAdmin, create);
router.put('/:id', auth, requireAdmin, update);
router.delete('/:id', auth, requireAdmin, remove);

module.exports = router;
