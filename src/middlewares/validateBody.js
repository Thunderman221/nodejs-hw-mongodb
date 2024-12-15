import createHttpError from 'http-errors';

export const validateBody = (schema) => (req, res, next) => {
  console.log('Incoming request body:', req.body);
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const message = error.details.map((detail) => detail.message).join(', ');
    return next(createHttpError(400, message));
  }
  next();
};
