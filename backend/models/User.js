const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide a name'],
            trim: true,
            maxlength: [50, 'Name cannot exceed 50 characters'],
        },
        email: {
            type: String,
            required: [true, 'Please provide an email'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [
                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                'Please provide a valid email',
            ],
        },
        password: {
            type: String,
            minlength: [6, 'Password must be at least 6 characters'],
            select: false, // Don't return password by default
            // NOT required — social login users won't have a password
        },
        role: {
            type: String,
            enum: ['student', 'admin'],
            default: 'student',
        },
        avatar: {
            type: String,
            default: '',
        },
        semester: {
            type: Number,
            min: 1,
            max: 8,
            default: null,
        },

        // ===== SOCIAL LOGIN FIELDS =====
        authProvider: {
            type: String,
            enum: ['local', 'google', 'apple'],
            default: 'local',
        },
        firebaseUid: {
            type: String,
            unique: true,
            sparse: true, // allows multiple null values
        },
        providerId: {
            type: String, // UID from the provider (Google sub, Apple sub)
            default: '',
        },

        bookmarks: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Material',
            },
        ],
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Indexes
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ firebaseUid: 1 });

// Hash password before saving (only for local auth)
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password') || !this.password) return next();
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Validate password is present for local auth on creation
UserSchema.pre('validate', function (next) {
    if (this.isNew && this.authProvider === 'local' && !this.password) {
        this.invalidate('password', 'Please provide a password');
    }
    next();
});

// Compare entered password with hashed password
UserSchema.methods.matchPassword = async function (enteredPassword) {
    if (!this.password) return false;
    return await bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT token
UserSchema.methods.getSignedJwtToken = function () {
    return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

module.exports = mongoose.model('User', UserSchema);
