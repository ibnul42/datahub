const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    nidNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    mobile: {
      type: String,
      required: true,
      trim: true,
    },
    birthDate: {
      type: Date,
      required: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    nidUploaded: {
      type: Boolean,
      default: false,
    },
    nidFile: {
      type: String,
    },
    photo: {
      type: String,
    },
    photoUploaded: {
      type: Boolean,
      default: false,
    },
    registrationDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Customer", customerSchema);
