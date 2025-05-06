const asyncHandler = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(err => {
    console.error(`error: ${err.message}`);
    res.status(err.statusCode || 500).json({
      message: err.message || 'Something went wrong',
      stack: process.env.NODE_ENV === 'production' ? null : err.stack,
      success: false,
    });
  });
};

export default asyncHandler;
