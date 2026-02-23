const { body, query } = require('express-validator');

const registerValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters'),
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please provide a valid email')
        .normalizeEmail(),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters'),
];

const loginValidation = [
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please provide a valid email')
        .normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required'),
];

const materialValidation = [
    body('title')
        .trim()
        .notEmpty()
        .withMessage('Title is required')
        .isLength({ max: 200 })
        .withMessage('Title cannot exceed 200 characters'),
    body('subject')
        .isArray({ min: 1 })
        .withMessage('At least one subject/department is required'),
    body('semester').trim().notEmpty().withMessage('Semester is required'),
    body('department').trim().notEmpty().withMessage('Department is required'),
    body('type')
        .optional()
        .isIn(['PDF', 'PPT', 'DOCX', 'Lab Manual', 'Textbook', 'Notes', 'Link'])
        .withMessage('Invalid material type'),
    body('fileUrl').trim().notEmpty().withMessage('File URL is required'),
];

const commentValidation = [
    body('text')
        .trim()
        .notEmpty()
        .withMessage('Comment text is required')
        .isLength({ max: 500 })
        .withMessage('Comment cannot exceed 500 characters'),
];

module.exports = {
    registerValidation,
    loginValidation,
    materialValidation,
    commentValidation,
};
