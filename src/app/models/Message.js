import mongoose from 'mongoose';

const { Schema } = mongoose;

const messageSchema = new Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: [true, 'Message content is required'],
    trim: true,
    maxLength: [1000, 'Message content cannot exceed 1000 characters'],
  },
  type: {
    type: String,
    enum: ['text', 'image', 'file', 'audio', 'video'],
    default: 'text',
  },
  status: {
    type: String,
    enum: ['sent', 'delivered', 'read'],
    default: 'sent',
  },
  isEdited: {
    type: Boolean,
    default: false,
  },
  editedAt: {
    type: Date,
  },
  replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
  },
  attachments: [{
    fileName: String,
    fileUrl: String,
    fileSize: Number,
    mimeType: String,
  }],
  metadata: {
    type: mongoose.Schema.Types.Mixed,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  deletedAt: {
    type: Date,
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
messageSchema.index({ senderId: 1, receiverId: 1 });
messageSchema.index({ createdAt: -1 });
messageSchema.index({ status: 1 });

// Compound index for chat history queries
messageSchema.index({ 
  $or: [
    { senderId: 1, receiverId: 1 },
    { senderId: 1, receiverId: 1 }
  ],
  createdAt: -1 
});

// Virtual for conversation participants
messageSchema.virtual('participants').get(function() {
  return [this.senderId, this.receiverId];
});

// Static method to get chat history between two users
messageSchema.statics.getChatHistory = function(userId1, userId2, options = {}) {
  const {
    page = 1,
    limit = 50,
    lastMessageId = null,
  } = options;

  const query = {
    $or: [
      { senderId: userId1, receiverId: userId2 },
      { senderId: userId2, receiverId: userId1 }
    ],
    isDeleted: false,
  };

  // For pagination with cursor (lastMessageId)
  if (lastMessageId) {
    query._id = { $lt: lastMessageId };
  }

  return this.find(query)
    .populate('senderId', 'firstName lastName email profileImage')
    .populate('receiverId', 'firstName lastName email profileImage')
    .populate('replyTo')
    .sort({ createdAt: -1 })
    .limit(parseInt(limit));
};

// Static method to mark messages as read
messageSchema.statics.markAsRead = function(senderId, receiverId) {
  return this.updateMany(
    {
      senderId: senderId,
      receiverId: receiverId,
      status: { $in: ['sent', 'delivered'] }
    },
    {
      status: 'read'
    }
  );
};

// Static method to get unread message count
messageSchema.statics.getUnreadCount = function(userId) {
  return this.countDocuments({
    receiverId: userId,
    status: { $in: ['sent', 'delivered'] },
    isDeleted: false,
  });
};

// Instance method to mark as read
messageSchema.methods.markAsRead = function() {
  this.status = 'read';
  return this.save();
};

// Instance method to soft delete
messageSchema.methods.softDelete = function() {
  this.isDeleted = true;
  this.deletedAt = new Date();
  return this.save();
};

const Message = mongoose.model('Message', messageSchema);

export default Message;
