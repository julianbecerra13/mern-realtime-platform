const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    type: {
      type: String,
      enum: ['info', 'success', 'warning', 'error', 'system'],
      default: 'info',
    },
    title: {
      type: String,
      required: [true, 'Notification title is required'],
      maxlength: 100,
    },
    message: {
      type: String,
      required: [true, 'Notification message is required'],
      maxlength: 500,
    },
    read: {
      type: Boolean,
      default: false,
    },
    actionUrl: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

notificationSchema.index({ recipient: 1, read: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
