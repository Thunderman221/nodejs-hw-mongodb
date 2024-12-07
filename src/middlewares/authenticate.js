import createHttpError from 'http-errors';
import User from '../db/models/user.js';
import Session from '../db/models/session.js';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw createHttpError(401, 'Authorization token is missing');
    }

    const accessToken = authHeader.split(' ')[1];

    const session = await Session.findOne({ accessToken });

    if (!session) {
      throw createHttpError(401, 'Session not found or invalid');
    }
    if (session.accessTokenValidUntil < new Date())
      throw createHttpError(401, 'Acces token expired');

    const user = await User.findOne(session.userId);

    if (!user) throw createHttpError(401, 'User not found');

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
