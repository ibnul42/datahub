const mongoose = require('mongoose');

const agentSchema = new mongoose.Schema({
  mobile: {
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
  agentType: {
    type: String,
    required: true,
    enum: ['Super Agent', 'Agent', 'Sub Agent']
  },
  nidNumber: {
    type: String,
    required: true,
    trim: true
  },
  birthDate: {
    type: Date,
    required: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Suspended'],
    default: 'Active'
  },
  // Changed from 'documents' to be consistent with file naming
  nidUploaded: {
    type: Boolean,
    default: false
  },
  photoUploaded: {
    type: Boolean,
    default: false
  },
  // Changed from 'documentFiles' to match customer pattern
  nidFile: String,
  photo: String,
  registrationDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Agent', agentSchema);