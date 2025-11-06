import User from '../models/userModel.js';

//controller
export const createUser= async (req, res, next) => {
  try{
    const {name, age, email, password_hash, gender, address, phoneNumber} = req.body;

    const user = new User({name, age, email, password_hash, gender, address, phoneNumber});

    const existingUser = await User.findOne({ email });
    if (existingUser) throw new Error('Email already registered');

    await user.save();

    res.status(201).json({
      success: true,
      message: 'User created succefully.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        age: user.age,
        gender: user.gender,
        address: user.address,
        phoneNumber: user.phoneNumber,
        createdAt: user.createdAt
      }
    });
    
  }catch(err){
    next(err);
  }
};
export const getUser = async (req, res, next)=> {
  try {
    const user = await User.findById(req.session.userId).select('-password_hash');
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};
export const updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.session.userId,
      { $set: req.body },
      { new: true }
    ).select('-password_hash');

    res.json({
      success: true,
      message: 'User updated',
      user
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
try {
    const userId = req.session.userId;

    req.session.destroy((err) => {
      if (err) {
          const error = new Error('Error logging out');
          throw error;
        } })
        
        res.clearCookie('app-seguranca.sid');

    await User.findByIdAndDelete(userId);

      res.json({ success: true, message: 'Account deleted sucefully' });
    }
   catch (error) {
    next(error);
  }
};
