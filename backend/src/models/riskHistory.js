import mongoose from 'mongoose';

const riskHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  riskLevel: {
    type: String,
    enum: [ 'high', 'critical'],
    required: true
  },
  spokenWords: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('RiskHistory', riskHistorySchema);