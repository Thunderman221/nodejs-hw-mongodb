import createHttpError from 'http-errors';
import User from '../db/models/user.js';
import Session from '../db/models/session.js';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('Missing or invalid Authorization header');
      throw createHttpError(401, 'Authorization token is missing');
    }

    const accessToken = authHeader.split(' ')[1];

    const session = await Session.findOne({ accessToken });

    if (!session) {
      console.error('Session not found for token:', accessToken);
      throw createHttpError(401, 'Session not found or invalid');
    }

    if (session.accessTokenValidUntil < new Date()) {
      console.error('Access token expired:', accessToken);
      throw createHttpError(401, 'Access token expired');
    }

    const user = await User.findById(session.userId);

    if (!user) {
      console.error('User not found for session:', session);
      throw createHttpError(401, 'User not found');
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    next(error);
  }
};
