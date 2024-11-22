const errorHandler = (error, req, res, next) => {
  const status = error.status || 500;

  res.status(status).json({
    status,
    message: status === 500 ? 'Something went wrong' : error.message,
    data: error.message,
  });
};

export default errorHandler;
