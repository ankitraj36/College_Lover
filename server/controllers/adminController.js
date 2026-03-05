const User = require('../models/User');
const StudyMaterial = require('../models/StudyMaterial');
const Bookmark = require('../models/Bookmark');

// GET /api/admin/stats
exports.getStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalStudents = await User.countDocuments({ role: 'student' });
        const totalMaterials = await StudyMaterial.countDocuments();
        const downloadStats = await StudyMaterial.aggregate([
            { $group: { _id: null, totalDownloads: { $sum: '$downloadCount' } } },
        ]);
        const totalBookmarks = await Bookmark.countDocuments();

        res.json({
            totalUsers,
            totalStudents,
            totalMaterials,
            totalDownloads: downloadStats[0]?.totalDownloads || 0,
            totalBookmarks,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// GET /api/admin/users
exports.getUsers = async (req, res) => {
    try {
        const { page = 1, limit = 20 } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const total = await User.countDocuments();
        const users = await User.find()
            .select('-password')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));
        res.json({ users, pagination: { page: parseInt(page), total, pages: Math.ceil(total / parseInt(limit)) } });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// DELETE /api/admin/users/:id
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        // Clean up bookmarks
        await Bookmark.deleteMany({ userId: req.params.id });
        res.json({ message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// PUT /api/admin/users/:id/role
exports.updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ user: user.toJSON() });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
