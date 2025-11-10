import User from '../models/userModel.js';
export const requireAuth = (req, res, next) => {
  if(req.session && req.session.isLoggedIn) {
    next();
  } else{
    next(new Error('Unauthorized access'));
  }
};

export const attachUser = async (req, res, next) => {
  try {
    if (req.session && req.session.userId) {
      const user = await User
        .findById(req.session.userId)
        .select('-password_hash');
      req.user = user;
    }
    next();
  } catch (error) {
    next(error);
  }
};