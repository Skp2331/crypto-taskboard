const express = require('express');
const { body, query, validationResult } = require('express-validator');
const Task = require('../models/Task');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Apply auth middleware to all task routes
router.use(authMiddleware);

/**
 * @route   GET /api/tasks/stats/summary
 * @desc    Get task statistics for the user
 * @access  Private
 * 
 * IMPORTANT: This route MUST be defined BEFORE /:id route
 * otherwise Express will treat "stats" as an ID parameter
 */
router.get('/stats/summary', async (req, res, next) => {
    try {
        const stats = await Task.aggregate([
            { $match: { user: req.user._id } },
            {
                $group: {
                    _id: null,
                    total: { $sum: 1 },
                    pending: {
                        $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] },
                    },
                    inProgress: {
                        $sum: { $cond: [{ $eq: ['$status', 'in-progress'] }, 1, 0] },
                    },
                    completed: {
                        $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] },
                    },
                    highPriority: {
                        $sum: { $cond: [{ $eq: ['$priority', 'high'] }, 1, 0] },
                    },
                },
            },
        ]);

        const defaultStats = {
            total: 0,
            pending: 0,
            inProgress: 0,
            completed: 0,
            highPriority: 0,
        };

        res.json({
            success: true,
            data: stats[0] || defaultStats,
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   GET /api/tasks
 * @desc    Get all tasks for the authenticated user
 * @access  Private
 */
router.get(
    '/',
    [
        query('status')
            .optional()
            .isIn(['pending', 'in-progress', 'completed'])
            .withMessage('Invalid status value'),
        query('priority')
            .optional()
            .isIn(['low', 'medium', 'high'])
            .withMessage('Invalid priority value'),
        query('search').optional().trim(),
        query('sortBy')
            .optional()
            .isIn(['createdAt', 'dueDate', 'priority', 'title'])
            .withMessage('Invalid sort field'),
        query('order')
            .optional()
            .isIn(['asc', 'desc'])
            .withMessage('Invalid sort order'),
    ],
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: errors.array(),
                });
            }

            const { status, priority, search, sortBy = 'createdAt', order = 'desc' } = req.query;

            // Build query
            const queryObj = { user: req.user._id };

            if (status) queryObj.status = status;
            if (priority) queryObj.priority = priority;

            // Search in title and description
            if (search) {
                queryObj.$or = [
                    { title: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } },
                ];
            }

            // Build sort object
            const sortOrder = order === 'asc' ? 1 : -1;
            const sortObj = {};

            if (sortBy === 'priority') {
                // Custom sort for priority (high > medium > low)
                sortObj.priority = sortOrder;
            } else {
                sortObj[sortBy] = sortOrder;
            }

            const tasks = await Task.find(queryObj).sort(sortObj);

            res.json({
                success: true,
                count: tasks.length,
                data: tasks,
            });
        } catch (error) {
            next(error);
        }
    }
);

/**
 * @route   GET /api/tasks/:id
 * @desc    Get a single task by ID
 * @access  Private
 */
router.get('/:id', async (req, res, next) => {
    try {
        const task = await Task.findOne({
            _id: req.params.id,
            user: req.user._id,
        });

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found',
            });
        }

        res.json({
            success: true,
            data: task,
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   POST /api/tasks
 * @desc    Create a new task
 * @access  Private
 */
router.post(
    '/',
    [
        body('title')
            .trim()
            .notEmpty()
            .withMessage('Title is required')
            .isLength({ min: 1, max: 100 })
            .withMessage('Title must be between 1 and 100 characters'),
        body('description')
            .optional()
            .trim()
            .isLength({ max: 500 })
            .withMessage('Description cannot exceed 500 characters'),
        body('status')
            .optional()
            .isIn(['pending', 'in-progress', 'completed'])
            .withMessage('Invalid status value'),
        body('priority')
            .optional()
            .isIn(['low', 'medium', 'high'])
            .withMessage('Invalid priority value'),
        body('dueDate')
            .optional()
            .custom((value) => {
                if (value === null || value === '' || value === undefined) return true;
                return !isNaN(Date.parse(value));
            })
            .withMessage('Invalid date format'),
        body('tags')
            .optional()
            .isArray()
            .withMessage('Tags must be an array'),
    ],
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: errors.array(),
                });
            }

            const { title, description, status, priority, dueDate, tags } = req.body;

            const task = await Task.create({
                user: req.user._id,
                title,
                description,
                status,
                priority,
                dueDate: dueDate || null,
                tags,
            });

            res.status(201).json({
                success: true,
                message: 'Task created successfully',
                data: task,
            });
        } catch (error) {
            next(error);
        }
    }
);

/**
 * @route   PUT /api/tasks/:id
 * @desc    Update a task
 * @access  Private
 */
router.put(
    '/:id',
    [
        body('title')
            .optional()
            .trim()
            .isLength({ min: 1, max: 100 })
            .withMessage('Title must be between 1 and 100 characters'),
        body('description')
            .optional()
            .trim()
            .isLength({ max: 500 })
            .withMessage('Description cannot exceed 500 characters'),
        body('status')
            .optional()
            .isIn(['pending', 'in-progress', 'completed'])
            .withMessage('Invalid status value'),
        body('priority')
            .optional()
            .isIn(['low', 'medium', 'high'])
            .withMessage('Invalid priority value'),
        body('dueDate')
            .optional()
            .custom((value) => {
                if (value === null || value === '' || value === undefined) return true;
                return !isNaN(Date.parse(value));
            })
            .withMessage('Invalid date format'),
        body('tags')
            .optional()
            .isArray()
            .withMessage('Tags must be an array'),
    ],
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: errors.array(),
                });
            }

            // Find task and check ownership
            let task = await Task.findOne({
                _id: req.params.id,
                user: req.user._id,
            });

            if (!task) {
                return res.status(404).json({
                    success: false,
                    message: 'Task not found',
                });
            }

            const { title, description, status, priority, dueDate, tags } = req.body;

            // Build update object
            const updateFields = {};
            if (title !== undefined) updateFields.title = title;
            if (description !== undefined) updateFields.description = description;
            if (status !== undefined) updateFields.status = status;
            if (priority !== undefined) updateFields.priority = priority;
            if (dueDate !== undefined) updateFields.dueDate = dueDate || null;
            if (tags !== undefined) updateFields.tags = tags;

            task = await Task.findByIdAndUpdate(
                req.params.id,
                updateFields,
                { new: true, runValidators: true }
            );

            res.json({
                success: true,
                message: 'Task updated successfully',
                data: task,
            });
        } catch (error) {
            next(error);
        }
    }
);

/**
 * @route   DELETE /api/tasks/:id
 * @desc    Delete a task
 * @access  Private
 */
router.delete('/:id', async (req, res, next) => {
    try {
        const task = await Task.findOne({
            _id: req.params.id,
            user: req.user._id,
        });

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found',
            });
        }

        await Task.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: 'Task deleted successfully',
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
