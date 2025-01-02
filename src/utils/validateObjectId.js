import mongoose from 'mongoose';
import createHttpError from 'http-errors';

export const validateObjectId = (id, errorMessage = 'Invalid ID format') => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createHttpError(404, errorMessage);
  }
};
