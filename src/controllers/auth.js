import createHttpError from 'http-errors';
import {
  createUser,
  loginUser,
  logoutUser,
  refreshSession,
  requestResetToken,
  resetPassword,
} from '../services/auth.js';

import { APP_DOMAIN, SMTP } from '../constants/index.js';
// import jwt from 'jsonwebtoken';
import sendMail from '../utils/sendMail.js';

export const registerUserController = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      throw createHttpError(400, 'Missing required fields');
    }

    const user = await createUser({ name, email, password });

    res.status(201).json({
      status: 'success',
      message: 'Successfully registered a user!',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const loginController = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw createHttpError(400, 'Missing required fields');
    }

    const { accessToken, refreshToken } = await loginUser({ email, password });

    res
      .status(200)
      .cookie('refreshToken', refreshToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      })
      .json({
        status: 'success',
        message: 'Successfully logged in an user!',
        data: { accessToken },
      });
  } catch (error) {
    next(error);
  }
};

export const refreshController = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      throw createHttpError(401, 'Refresh token is missing');
    }

    const { accessToken, refreshToken: newRefreshToken } = await refreshSession(
      refreshToken,
    );

    res
      .status(200)
      .cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      })
      .json({
        status: 'success',
        message: 'Successfully refreshed a session!',
        data: { accessToken },
      });
  } catch (error) {
    next(error);
  }
};

export const logoutController = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      throw createHttpError(401, 'Refresh token is missing');
    }

    await logoutUser(refreshToken);

    res.clearCookie('refreshToken', {
      httpOnly: true,
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const sendResetEmailController = async (req, res, next) => {
  try {
    const { email } = req.body;

    const token = await requestResetToken(email);

    const resetLink = `${APP_DOMAIN}/reset-password?token=${token}`;

    const mailOptions = {
      from: SMTP.SMTP_FROM,
      to: email,
      subject: 'Password Reset Request',
      text: `You requested a password reset. Use the following link to reset your password: ${resetLink}`,
      html: `<p>You requested a password reset.</p>
             <p>Use the following link to reset your password:</p>
             <a href="${resetLink}">${resetLink}</a>`,
    };

    await sendMail(mailOptions);

    res.status(200).json({
      status: 200,
      message: 'Reset password email has been successfully sent.',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

export const resetPasswordController = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      throw createHttpError(400, 'Missing required fielsd');
    }

    await resetPassword({ token, password });

    res.status(200).json({
      status: 200,
      message: 'Password has been successfully reset!',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};
