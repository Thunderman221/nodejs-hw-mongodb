import crypto from 'node:crypto';

import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import User from '../db/models/user.js';
import Session from '../db/models/session.js';

import jwt from 'jsonwebtoken';
// import { JWT_SECRET } from '../constants/index.js';

export const createUser = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createHttpError(409, 'Email in use');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    name,
    email,
    password: hashedPassword,
  });

  await newUser.save();

  return newUser;
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw createHttpError(401, 'Email or password is incorrect');
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw createHttpError(401, 'Email or password is incorrect');
  }

  await Session.deleteMany({ userId: user._id });

  const accessToken = crypto.randomBytes(30).toString('base64');
  const refreshToken = crypto.randomBytes(30).toString('base64');

  const accessTokenExpiry = new Date(Date.now() + 15 * 60 * 1000);
  const refreshTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await Session.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: accessTokenExpiry,
    refreshTokenValidUntil: refreshTokenExpiry,
  });

  return { accessToken, refreshToken };
};

export const refreshSession = async (refreshToken) => {
  const session = await Session.findOne({ refreshToken });

  if (!session) {
    throw createHttpError(401, 'Invalid refresh token');
  }

  if (new Date() > session.refreshTokenValidUntil) {
    await Session.deleteOne({ _id: session._id });
    throw createHttpError(401, 'Refresh token expired');
  }

  await Session.deleteOne({ _id: session._id });

  const accessToken = crypto.randomBytes(30).toString('base64');
  const newRefreshToken = crypto.randomBytes(30).toString('base64');

  const accessTokenExpiry = new Date(Date.now() + 15 * 60 * 1000);
  const refreshTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await Session.create({
    userId: session.userId,
    accessToken,
    refreshToken: newRefreshToken,
    accessTokenValidUntil: accessTokenExpiry,
    refreshTokenValidUntil: refreshTokenExpiry,
  });

  return { accessToken, refreshToken: newRefreshToken };
};

export const logoutUser = async (refreshToken) => {
  const session = await Session.findOne({ refreshToken });

  if (!session) {
    throw createHttpError(401, 'Invalid session or already logged out');
  }

  await Session.deleteOne({ _id: session._id });
};

export const requestResetToken = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  const token = jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: '5m',
  });

  return token;
};

export const resetPassword = async ({ token, password }) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { email } = decoded;

    const user = await User.findOne({ email });
    if (!user) {
      throw createHttpError(404, 'User not found!');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    await user.save();

    await Session.deleteMany({ userId: user._id });
  } catch (error) {
    if (
      error.name === 'TokenExpiredError' ||
      error.name === 'JsonWebTokenError'
    ) {
      throw createHttpError(401, 'Token is expired or valid.');
    }
    throw error;
  }
};
