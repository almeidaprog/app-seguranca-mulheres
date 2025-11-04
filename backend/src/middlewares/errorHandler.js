export const errorHandler = (err, req, res, next) => {
  console.error('Error captured:', err);

  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(error => error.message);
    return res.status(400).json({
      success: false,
      error: 'Invalid data',
      details: errors
    });
  }


  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      error: 'Email already registered'
    });
  }


  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      error: 'Invalid id'
    });
  }

  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
  next();
};


export const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
};