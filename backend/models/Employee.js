const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  nidNumber: {
    type: String,
    trim: true
  },
  position: {
    type: String,
    required: true,
    enum: [
      'In-charge',
      'Assistant In-charge',
      'Account\'s Office',
      'Senior Desk Officer',
      'Senior Cashier',
      'Senior Investment worker',
      'Desk Officer',
      'Cashier',
      'Investment Worker',
      'Peon/Security Guard'
    ]
  },
  joiningDate: {
    type: Date
  },
  salary: {
    type: Number
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'On Leave'],
    default: 'Active'
  },
  documents: {
    cv: { type: Boolean, default: false },
    nid: { type: Boolean, default: false },
    agreement: { type: Boolean, default: false },
    office_order: { type: Boolean, default: false },
    applications: { type: Boolean, default: false },
    other: { type: Boolean, default: false }
  },
  documentFiles: {
    cv: String,
    nid: String,
    agreement: String,
    office_order: String,
    applications: String,
    other: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Employee', employeeSchema);
