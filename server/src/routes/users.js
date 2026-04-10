const express = require('express');
const { body } = require('express-validator');
const { getUsers, getUser, updateProfile, updatePassword } = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

router.use(protect);

router.get('/', getUsers);
router.get('/:id', getUser);

router.patch(
  '/profile',
  validate([
    body('name').optional().trim().isLength({ min: 1, max: 50 }).withMessage('Name must be 1-50 characters'),
  ]),
  updateProfile
);

router.patch(
  '/password',
  validate([
    body('currentPassword').optional(),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
  ]),
  updatePassword
);

module.exports = router;
