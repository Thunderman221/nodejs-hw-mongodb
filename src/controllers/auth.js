import createHttpError from 'http-errors';
import {
  createUser,
  loginUser,
  logoutUser,
  refreshSession,
} from '../services/auth.js';

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
