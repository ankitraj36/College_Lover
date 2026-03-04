const { validationResult } = require('express-validator');
const Material = require('../models/Material');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const { ErrorResponse } = require('../middlewares/errorMiddleware');

// @desc    Get all materials (with search, filter, pagination)
// @route   GET /api/v1/materials
// @access  Public
const getMaterials = asyncHandler(async (req, res) => {
    const {
        search,
        subject,
        semester,
        department,
        type,
        sort,
        page = 1,
        limit = 12,
        approved,
    } = req.query;

    const query = {};

    // By default, show only approved materials for public
    if (approved !== undefined) {
        query.approved = approved === 'true';
    } else {
        query.approved = true;
    }

    // Text search
    if (search) {
        query.$or = [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
            { subject: { $regex: search, $options: 'i' } },
            { semester: { $regex: search, $options: 'i' } },
        ];
    }

    // Filter by subject/department
    if (subject) {
        query.subject = { $in: [subject] };
    }

    // Filter by semester
    if (semester) {
        query.semester = { $regex: semester, $options: 'i' };
    }

    // Filter by department
    if (department) {
        query.department = department;
    }

    // Filter by type
    if (type) {
        query.type = type;
    }

    // Sorting
    let sortOption = { createdAt: -1 }; // default: newest first
    if (sort === 'oldest') sortOption = { createdAt: 1 };
    if (sort === 'title') sortOption = { title: 1 };
    if (sort === 'downloads') sortOption = { downloads: -1 };
    if (sort === 'popular') sortOption = { downloads: -1, createdAt: -1 };

    // Pagination
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await Material.countDocuments(query);
    const materials = await Material.find(query)
        .populate('uploadedBy', 'name email avatar')
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum)
        .lean();

    res.status(200).json({
        success: true,
        count: materials.length,
        total,
        totalPages: Math.ceil(total / limitNum),
        currentPage: pageNum,
        materials,
    });
});

// @desc    Get single material
// @route   GET /api/v1/materials/:id
// @access  Public
const getMaterial = asyncHandler(async (req, res, next) => {
    const material = await Material.findById(req.params.id)
        .populate('uploadedBy', 'name email avatar')
        .populate('comments.user', 'name avatar')
        .populate('likes', 'name');

    if (!material) {
        return next(new ErrorResponse('Material not found', 404));
    }

    res.status(200).json({
        success: true,
        material,
    });
});

// @desc    Create material
// @route   POST /api/v1/materials
// @access  Private
const createMaterial = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: errors.array().map((e) => e.msg).join('. '),
            errors: errors.array(),
        });
    }

    req.body.uploadedBy = req.user.id;

    // Auto-approve if admin
    if (req.user.role === 'admin') {
        req.body.approved = true;
    }

    const material = await Material.create(req.body);

    res.status(201).json({
        success: true,
        material,
    });
});

// @desc    Update material
// @route   PUT /api/v1/materials/:id
// @access  Private (owner or admin)
const updateMaterial = asyncHandler(async (req, res, next) => {
    let material = await Material.findById(req.params.id);

    if (!material) {
        return next(new ErrorResponse('Material not found', 404));
    }

    // Check ownership or admin
    if (
        material.uploadedBy.toString() !== req.user.id &&
        req.user.role !== 'admin'
    ) {
        return next(
            new ErrorResponse('Not authorized to update this material', 403)
        );
    }

    material = await Material.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({
        success: true,
        material,
    });
});

// @desc    Delete material
// @route   DELETE /api/v1/materials/:id
// @access  Private (owner or admin)
const deleteMaterial = asyncHandler(async (req, res, next) => {
    const material = await Material.findById(req.params.id);

    if (!material) {
        return next(new ErrorResponse('Material not found', 404));
    }

    // Check ownership or admin
    if (
        material.uploadedBy.toString() !== req.user.id &&
        req.user.role !== 'admin'
    ) {
        return next(
            new ErrorResponse('Not authorized to delete this material', 403)
        );
    }

    await Material.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success: true,
        message: 'Material deleted successfully',
    });
});

// @desc    Approve/Reject material (Admin only)
// @route   PUT /api/v1/materials/:id/approve
// @access  Private (Admin)
const approveMaterial = asyncHandler(async (req, res, next) => {
    const material = await Material.findById(req.params.id);

    if (!material) {
        return next(new ErrorResponse('Material not found', 404));
    }

    material.approved = req.body.approved !== undefined ? req.body.approved : true;
    await material.save();

    res.status(200).json({
        success: true,
        material,
    });
});

// @desc    Track download
// @route   PUT /api/v1/materials/:id/download
// @access  Public
const trackDownload = asyncHandler(async (req, res, next) => {
    const material = await Material.findByIdAndUpdate(
        req.params.id,
        { $inc: { downloads: 1 } },
        { new: true }
    );

    if (!material) {
        return next(new ErrorResponse('Material not found', 404));
    }

    res.status(200).json({
        success: true,
        downloads: material.downloads,
    });
});

// @desc    Like/Unlike a material
// @route   PUT /api/v1/materials/:id/like
// @access  Private
const toggleLike = asyncHandler(async (req, res, next) => {
    const material = await Material.findById(req.params.id);

    if (!material) {
        return next(new ErrorResponse('Material not found', 404));
    }

    const likeIndex = material.likes.indexOf(req.user.id);

    if (likeIndex === -1) {
        material.likes.push(req.user.id);
    } else {
        material.likes.splice(likeIndex, 1);
    }

    await material.save();

    res.status(200).json({
        success: true,
        liked: likeIndex === -1,
        likeCount: material.likes.length,
    });
});

// @desc    Add comment
// @route   POST /api/v1/materials/:id/comments
// @access  Private
const addComment = asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: errors.array().map((e) => e.msg).join('. '),
        });
    }

    const material = await Material.findById(req.params.id);

    if (!material) {
        return next(new ErrorResponse('Material not found', 404));
    }

    material.comments.push({
        user: req.user.id,
        text: req.body.text,
    });

    await material.save();

    // Re-fetch with populated comments
    const updated = await Material.findById(req.params.id).populate(
        'comments.user',
        'name avatar'
    );

    res.status(201).json({
        success: true,
        comments: updated.comments,
    });
});

// @desc    Delete comment
// @route   DELETE /api/v1/materials/:id/comments/:commentId
// @access  Private (comment owner or admin)
const deleteComment = asyncHandler(async (req, res, next) => {
    const material = await Material.findById(req.params.id);

    if (!material) {
        return next(new ErrorResponse('Material not found', 404));
    }

    const comment = material.comments.id(req.params.commentId);

    if (!comment) {
        return next(new ErrorResponse('Comment not found', 404));
    }

    if (
        comment.user.toString() !== req.user.id &&
        req.user.role !== 'admin'
    ) {
        return next(
            new ErrorResponse('Not authorized to delete this comment', 403)
        );
    }

    comment.deleteOne();
    await material.save();

    res.status(200).json({
        success: true,
        message: 'Comment deleted',
    });
});

// @desc    Bookmark a material
// @route   PUT /api/v1/materials/:id/bookmark
// @access  Private
const toggleBookmark = asyncHandler(async (req, res, next) => {
    const material = await Material.findById(req.params.id);

    if (!material) {
        return next(new ErrorResponse('Material not found', 404));
    }

    const user = await User.findById(req.user.id);
    const bookmarkIndex = user.bookmarks.indexOf(req.params.id);

    if (bookmarkIndex === -1) {
        user.bookmarks.push(req.params.id);
    } else {
        user.bookmarks.splice(bookmarkIndex, 1);
    }

    await user.save();

    res.status(200).json({
        success: true,
        bookmarked: bookmarkIndex === -1,
        bookmarks: user.bookmarks,
    });
});

// @desc    Get statistics (Admin)
// @route   GET /api/v1/materials/stats
// @access  Private (Admin)
const getStats = asyncHandler(async (req, res) => {
    const totalMaterials = await Material.countDocuments();
    const approvedMaterials = await Material.countDocuments({ approved: true });
    const pendingMaterials = await Material.countDocuments({ approved: false });
    const totalUsers = await User.countDocuments();
    const totalDownloads = await Material.aggregate([
        { $group: { _id: null, total: { $sum: '$downloads' } } },
    ]);

    // Materials by department
    const byDepartment = await Material.aggregate([
        { $group: { _id: '$department', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
    ]);

    // Materials by semester
    const bySemester = await Material.aggregate([
        { $group: { _id: '$semester', count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
    ]);

    // Recent uploads
    const recentUploads = await Material.find()
        .populate('uploadedBy', 'name')
        .sort({ createdAt: -1 })
        .limit(5)
        .lean();

    res.status(200).json({
        success: true,
        stats: {
            totalMaterials,
            approvedMaterials,
            pendingMaterials,
            totalUsers,
            totalDownloads: totalDownloads[0]?.total || 0,
            byDepartment,
            bySemester,
            recentUploads,
        },
    });
});

module.exports = {
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
};
