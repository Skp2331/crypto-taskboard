const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Apply auth middleware to all profile routes
router.use(authMiddleware);

/**
 * @route   GET /api/profile
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/', async (req, res) => {
    res.json({
        success: true,
        data: {
            _id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            createdAt: req.user.createdAt,
            updatedAt: req.user.updatedAt,
        },
    });
});

/**
 * @route   PUT /api/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put(
    '/',
    [
        body('name')
            .optional()
            .trim()
            .isLength({ min: 2, max: 50 })
            .withMessage('Name must be between 2 and 50 characters'),
    ],
    async (req, res, next) => {
        try {
            // Check for validation errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: errors.array(),
                });
            }

            const { name } = req.body;

            // Build update object
            const updateFields = {};
            if (name !== undefined) updateFields.name = name;

            // Update user
            const user = await User.findByIdAndUpdate(
                req.user._id,
                updateFields,
                { new: true, runValidators: true }
            );

            res.json({
                success: true,
                message: 'Profile updated successfully',
                data: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt,
                },
            });
        } catch (error) {
            next(error);
        }
    }
);

module.exports = router;
