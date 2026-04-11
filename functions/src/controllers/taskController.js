const Task = require('../models/Task');

const getTasks = async (req, res, next) => {
  try {
    const { status, priority, page = 1, limit = 50 } = req.query;
    const query = { owner: req.user._id };
    if (status) query.status = status;
    if (priority) query.priority = priority;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [tasks, total] = await Promise.all([
      Task.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
      Task.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: {
        tasks,
        pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) },
      },
    });
  } catch (error) {
    next(error);
  }
};

const createTask = async (req, res, next) => {
  try {
    const { title, description, priority, dueDate } = req.body;
    const task = await Task.create({ owner: req.user._id, title, description, priority, dueDate });
    res.status(201).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      { title, description, status, priority, dueDate },
      { new: true, runValidators: true }
    );
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    res.json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    res.json({ success: true, message: 'Task deleted' });
  } catch (error) {
    next(error);
  }
};

const getTaskStats = async (req, res, next) => {
  try {
    const [pending, inProgress, completed] = await Promise.all([
      Task.countDocuments({ owner: req.user._id, status: 'pending' }),
      Task.countDocuments({ owner: req.user._id, status: 'in_progress' }),
      Task.countDocuments({ owner: req.user._id, status: 'completed' }),
    ]);
    res.json({ success: true, data: { pending, inProgress, completed, total: pending + inProgress + completed } });
  } catch (error) {
    next(error);
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask, getTaskStats };
