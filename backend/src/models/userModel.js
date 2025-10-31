//nome, email, genero, idade, localizacao, numero de telefone
import mongoose from 'mongoose';
import isValidEmail from '../utils/emailValidator.js';


const userSchema = new mongoose.Schema({
  name:{
    type: String,
    required:[true,'Name is required'],
    trim: true,  
    minlength: [3, 'Name must have  more than 3 characters'],
    maxlength: [50,'Name must have less than 50 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function(email){
        const result = isValidEmail(email);
        return result.isValid;
      },
      message: 'Invalid Email'
    }
  },
  password_hash: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    enum:['male', 'female', 'other', 'prefers not to disclose'],
    message: 'Gender must be: male, female, other, prefers not to disclose',
    trim: true,
    default: 'prefers not to disclose'
  },
  age:{
    type:Number,
    required: [true,'Age is required'],
    max: [120, 'Invalid age'],
    validate: {
      validator: function(age) { 
        return Number.isInteger(age);
      },
      message:'Age must be an integer'
    }
  },
  address:{
    city:{
      type: String,
      required: [true, 'city is required'],
      trim: true
    },
    neighborhood: {
      type: String,
      required: false,
      trim: true
    }
  },
  phoneNumber: {
    type: String,
    required: [true, 'phoneNumber'],
    trim: true,
    match: [/^(\+\d{1,3})?\s?(\(\d{2}\)\s?)?\d{4,5}-?\d{4}$/, 'Invalid phoneNumber']
  }},
{
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.password_hash;
      return ret;
    }}

});

userSchema.virtual('password')
  .set(function(password) {
    this._password = password;
  })
  .get(function() {
    return this._password;
  });

userSchema.pre('save', async function (next) {
  if(!this.isModified('_password') || this._password){
    return next();
  }
  try{
    this.password_hash = await bcrypt.hash(this._password, 4);
    next();
  } catch (err) {
    next(err);
  }
});

userSchema.methods.passwordIsValid = async function(password) {
  return await bcrypt.compare(password, this.password_hash);
};

export default mongoose.model('User', userSchema);