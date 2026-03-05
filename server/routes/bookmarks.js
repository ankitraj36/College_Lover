const express = require('express');
const router = express.Router();
const { getMyBookmarks, addBookmark, removeBookmark, checkBookmark } = require('../controllers/bookmarkController');
const { auth } = require('../middleware/auth');

router.use(auth); // All bookmark routes require auth

router.get('/', getMyBookmarks);
router.post('/', addBookmark);
router.delete('/:materialId', removeBookmark);
router.get('/check/:materialId', checkBookmark);

module.exports = router;
