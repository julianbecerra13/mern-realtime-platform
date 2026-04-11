const User = require('../models/User');
const Notification = require('../models/Notification');
const Task = require('../models/Task');

const getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const [totalUsers, totalNotifications, unreadNotifications, taskStats] = await Promise.all([
      User.countDocuments(),
      Notification.countDocuments({ recipient: userId }),
      Notification.countDocuments({ recipient: userId, read: false }),
      Task.aggregate([
        { $match: { owner: userId } },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
    ]);

    const tasks = { pending: 0, in_progress: 0, completed: 0, total: 0 };
    taskStats.forEach((s) => {
      tasks[s._id] = s.count;
      tasks.total += s.count;
    });

    res.json({
      success: true,
      data: {
        users: totalUsers,
        notifications: { total: totalNotifications, unread: unreadNotifications },
        tasks,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboardStats };
