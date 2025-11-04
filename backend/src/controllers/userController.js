import User from '../models/userModel.js';

//controller
export const createUser= async (req, res) => {
  try{
    const {name, age, email, password_hash, gender, address, phoneNumber} = req.body;

    const user = new User({name, age, email, password_hash, gender, address, phoneNumber});

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