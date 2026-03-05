const Bookmark = require('../models/Bookmark');

// GET /api/bookmarks
exports.getMyBookmarks = async (req, res) => {
    try {
        const bookmarks = await Bookmark.find({ userId: req.user._id })
            .populate('materialId')
            .sort({ createdAt: -1 });
        res.json({ bookmarks });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// POST /api/bookmarks
exports.addBookmark = async (req, res) => {
    try {
        const { materialId } = req.body;
        const existing = await Bookmark.findOne({ userId: req.user._id, materialId });
        if (existing) {
            return res.status(400).json({ message: 'Already bookmarked' });
        }
        const bookmark = await Bookmark.create({ userId: req.user._id, materialId });
        res.status(201).json({ bookmark });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// DELETE /api/bookmarks/:materialId
exports.removeBookmark = async (req, res) => {
    try {
        await Bookmark.findOneAndDelete({
            userId: req.user._id,
            materialId: req.params.materialId,
        });
        res.json({ message: 'Bookmark removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// GET /api/bookmarks/check/:materialId
exports.checkBookmark = async (req, res) => {
    try {
        const bookmark = await Bookmark.findOne({
            userId: req.user._id,
            materialId: req.params.materialId,
        });
        res.json({ isBookmarked: !!bookmark });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
