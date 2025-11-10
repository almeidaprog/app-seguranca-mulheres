import mongoose from 'mongoose';

const emergencyContactSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  contactType: {
    type: String,
    enum: ['app_user', 'external'],
    required: true
  },
  appUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  externalContact: {
    name: String,
    phoneNumber: {
      type: String,
      trim: true,
      match: [/^(\+\d{1,3})?\s?(\(\d{2}\)\s?)?\d{4,5}-?\d{4}$/, 'Invalid phoneNumber']
    },
    email: String,
    relationship: String
  },
  notifications: {
    routeAlerts: { type: Boolean, default: true }, 
    emergencyAlerts: { type: Boolean, default: true }}
},
{timestamps: true

});
export default mongoose.model('EmergencyContact', emergencyContactSchema);