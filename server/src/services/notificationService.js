const Notification = require('../models/Notification');
const { getIO, isUserOnline } = require('../config/socket');

const createNotification = async ({ recipient, sender, type, title, message, actionUrl }) => {
  const notification = await Notification.create({
    recipient,
    sender,
    type,
    title,
    message,
    actionUrl,
  });

  const populated = await notification.populate('sender', 'name avatar');

  if (isUserOnline(recipient.toString())) {
    getIO().to(`user:${recipient}`).emit('notification:new', populated);
  }

  return notification;
};

const getUserNotifications = async (userId, { page = 1, limit = 20, unreadOnly = false }) => {
  const query = { recipient: userId };
  if (unreadOnly) query.read = false;

  const skip = (page - 1) * limit;

  const [notifications, total] = await Promise.all([
    Notification.find(query)
      .populate('sender', 'name avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Notification.countDocuments(query),
  ]);

  return {
    notifications,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

const markAsRead = async (notificationId, userId) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, recipient: userId },
    { read: true },
    { new: true }
  );
  return notification;
};

const markAllAsRead = async (userId) => {
  await Notification.updateMany({ recipient: userId, read: false }, { read: true });
};

const getUnreadCount = async (userId) => {
  return Notification.countDocuments({ recipient: userId, read: false });
};

const deleteNotification = async (notificationId, userId) => {
  return Notification.findOneAndDelete({ _id: notificationId, recipient: userId });
};

module.exports = {
  createNotification,
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
  deleteNotification,
};
