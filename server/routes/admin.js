const express = require('express');
const router = express.Router();
const { getStats, getUsers, deleteUser, updateUserRole } = require('../controllers/adminController');
const { auth, requireAdmin } = require('../middleware/auth');

router.use(auth, requireAdmin); // All admin routes require auth + admin role

router.get('/stats', getStats);
router.get('/users', getUsers);
router.delete('/users/:id', deleteUser);
router.put('/users/:id/role', updateUserRole);

module.exports = router;
