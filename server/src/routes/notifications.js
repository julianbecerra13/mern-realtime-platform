const express = require('express');
const { body } = require('express-validator');
const {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  createNotification,
} = require('../controllers/notificationController');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

router.use(protect);

router.get('/', getNotifications);
router.get('/unread-count', getUnreadCount);
router.patch('/read-all', markAllAsRead);
router.patch('/:id/read', markAsRead);
router.delete('/:id', deleteNotification);

router.post(
  '/',
  authorize('admin'),
  validate([
    body('recipient').isMongoId().withMessage('Valid recipient ID is required'),
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('message').trim().notEmpty().withMessage('Message is required'),
    body('type').optional().isIn(['info', 'success', 'warning', 'error', 'system']),
  ]),
  createNotification
);

module.exports = router;
