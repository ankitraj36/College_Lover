const { validationResult } = require('express-validator');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const sendTokenResponse = require('../utils/sendToken');
const { ErrorResponse } = require('../middlewares/errorMiddleware');
const admin = require('../config/firebase');

// @desc    Register user (local)
// @route   POST /api/v1/auth/register
// @access  Public
const register = asyncHandler(async (req, res, next) => {
    // Check validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: errors.array().map((e) => e.msg).join('. '),
            errors: errors.array(),
        });
    }

    const { name, email, password, semester } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return next(new ErrorResponse('A user with this email already exists', 400));
    }

    const userData = { name, email, password, authProvider: 'local' };
    if (semester) userData.semester = Number(semester);

    const user = await User.create(userData);

    sendTokenResponse(user, 201, res);
});

// @desc    Login user (local)
// @route   POST /api/v1/auth/login
// @access  Public
const login = asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: errors.array().map((e) => e.msg).join('. '),
            errors: errors.array(),
        });
    }

    const { email, password } = req.body;

    // Find user with password included
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    // If user signed up via social login, tell them
    if (user.authProvider !== 'local' && !user.password) {
        return next(
            new ErrorResponse(
                `This account uses ${user.authProvider} sign-in. Please use "Continue with ${user.authProvider === 'google' ? 'Google' : 'Apple'}" instead.`,
                400
            )
        );
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    sendTokenResponse(user, 200, res);
});

// @desc    Social login / register via Firebase
// @route   POST /api/v1/auth/social
// @access  Public
const socialLogin = asyncHandler(async (req, res, next) => {
    const { idToken } = req.body;

    if (!idToken) {
        return next(new ErrorResponse('Firebase ID token is required', 400));
    }

    let decodedToken;
    try {
        decodedToken = await admin.auth().verifyIdToken(idToken);
    } catch (err) {
        console.error('Firebase token verification failed:', err.message);
        return next(new ErrorResponse('Invalid or expired authentication token', 401));
    }

    const { uid, email, name, picture, firebase } = decodedToken;
    const provider = firebase?.sign_in_provider || 'unknown';

    // Determine authProvider
    let authProvider = 'local';
    if (provider === 'google.com') authProvider = 'google';
    else if (provider === 'apple.com') authProvider = 'apple';

    if (!email) {
        return next(new ErrorResponse('Email is required for authentication', 400));
    }

    // Check if user exists by firebaseUid OR email
    let user = await User.findOne({
        $or: [{ firebaseUid: uid }, { email: email.toLowerCase() }],
    });

    if (user) {
        // Update user info if needed
        let needsUpdate = false;

        if (!user.firebaseUid) {
            user.firebaseUid = uid;
            needsUpdate = true;
        }
        if (!user.avatar && picture) {
            user.avatar = picture;
            needsUpdate = true;
        }
        if (user.authProvider === 'local' && authProvider !== 'local') {
            // User originally signed up locally, now linking social account
            user.authProvider = authProvider;
            user.providerId = uid;
            needsUpdate = true;
        }

        if (needsUpdate) {
            await user.save({ validateBeforeSave: false });
        }
    } else {
        // Create new user
        user = await User.create({
            name: name || email.split('@')[0],
            email: email.toLowerCase(),
            authProvider,
            firebaseUid: uid,
            providerId: uid,
            avatar: picture || '',
        });
    }

    sendTokenResponse(user, 200, res);
});

// @desc    Get current logged-in user
// @route   GET /api/v1/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id).populate('bookmarks');

    res.status(200).json({
        success: true,
        user,
    });
});

// @desc    Logout user / clear cookie
// @route   POST /api/v1/auth/logout
// @access  Private
const logout = asyncHandler(async (req, res) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 5 * 1000),
        httpOnly: true,
    });

    res.status(200).json({
        success: true,
        message: 'Logged out successfully',
    });
});

// @desc    Update user profile
// @route   PUT /api/v1/auth/updateprofile
// @access  Private
const updateProfile = asyncHandler(async (req, res, next) => {
    const fieldsToUpdate = {};
    if (req.body.name) fieldsToUpdate.name = req.body.name;
    if (req.body.email) fieldsToUpdate.email = req.body.email;
    if (req.body.avatar) fieldsToUpdate.avatar = req.body.avatar;
    if (req.body.semester) fieldsToUpdate.semester = Number(req.body.semester);

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({
        success: true,
        user,
    });
});

// @desc    Update password
// @route   PUT /api/v1/auth/updatepassword
// @access  Private
const updatePassword = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password');

    // Social login users can't change password (they don't have one)
    if (user.authProvider !== 'local') {
        return next(
            new ErrorResponse('Password change is not available for social login accounts', 400)
        );
    }

    if (!(await user.matchPassword(req.body.currentPassword))) {
        return next(new ErrorResponse('Current password is incorrect', 401));
    }

    user.password = req.body.newPassword;
    await user.save();

    sendTokenResponse(user, 200, res);
});

module.exports = {
    register,
    login,
    socialLogin,
    getMe,
    logout,
    updateProfile,
    updatePassword,
};
