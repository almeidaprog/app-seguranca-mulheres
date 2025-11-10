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

  if (err.message === 'Email already registered') {
    return res.status(409).json({
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

  if (err.message ==='User not found' || err.message === 'Contact not found') {
    return res.status(404).json({
      success: false,
      error: 'Resource not found'
    });
  }
  if(err.message === 'Incorrect login data'){
    return res.status(400).json({
      success:false,
      error: 'Incorrect email or key'
    });
  }
  if (err.message === 'Error logging out'){
    return res.status(500).json({
      success:false,
      error:'Error logging out'
    });
  }
  if (err.message === 'Unauthorized access'){
    return res.status(401).json({
      success:false,
      error:'Unauthorized access'
    });
  }

  if (err.message === 'This user is already in your contacts'){
    return res.status(400).json({
      success:false,
      error:'This user is already in your contacts'
    });
  }
 if (err.message === 'Not alowed'){
    return res.status(403).json({
      success:false,
      error:'The user does not have permission'
    });
  }
  if (err.message === 'Field notifications is required'){
    return res.status(400).json({
      success:false,
      error:'Missing arguments'
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