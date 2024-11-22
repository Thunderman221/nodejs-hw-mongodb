import createError from 'http-errors';

const notFoundHandler = (req, res, next) => {
  next(createError(404, 'Not Found'));
};

export default notFoundHandler;
