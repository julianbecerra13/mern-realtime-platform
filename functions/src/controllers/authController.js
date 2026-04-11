const User = require('../models/User');
const Notification = require('../models/Notification');
const jwt = require('jsonwebtoken');
const { generateAccessToken, generateRefreshToken } = require('../utils/tokens');

const seedWelcomeNotifications = async (userId) => {
  const notifications = [
    {
      recipient: userId,
      type: 'success',
      title: 'Welcome to Nexus!',
      message: 'Your account has been created successfully. Explore the platform and start collaborating.',
    },
    {
      recipient: userId,
      type: 'info',
      title: 'Complete your profile',
      message: 'Head over to Profile Settings to add your name and set up a password.',
    },
    {
      recipient: userId,
      type: 'system',
      title: 'Real-time notifications active',
      message: 'You will receive instant alerts when something important happens. Try sending one to another user!',
    },
    {
      recipient: userId,
      type: 'info',
      title: 'Explore the Users directory',
      message: 'Check out the Users page to see who else is on the platform and send them notifications.',
    },
    {
      recipient: userId,
      type: 'success',
      title: 'Create your first task',
      message: 'Use the Tasks page to organize your work. Create, track, and complete tasks with ease.',
    },
  ];
  await Notification.insertMany(notifications);
};

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const user = await User.create({ name, email, password });

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshTokens.push(refreshToken);
    await user.save();

    await seedWelcomeNotifications(user._id);

    res.status(201).json({
      success: true,
      data: { user, accessToken, refreshToken },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user || !user.password) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshTokens.push(refreshToken);
    if (user.refreshTokens.length > 5) {
      user.refreshTokens = user.refreshTokens.slice(-5);
    }
    await user.save();

    res.json({
      success: true,
      data: { user, accessToken, refreshToken },
    });
  } catch (error) {
    next(error);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const token = req.body.refreshToken;
    if (!token) {
      return res.status(401).json({ success: false, message: 'No refresh token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || !user.refreshTokens.includes(token)) {
      return res.status(401).json({ success: false, message: 'Invalid refresh token' });
    }

    user.refreshTokens = user.refreshTokens.filter((t) => t !== token);

    const newAccessToken = generateAccessToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    user.refreshTokens.push(newRefreshToken);
    await user.save();

    res.json({
      success: true,
      data: { accessToken: newAccessToken, refreshToken: newRefreshToken },
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const token = req.body.refreshToken;
    if (token) {
      const user = await User.findById(req.user._id);
      if (user) {
        user.refreshTokens = user.refreshTokens.filter((t) => t !== token);
        await user.save();
      }
    }
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res) => {
  res.json({ success: true, data: req.user });
};

const googleCallback = async (req, res) => {
  const accessToken = generateAccessToken(req.user._id);
  const refreshToken = generateRefreshToken(req.user._id);

  req.user.refreshTokens.push(refreshToken);
  await req.user.save();

  res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${accessToken}&refresh=${refreshToken}`);
};

module.exports = { register, login, refreshToken, logout, getMe, googleCallback };
