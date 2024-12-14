import createHttpError from 'http-errors';
import User from '../db/models/user.js';
import Session from '../db/models/session.js';

export const authenticate = async (req, res, next) => {
  try {
    console.log('Authorization Header:', req.headers.authorization);

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('Missing or invalid Authorization header');
      throw createHttpError(401, 'Authorization token is missing');
    }

    const accessToken = authHeader.split(' ')[1];
    console.log('Access Token:', accessToken);

    const session = await Session.findOne({ accessToken });
    console.log('Session:', session);

    if (!session) {
      throw createHttpError(401, 'Session not found or invalid');
    }

    if (session.accessTokenValidUntil < new Date()) {
      throw createHttpError(401, 'Access token expired');
    }

    const user = await User.findById(session.userId);
    console.log('User:', user);

    if (!user) {
      throw createHttpError(401, 'User not found');
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication Error:', error.message);
    next(error);
  }
};
