const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const { ErrorResponse } = require('../middlewares/errorMiddleware');

// @desc    Get all users (Admin)
// @route   GET /api/v1/users
// @access  Private (Admin)
const getUsers = asyncHandler(async (req, res) => {
    const { page = 1, limit = 20, search, role } = req.query;

    const query = {};

    if (search) {
        query.$or = [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
        ];
    }

    if (role) {
        query.role = role;
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await User.countDocuments(query);
    const users = await User.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean();

    res.status(200).json({
        success: true,
        count: users.length,
        total,
        totalPages: Math.ceil(total / limitNum),
        currentPage: pageNum,
        users,
    });
});

// @desc    Get single user (Admin)
// @route   GET /api/v1/users/:id
// @access  Private (Admin)
const getUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorResponse('User not found', 404));
    }

    res.status(200).json({
        success: true,
        user,
    });
});

// @desc    Update user role (Admin)
// @route   PUT /api/v1/users/:id/role
// @access  Private (Admin)
const updateUserRole = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorResponse('User not found', 404));
    }

    if (!['student', 'admin'].includes(req.body.role)) {
        return next(new ErrorResponse('Invalid role', 400));
    }

    user.role = req.body.role;
    await user.save();

    res.status(200).json({
        success: true,
        user,
    });
});

// @desc    Delete user (Admin)
// @route   DELETE /api/v1/users/:id
// @access  Private (Admin)
const deleteUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorResponse('User not found', 404));
    }

    // Prevent deleting yourself
    if (user._id.toString() === req.user.id) {
        return next(new ErrorResponse('Cannot delete yourself', 400));
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success: true,
        message: 'User deleted successfully',
    });
});

module.exports = {
    getUsers,
    getUser,
    updateUserRole,
    deleteUser,
};
