import mongoose from 'mongoose';

const { Schema } = mongoose;

const transactionSchema = new Schema({
  type: {
    type: String,
    enum: ['credit', 'debit'],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  description: {
    type: String,
    required: true,
  },
  reference: {
    type: String,
    required: true,
    unique: true,
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending',
  },
  balanceAfter: {
    type: Number,
    required: true,
  },
  onePipeReference: {
    type: String,
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
  },
}, {
  timestamps: true,
});

const walletSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  accountNumber: {
    type: String,
    required: true,
    unique: true,
  },
  accountName: {
    type: String,
    required: true,
  },
  balance: {
    type: Number,
    default: 0,
    min: 0,
  },
  currency: {
    type: String,
    default: 'NGN',
    enum: ['NGN', 'USD', 'GBP', 'EUR'],
  },
  status: {
    type: String,
    enum: ['active', 'suspended', 'closed'],
    default: 'active',
  },
  onePipeAccountId: {
    type: String,
    required: true,
    unique: true,
  },
  onePipeCustomerId: {
    type: String,
    required: true,
  },
  bankCode: {
    type: String,
    default: 'ONEPIPE',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  transactions: [transactionSchema],
  dailyTransactionLimit: {
    type: Number,
    default: 100000, // 100,000 NGN
  },
  monthlyTransactionLimit: {
    type: Number,
    default: 1000000, // 1,000,000 NGN
  },
  lastTransactionDate: {
    type: Date,
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
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
walletSchema.index({ userId: 1 });
walletSchema.index({ accountNumber: 1 });
walletSchema.index({ onePipeAccountId: 1 });
walletSchema.index({ status: 1 });

// Virtual for formatted balance
walletSchema.virtual('formattedBalance').get(function() {
  return `${this.currency} ${this.balance.toLocaleString()}`;
});

// Instance method to add transaction
walletSchema.methods.addTransaction = function(transactionData) {
  this.transactions.push(transactionData);
  this.lastTransactionDate = new Date();
  return this.save();
};

// Instance method to update balance
walletSchema.methods.updateBalance = function(amount, type = 'credit') {
  if (type === 'credit') {
    this.balance += amount;
  } else if (type === 'debit') {
    if (this.balance < amount) {
      throw new Error('Insufficient balance');
    }
    this.balance -= amount;
  }
  return this.save();
};

// Static method to find by user ID
walletSchema.statics.findByUserId = function(userId) {
  return this.findOne({ userId, isActive: true });
};

// Static method to find by account number
walletSchema.statics.findByAccountNumber = function(accountNumber) {
  return this.findOne({ accountNumber, isActive: true });
};

// Instance method to check if wallet can transact
walletSchema.methods.canTransact = function(amount) {
  return this.status === 'active' && this.isActive && this.balance >= amount;
};

// Instance method to get transaction history
walletSchema.methods.getTransactionHistory = function(limit = 10, page = 1) {
  const skip = (page - 1) * limit;
  return this.transactions
    .sort({ createdAt: -1 })
    .slice(skip, skip + limit);
};

const Wallet = mongoose.model('Wallet', walletSchema);

export default Wallet;
