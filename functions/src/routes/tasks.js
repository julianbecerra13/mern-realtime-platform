const express = require('express');
const { body } = require('express-validator');
const { getTasks, createTask, updateTask, deleteTask, getTaskStats } = require('../controllers/taskController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

router.use(protect);

router.get('/', getTasks);
router.get('/stats', getTaskStats);

router.post(
  '/',
  validate([
    body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 200 }),
    body('description').optional().isLength({ max: 1000 }),
    body('priority').optional().isIn(['low', 'medium', 'high']),
  ]),
  createTask
);

router.patch(
  '/:id',
  validate([
    body('title').optional().trim().isLength({ min: 1, max: 200 }),
    body('status').optional().isIn(['pending', 'in_progress', 'completed']),
    body('priority').optional().isIn(['low', 'medium', 'high']),
  ]),
  updateTask
);

router.delete('/:id', deleteTask);

module.exports = router;
