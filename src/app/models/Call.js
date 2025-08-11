import mongoose from 'mongoose';

const { Schema } = mongoose;

const callSchema = new Schema({
  callerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  callId: {
    type: String,
    required: true,
    unique: true,
  },
  type: {
    type: String,
    enum: ['voice', 'video'],
    required: true,
  },
  status: {
    type: String,
    enum: ['initiated', 'ringing', 'answered', 'ended', 'missed', 'declined', 'failed'],
    default: 'initiated',
  },
  startTime: {
    type: Date,
    default: Date.now,
  },
  endTime: {
    type: Date,
  },
  duration: {
    type: Number, // Duration in seconds
    default: 0,
  },
  quality: {
    type: String,
    enum: ['excellent', 'good', 'poor', 'failed'],
  },
  endReason: {
    type: String,
    enum: ['completed', 'caller_ended', 'receiver_ended', 'network_issue', 'declined', 'timeout'],
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.__v;
      return ret;
    },
  },
});

// Indexes for better query performance
callSchema.index({ callerId: 1 });
callSchema.index({ receiverId: 1 });
callSchema.index({ callId: 1 });
callSchema.index({ status: 1 });
callSchema.index({ startTime: -1 });

// Virtual for formatted duration
callSchema.virtual('formattedDuration').get(function() {
  if (!this.duration) return '00:00';
  
  const minutes = Math.floor(this.duration / 60);
  const seconds = this.duration % 60;
  
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
});

// Virtual for call participants
callSchema.virtual('participants').get(function() {
  return [this.callerId, this.receiverId];
});

// Pre-save middleware to calculate duration
callSchema.pre('save', function(next) {
  if (this.endTime && this.startTime) {
    this.duration = Math.floor((this.endTime - this.startTime) / 1000);
  }
  next();
});

// Static method to get active call for user
callSchema.statics.getActiveCall = function(userId) {
  return this.findOne({
    $or: [
      { callerId: userId },
      { receiverId: userId }
    ],
    status: { $in: ['initiated', 'ringing', 'answered'] },
    isActive: true,
  }).populate('callerId receiverId', 'firstName lastName email profileImage');
};

// Static method to get call history for user
callSchema.statics.getCallHistory = function(userId, options = {}) {
  const {
    page = 1,
    limit = 20,
    type = null,
    status = null,
  } = options;

  const query = {
    $or: [
      { callerId: userId },
      { receiverId: userId }
    ],
    isActive: true,
  };

  if (type) {
    query.type = type;
  }

  if (status) {
    query.status = status;
  }

  const skip = (page - 1) * limit;

  return this.find(query)
    .populate('callerId', 'firstName lastName email profileImage')
    .populate('receiverId', 'firstName lastName email profileImage')
    .sort({ startTime: -1 })
    .skip(skip)
    .limit(parseInt(limit));
};

// Static method to end all active calls for user
callSchema.statics.endUserActiveCalls = function(userId, reason = 'user_disconnected') {
  return this.updateMany(
    {
      $or: [
        { callerId: userId },
        { receiverId: userId }
      ],
      status: { $in: ['initiated', 'ringing', 'answered'] },
      isActive: true,
    },
    {
      status: 'ended',
      endTime: new Date(),
      endReason: reason,
    }
  );
};

// Instance method to end call
callSchema.methods.endCall = function(reason = 'completed') {
  this.status = 'ended';
  this.endTime = new Date();
  this.endReason = reason;
  return this.save();
};

// Instance method to answer call
callSchema.methods.answerCall = function() {
  this.status = 'answered';
  return this.save();
};

// Instance method to decline call
callSchema.methods.declineCall = function() {
  this.status = 'declined';
  this.endTime = new Date();
  this.endReason = 'declined';
  return this.save();
};

// Static method to generate unique call ID
callSchema.statics.generateCallId = function() {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000000);
  return `CALL_${timestamp}_${random}`;
};

const Call = mongoose.model('Call', callSchema);

export default Call;
