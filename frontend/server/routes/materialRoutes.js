const express = require('express');
const router = express.Router();
const {
    getMaterials,
    getMaterial,
    createMaterial,
    updateMaterial,
    deleteMaterial,
    approveMaterial,
    trackDownload,
    toggleLike,
    addComment,
    deleteComment,
    toggleBookmark,
    getStats,
} = require('../controllers/materialController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const { materialValidation, commentValidation } = require('../validations');

// Public routes
router.get('/', getMaterials);
router.get('/stats', protect, authorize('admin'), getStats);
router.get('/:id', getMaterial);

// Download tracking (public)
router.put('/:id/download', trackDownload);

// Protected routes (logged-in users)
router.post('/', protect, materialValidation, createMaterial);
router.put('/:id', protect, updateMaterial);
router.delete('/:id', protect, deleteMaterial);

// Like & Bookmark
router.put('/:id/like', protect, toggleLike);
router.put('/:id/bookmark', protect, toggleBookmark);

// Comments
router.post('/:id/comments', protect, commentValidation, addComment);
router.delete('/:id/comments/:commentId', protect, deleteComment);

// Admin routes
router.put('/:id/approve', protect, authorize('admin'), approveMaterial);

module.exports = router;
