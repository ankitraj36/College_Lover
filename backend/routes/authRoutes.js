const express = require('express');
const router = express.Router();
const {
    register,
    login,
    socialLogin,
    getMe,
    logout,
    updateProfile,
    updatePassword,
} = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const { registerValidation, loginValidation } = require('../validations');

// Public routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.post('/social', socialLogin); // Firebase social login (Google / Apple)

// Protected routes
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);
router.put('/updateprofile', protect, updateProfile);
router.put('/updatepassword', protect, updatePassword);

module.exports = router;
